/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  BottomSheet,
  Button,
  Icon,
  Text,
  TextInput,
  showModalConfirm,
} from '@vna-base/components';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { chargeActions } from '@vna-base/redux/action-slice';
import { ModalCustomPicker } from '@vna-base/screens/order-detail/components/modal-custom-picker';
import {
  ItemCustom,
  ModalCustomPickerRef,
} from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { Charge, Passenger } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import {
  ModalMinWidth,
  ModalPaddingHorizontal,
  ModalWidth,
  SnapPoint,
  System,
  SystemDetails,
  convertStringToNumber,
  dispatch,
  getFullNameOfPassenger,
} from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './style';
import {
  ModalFeeRef,
  ModalFeeType,
  listChargeType,
  listCurrencies,
  listOptionPassengers,
  listOptionRoutes,
} from './type';
import { selectViewingOrderId } from '@vna-base/redux/selector';
import { useObject } from '@services/realm/provider';
import { OrderRealm } from '@services/realm/models/order';

export const ModalFee = forwardRef<ModalFeeRef, any>((_, ref) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const viewingOrderId = useSelector(selectViewingOrderId);

  const order = useObject<OrderRealm>(OrderRealm?.schema.name, viewingOrderId!);

  const chargeTypeRef = useRef<ModalCustomPickerRef>(null);
  const passengerRef = useRef<ModalCustomPickerRef>(null);
  const routeFlightRef = useRef<ModalCustomPickerRef>(null);
  const currencyRef = useRef<ModalCustomPickerRef>(null);
  const bookingSystemRef = useRef<ModalCustomPickerRef>(null);
  const normalRef = useRef<BottomSheetModal>(null);

  const [isInsert, setIsInsert] = useState(false);

  const formModalFee = useForm<ModalFeeType>({
    mode: 'all',
  });

  const showContentModalFee = useCallback(
    (flCharge?: Charge) => {
      if (flCharge !== undefined) {
        setIsInsert(false);
        formModalFee.reset({
          Id: flCharge?.Id,
          OrderId: (flCharge?.OrderId as string) ?? order?.Id,
          ChargeType: flCharge?.ChargeType,
          PassengerId: flCharge?.PassengerId,
          PaxName: flCharge?.PaxName,
          Route:
            flCharge?.StartPoint !== null && flCharge?.EndPoint !== null
              ? `${flCharge?.StartPoint}-${flCharge?.EndPoint}`
              : null,
          StartPoint: flCharge?.StartPoint ?? null,
          EndPoint: flCharge?.EndPoint ?? null,
          ChargeValue: flCharge?.ChargeValue ?? '',
          Remark: flCharge?.Remark ?? '',
          Amount: flCharge?.Amount ?? 0,
          Currency: flCharge?.Currency,
          BookingId: flCharge?.BookingId,
        });
      } else {
        setIsInsert(true);
        formModalFee.reset({
          OrderId: order?.Id as string,
          ChargeType: null,
          PassengerId: null,
          PaxName: null,
          Route: null,
          StartPoint: null,
          EndPoint: null,
          ChargeValue: '',
          Remark: '',
          Amount: 0,
          Currency: 'VND',
          BookingId: order!.Bookings[0],
        });
      }

      normalRef.current?.present();
    },
    [formModalFee, order?.Bookings, order?.Id],
  );

  useImperativeHandle(
    ref,
    () => ({
      show: (content?: Charge) => {
        showContentModalFee(content);
      },
    }),
    [showContentModalFee],
  );

  // cmt: get all passenger

  const listPassengers = useMemo(() => {
    const allPassengers: Passenger[] = [];

    order?.Bookings?.[0]?.Passengers?.forEach(passenger => {
      allPassengers.push(passenger);
    });

    return allPassengers;
  }, [order?.Bookings]);

  // cmt: get all passenger with unique value
  const uniquePassengers = useMemo(() => {
    const uniquePsg: Passenger[] = [];
    const uniquePassengerKeys = new Set();

    listPassengers?.forEach(psg => {
      const key = psg.Id;

      if (!uniquePassengerKeys.has(key)) {
        uniquePassengerKeys.add(key);
        uniquePsg.push(psg);
      }
    });

    return uniquePsg;
  }, [listPassengers]);

  // cmt: format passenger to ItemCustom type
  const formatListPsg = uniquePassengers?.map(psg => ({
    key: psg.Id as string,
    t18n: getFullNameOfPassenger(psg),
    description: psg.PaxType,
  }));

  // cmt: choose charge type
  const selectChargeType = (val: string | null) => {
    formModalFee.setValue('ChargeType', val, {
      shouldDirty: true,
    });
  };

  // cmt: list option passenger
  const newListPassenger = listOptionPassengers.concat(
    formatListPsg as ItemCustom[],
  );

  // cmt: choose passenger
  const showModalChoosePassenger = () => {
    const PaxName = newListPassenger.filter(
      item =>
        item.t18n === formModalFee.getValues('PaxName') ||
        item.key === formModalFee.getValues('PaxName'),
    );

    passengerRef.current?.present(PaxName[0]?.key ?? null);
  };

  const selectPassenger = (val: string | null) => {
    formModalFee.setValue('PaxName', val, {
      shouldDirty: true,
    });
  };

  const routeFlight = useMemo(() => {
    const rou: Array<{ key: string; t18n: string }> = [];
    order?.Bookings?.forEach(booking => {
      rou?.push({
        key: `${booking.StartPoint}-${booking.EndPoint}`,
        t18n: `${booking.StartPoint} - ${booking.EndPoint}`,
      });

      booking.Flights?.forEach(flight => {
        if (
          flight.StartPoint !== booking.StartPoint ||
          flight.EndPoint !== booking.EndPoint
        ) {
          rou?.push({
            key: `${flight.StartPoint}-${flight.EndPoint}`,
            t18n: `${flight.StartPoint} - ${flight.EndPoint}`,
          });
          return;
        }

        flight.Segments?.forEach(seg => {
          if (
            seg?.StartPoint !== booking.StartPoint ||
            seg?.EndPoint !== booking.EndPoint ||
            seg?.StartPoint !== flight.StartPoint ||
            seg?.EndPoint !== flight.EndPoint
          ) {
            rou?.push({
              key: `${seg.StartPoint}-${seg.EndPoint}`,
              t18n: `${seg.StartPoint} - ${seg.EndPoint}`,
            });
            return;
          }
        });
      });
    });

    return rou;
  }, [order?.Bookings]);

  const newRouteFlight = listOptionRoutes.concat(routeFlight as ItemCustom[]);

  const showModalRoutesFlight = () => {
    routeFlightRef.current?.present(formModalFee.getValues('Route'));
  };

  const selectRouteFlight = (val: string | null) => {
    formModalFee.setValue('Route', val, {
      shouldDirty: true,
    });
  };

  // cmt: choose currency
  const openModalCurrency = () => {
    currencyRef.current?.present(formModalFee.getValues('Currency'));
  };

  const selectCurrency = (val: string | null) => {
    formModalFee.setValue('Currency', val, { shouldDirty: true });
  };

  // list booking
  const listBookings = useMemo(
    () =>
      order?.Bookings?.map(flBooking => ({
        key: flBooking.Id,
        t18n: SystemDetails[flBooking.System as System]?.t18n,
        description: `${flBooking.StartPoint}-${flBooking.EndPoint}`,
      })),
    [order?.Bookings],
  );

  const showBookingSystem = () => {
    bookingSystemRef.current?.present(formModalFee.getValues('BookingId'));
  };

  const selectBookingSystem = (val: string | null) => {
    formModalFee.setValue('BookingId', val, {
      shouldDirty: true,
    });
  };

  const submit = useCallback(() => {
    normalRef.current?.close();

    formModalFee.handleSubmit(form => {
      // TODO: save data was edited or save new data here
      const paxName = newListPassenger.filter(
        item => item.key === form.PaxName,
      );

      const PaxName = paxName[0] !== undefined ? paxName[0].t18n : form.PaxName;

      const psg = newListPassenger.find(
        item => item.t18n.toLowerCase() === PaxName?.toLowerCase(),
      );

      const StartPoint = form.Route?.split('-')[0];
      const EndPoint = form.Route?.split('-')[1];
      const Amount =
        form.ChargeType === 'DISCOUNT' ? -form.Amount : form.Amount;

      if (isInsert) {
        dispatch(
          chargeActions.insertFlightCharge(
            {
              ...form,
              StartPoint: StartPoint!,
              EndPoint: EndPoint!,
              Amount: Number(Amount.toString().replaceAll(',', '')),
              PaxName,
              PassengerId: psg?.key ?? null,
            },
            () => {
              showModalConfirm({
                t18nTitle: 'order_detail:inserted_data',
                t18nSubtitle: 'order_detail:sub_modal_confirm',
                t18nCancel: 'modal_confirm:close',
                themeColorCancel: 'neutral50',
                themeColorTextCancel: 'neutral900',
              });
            },
          ),
        );
      } else {
        dispatch(
          chargeActions.updateFlightCharge(
            {
              ...form,
              StartPoint: StartPoint!,
              EndPoint: EndPoint!,
              Amount: Number(Amount.toString().replaceAll(',', '')),
              PaxName,
              PassengerId: psg?.key ?? null,
            },
            () => {
              showModalConfirm({
                t18nTitle: 'order_detail:updated_data',
                t18nSubtitle: 'order_detail:sub_modal_confirm',
                t18nCancel: 'modal_confirm:close',
                themeColorCancel: 'neutral50',
                themeColorTextCancel: 'neutral900',
              });
            },
          ),
        );
      }
    })();
  }, [formModalFee, isInsert, newListPassenger]);

  const _onCancel = () => {
    normalRef.current?.dismiss();
  };

  return (
    /**
     * ở phần này không dùng Modal vì khi dùng modal thì các bottomsheet chargeTypeRef,..
     * không thể hiển thị lên trên Modal. vì thế phải dùng bottomsheet
     */
    <>
      <BottomSheet
        useDynamicSnapPoint={true}
        ref={normalRef}
        showCloseButton={false}
        showIndicator={false}
        showLineBottomHeader={false}
        style={{
          marginHorizontal: ModalPaddingHorizontal,
        }}
        header={<Block />}
        paddingBottom={false}
        enablePanDownToClose={false}
        enableOverDrag={false}
        detachedCenter={true}
        disablePressBackDrop={true}>
        <FormProvider {...formModalFee}>
          <Block
            colorTheme="neutral100"
            borderRadius={16}
            minWidth={ModalMinWidth}
            alignSelf="center"
            width={ModalWidth}
            marginTop={16}>
            <BottomSheetScrollView
              contentContainerStyle={{ paddingHorizontal: 16, rowGap: 16 }}>
              {/* //cmt: choose chargeType controller */}
              <Controller
                control={formModalFee.control}
                name={'ChargeType'}
                render={({ field: { value } }) => {
                  const text = listChargeType.filter(
                    item => item.key === value,
                  );

                  return (
                    <Block flex={1} marginTop={4}>
                      <Pressable
                        onPress={() => {
                          chargeTypeRef.current?.present(
                            formModalFee.getValues('ChargeType'),
                          );
                        }}
                        disabled={
                          value !== null &&
                          !listChargeType.map(item => item.key).includes(value)
                        }
                        style={styles.row}>
                        <Text
                          colorTheme="neutral900"
                          fontStyle="Body16Reg"
                          t18n={
                            value
                              ? text[0]?.t18n ?? value
                              : 'order_detail:type_costs'
                          }
                        />
                        {(value === null ||
                          listChargeType
                            .map(item => item.key)
                            .includes(value)) && (
                          <Icon
                            icon="arrow_ios_down_fill"
                            size={24}
                            colorTheme="neutral900"
                          />
                        )}
                      </Pressable>
                      {value && (
                        <Block
                          position="absolute"
                          left={8}
                          style={{ top: -8 }}
                          paddingHorizontal={4}
                          colorTheme="neutral100">
                          <Text
                            t18n="order_detail:type_costs"
                            fontStyle="Body12Reg"
                            colorTheme="neutral600"
                          />
                        </Block>
                      )}
                      <ModalCustomPicker
                        ref={chargeTypeRef}
                        data={listChargeType}
                        snapPoints={['30%']}
                        showCloseButton={false}
                        showIndicator={true}
                        hasDescription
                        t18nTitle={undefined as unknown as I18nKeys}
                        handleDone={selectChargeType}
                      />
                    </Block>
                  );
                }}
              />
              {/* //cmt: choose booking controller */}
              {listBookings && listBookings?.length > 1 && (
                <Controller
                  control={formModalFee.control}
                  name={'BookingId'}
                  render={({ field: { value } }) => {
                    const text = listBookings?.filter(
                      item => item.key === value,
                    );

                    return (
                      <Block flex={1}>
                        <Pressable
                          onPress={showBookingSystem}
                          style={styles.row}>
                          <Text
                            colorTheme="neutral900"
                            fontStyle="Body16Reg"
                            t18n={text?.[0]?.t18n ?? (value as I18nKeys)}
                          />
                          {(value === null ||
                            listBookings
                              ?.map(item => item.key)
                              .includes(value)) && (
                            <Icon
                              icon="arrow_ios_down_fill"
                              size={24}
                              colorTheme="neutral900"
                            />
                          )}
                        </Pressable>
                        <Block
                          position="absolute"
                          left={8}
                          style={{ top: -8 }}
                          paddingHorizontal={4}
                          colorTheme="neutral100">
                          <Text
                            t18n="order_detail:booking"
                            fontStyle="Body12Reg"
                            colorTheme="neutral600"
                          />
                        </Block>
                        <ModalCustomPicker
                          ref={bookingSystemRef}
                          data={listBookings as ItemCustom[]}
                          snapPoints={['30%']}
                          showCloseButton={false}
                          showIndicator={true}
                          hasDescription
                          t18nTitle={undefined as unknown as I18nKeys}
                          handleDone={selectBookingSystem}
                        />
                      </Block>
                    );
                  }}
                />
              )}
              {/* //cmt: choose PaxName controller */}
              <Controller
                control={formModalFee.control}
                name={'PaxName'}
                render={({ field: { value } }) => {
                  const text = newListPassenger.find(
                    item => item.key === value || item.t18n === value,
                  );
                  return (
                    <Block flex={1}>
                      <Pressable
                        onPress={showModalChoosePassenger}
                        style={styles.row}>
                        <Text
                          colorTheme="neutral900"
                          fontStyle="Body16Reg"
                          t18n={text?.t18n ?? 'order_detail:all'}
                        />
                        <Icon
                          icon="arrow_ios_down_fill"
                          size={24}
                          colorTheme="neutral900"
                        />
                      </Pressable>
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Text
                          t18n="booking:passenger"
                          fontStyle="Body12Reg"
                          colorTheme="neutral600"
                        />
                      </Block>
                      <ModalCustomPicker
                        ref={passengerRef}
                        data={newListPassenger}
                        snapPoints={[SnapPoint.Half]}
                        showCloseButton={false}
                        showIndicator={true}
                        hasDescription
                        t18nTitle={undefined as unknown as I18nKeys}
                        handleDone={selectPassenger}
                      />
                    </Block>
                  );
                }}
              />
              {/* //cmt: choose Route controller */}
              <Controller
                control={formModalFee.control}
                name={'Route'}
                render={({ field: { value } }) => {
                  const val = newRouteFlight.find(item => item.key === value);
                  return (
                    <Block flex={1}>
                      <Pressable
                        onPress={showModalRoutesFlight}
                        style={styles.row}>
                        <Text
                          colorTheme="neutral900"
                          fontStyle="Body16Reg"
                          text={value as string}
                          t18n={val?.t18n ?? 'order_detail:all'}
                        />
                        <Icon
                          icon="arrow_ios_down_fill"
                          size={24}
                          colorTheme="neutral900"
                        />
                      </Pressable>
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Text
                          t18n="order_detail:stage"
                          fontStyle="Body12Reg"
                          colorTheme="neutral600"
                        />
                      </Block>
                      <ModalCustomPicker
                        ref={routeFlightRef}
                        data={newRouteFlight}
                        snapPoints={['50%']}
                        showCloseButton={false}
                        showIndicator={true}
                        t18nTitle={undefined as unknown as I18nKeys}
                        handleDone={selectRouteFlight}
                      />
                    </Block>
                  );
                }}
              />
              {/* //cmt: choose ChargeValue controller */}
              <Controller
                control={formModalFee.control}
                name={'ChargeValue'}
                render={({ field: { value, onChange } }) => (
                  <Block flex={1}>
                    <TextInput
                      placeholderI18n="order_detail:param"
                      placeholderTextColor={colors.neutral600}
                      defaultValue={value}
                      onChangeText={txt => onChange(txt)}
                    />
                    {value !== '' && (
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Text
                          t18n="order_detail:param"
                          fontStyle="Body12Reg"
                          colorTheme="neutral600"
                        />
                      </Block>
                    )}
                  </Block>
                )}
              />
              {/* //cmt: choose Remark controller */}
              <Controller
                control={formModalFee.control}
                name={'Remark'}
                render={({ field: { value, onChange } }) => (
                  <Block flex={1}>
                    <TextInput
                      useBottomSheetTextInput
                      placeholderI18n="order_detail:note"
                      placeholderTextColor={colors.neutral600}
                      defaultValue={value}
                      onChangeText={txt => onChange(txt)}
                    />
                    {value !== '' && (
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Text
                          t18n="order_detail:note"
                          fontStyle="Body12Reg"
                          colorTheme="neutral600"
                        />
                      </Block>
                    )}
                  </Block>
                )}
              />
              {/* //cmt: choose Amount + Currency controller */}
              <Block flexDirection="row" alignItems="center" columnGap={12}>
                <Controller
                  control={formModalFee.control}
                  name={'Amount'}
                  render={({ field: { value, onChange } }) => (
                    <Block flex={1} height={48}>
                      <TextInput
                        useBottomSheetTextInput
                        placeholderI18n="flight:enter_the_amount_of_money"
                        placeholderTextColor={colors.neutral600}
                        defaultValue={String(value)}
                        onChangeText={txt => {
                          onChange(convertStringToNumber(txt).currencyFormat());
                        }}
                        keyboardType="number-pad"
                      />
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Text
                          t18n="flight:enter_the_amount_of_money"
                          fontStyle="Body12Reg"
                          colorTheme="neutral600"
                        />
                      </Block>
                    </Block>
                  )}
                />
                <Controller
                  control={formModalFee.control}
                  name={'Currency'}
                  render={({ field: { value } }) => {
                    return (
                      <>
                        <Pressable onPress={openModalCurrency}>
                          <Block
                            flex={1}
                            height={48}
                            borderRadius={8}
                            flexDirection="row"
                            alignItems="center"
                            borderWidth={5}
                            padding={12}
                            borderColorTheme="neutral300">
                            <Text
                              text={value ?? ''}
                              fontStyle="Body16Reg"
                              colorTheme="neutral900"
                            />
                            <Icon
                              icon="arrow_ios_down_fill"
                              size={22}
                              colorTheme="neutral900"
                            />
                          </Block>
                        </Pressable>
                        <ModalCustomPicker
                          ref={currencyRef}
                          data={listCurrencies}
                          showCloseButton={false}
                          showIndicator
                          snapPoints={['25%']}
                          t18nTitle={undefined as unknown as I18nKeys}
                          handleDone={selectCurrency}
                        />
                      </>
                    );
                  }}
                />
              </Block>
              {/* //cmt: button footer */}
              <Block
                flexDirection="row"
                alignItems="center"
                marginBottom={16}
                columnGap={16}
                justifyContent="space-between">
                <Block flex={1}>
                  <Button
                    type="classic"
                    fullWidth
                    size="medium"
                    t18n="common:cancel"
                    textColorTheme="neutral900"
                    onPress={_onCancel}
                  />
                </Block>
                <Block flex={1}>
                  <Button
                    type="classic"
                    buttonStyle={{ backgroundColor: colors.success600 }}
                    fullWidth
                    size="medium"
                    t18n={
                      isInsert ? 'order_detail:more' : 'order_detail:save_order'
                    }
                    textColorTheme="classicWhite"
                    onPress={submit}
                  />
                </Block>
              </Block>
            </BottomSheetScrollView>
          </Block>
        </FormProvider>
      </BottomSheet>
    </>
  );
});
