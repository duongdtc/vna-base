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
import { selectViewingBookingId } from '@redux-selector';
import { chargeActions } from '@redux-slice';
import { FeeForm, FeeModalRef } from '@vna-base/screens/booking-detail/type';
import { ModalCustomPicker } from '@vna-base/screens/order-detail/components';
import {
  ItemCustom,
  ModalCustomPickerRef,
} from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import {
  ModalFeeType,
  listChargeType,
  listCurrencies,
  listOptionPassengers,
  listOptionRoutes,
} from '@vna-base/screens/order-detail/components/tab-contents/components/tab-booking/type';
import { Charge, Passenger } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import {
  Currency,
  ModalMinWidth,
  ModalPaddingHorizontal,
  ModalWidth,
  SnapPoint,
  convertStringToNumber,
  dispatch,
  getFullNameOfPassenger,
} from '@vna-base/utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export const FeeModalExtendFromOrderDetail = memo(
  forwardRef<FeeModalRef, any>((_, ref) => {
    const styles = useStyles();
    const { colors } = useTheme();

    const bookingId = useSelector(selectViewingBookingId);

    const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId!);

    const normalRef = useRef<BottomSheetModal>(null);
    const chargeTypeRef = useRef<ModalCustomPickerRef>(null);
    const passengerRef = useRef<ModalCustomPickerRef>(null);
    const routeFlightRef = useRef<ModalCustomPickerRef>(null);
    const currencyRef = useRef<ModalCustomPickerRef>(null);

    const [isInsert, setIsInsert] = useState(false);

    const feeForm = useForm<FeeForm>({
      mode: 'all',
    });

    const show = useCallback(
      (flCharge?: Charge) => {
        if (flCharge !== undefined) {
          setIsInsert(false);
          feeForm.reset({
            Id: flCharge.Id,
            OrderId: (flCharge.OrderId as string) ?? bookingDetail?.OrderId,
            ChargeType: flCharge.ChargeType,
            PassengerId: flCharge.PassengerId,
            PaxName: flCharge.PaxName,
            Route:
              flCharge.StartPoint !== null && flCharge.EndPoint !== null
                ? `${flCharge.StartPoint}-${flCharge.EndPoint}`
                : null,
            StartPoint: flCharge.StartPoint ?? null,
            EndPoint: flCharge.EndPoint ?? null,
            ChargeValue: flCharge.ChargeValue ?? '',
            Remark: flCharge.Remark ?? '',
            Amount: flCharge.Amount ?? 0,
            Currency: flCharge.Currency ?? Currency.VND,
            BookingId: flCharge.BookingId,
          });
        } else {
          setIsInsert(true);
          feeForm.reset({
            OrderId: bookingDetail?.OrderId,
            ChargeType: null,
            PassengerId: null,
            PaxName: null,
            Route: null,
            StartPoint: null,
            EndPoint: null,
            ChargeValue: '',
            Remark: '',
            Amount: 0,
            Currency: Currency.VND,
            BookingId: bookingDetail?.Id,
          });
        }

        normalRef.current?.present();
      },
      [bookingDetail?.Id, bookingDetail?.OrderId, feeForm],
    );

    useImperativeHandle(
      ref,
      () => ({
        show,
      }),
      [show],
    );

    const _onCancel = () => {
      normalRef.current?.dismiss();
    };

    // cmt: choose charge type
    const selectChargeType = (val: string | null) => {
      feeForm.setValue('ChargeType', val, {
        shouldDirty: true,
      });
    };

    // cmt: get all passenger in booking detail
    const listPassengers = useMemo(() => {
      const allPassengers: Passenger[] = [];

      bookingDetail?.Passengers?.forEach(passenger => {
        allPassengers.push(passenger);
      });

      return allPassengers;
    }, [bookingDetail?.Passengers]);

    const formatListPsg = listPassengers?.map(psg => ({
      key: psg.Id as string,
      t18n: getFullNameOfPassenger(psg),
      description: psg.PaxType,
    }));

    // cmt: list option passenger
    const newListPassenger = listOptionPassengers.concat(
      formatListPsg as ItemCustom[],
    );

    // cmt: choose passenger
    const showModalChoosePassenger = () => {
      const PaxName = newListPassenger.filter(
        item =>
          item.t18n === feeForm.getValues('PaxName') ||
          item.key === feeForm.getValues('PaxName'),
      );

      passengerRef.current?.present(PaxName[0]?.key ?? null);
    };

    const selectPassenger = (val: string | null) => {
      feeForm.setValue('PaxName', val, {
        shouldDirty: true,
      });
    };

    // cmt: list route
    const routeFlight = useMemo(() => {
      const rou: Array<{ key: string; t18n: string }> = [];

      bookingDetail?.Flights?.forEach(jou => {
        rou?.push({
          key: `${jou.StartPoint}-${jou.EndPoint}`,
          t18n: `${jou.StartPoint} - ${jou.EndPoint}`,
        });

        jou.Segments?.forEach(seg => {
          if (
            seg?.StartPoint !== jou.StartPoint ||
            seg?.EndPoint !== jou.EndPoint
          ) {
            rou?.push({
              key: `${seg.StartPoint}-${seg.EndPoint}`,
              t18n: `${seg.StartPoint} - ${seg.EndPoint}`,
            });
            return;
          }
        });
      });

      return rou;
    }, [bookingDetail?.Flights]);

    const newRouteFlight = listOptionRoutes.concat(routeFlight as ItemCustom[]);

    // cmt: show route option
    const showModalRoutesFlight = () => {
      routeFlightRef.current?.present(feeForm.getValues('Route'));
    };

    // cmt: select route
    const selectRouteFlight = (val: string | null) => {
      feeForm.setValue('Route', val, {
        shouldDirty: true,
      });
    };

    // cmt: choose currency
    const openModalCurrency = () => {
      currencyRef.current?.present(feeForm.getValues('Currency')!);
    };

    const selectCurrency = (val: string | null) => {
      feeForm.setValue('Currency', val, { shouldDirty: true });
    };

    const submit = useCallback(() => {
      normalRef.current?.close();

      feeForm.handleSubmit(form => {
        // TODO: save data was edited or save new data here
        const paxName = newListPassenger.filter(
          item => item.key === form.PaxName,
        );

        const PaxName =
          paxName[0] !== undefined ? paxName[0].t18n : form.PaxName;

        const psg = newListPassenger.find(
          item => item.t18n.toLowerCase() === PaxName?.toLowerCase(),
        );

        const StartPoint = form.Route?.split('-')[0];
        const EndPoint = form.Route?.split('-')[1];
        const Amount =
          (form.ChargeType === 'DISCOUNT' && form.Amount
            ? -form.Amount
            : form.Amount) ?? 0;

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
              } as ModalFeeType,
              () => {
                showModalConfirm({
                  t18nTitle: 'order_detail:inserted_data',
                  t18nSubtitle: 'order_detail:sub_modal_confirm',
                  t18nCancel: 'modal_confirm:close',
                  themeColorCancel: 'neutral50',
                  themeColorTextCancel: 'neutral900',
                });
                // dispatch(bookingActions.getBookingById(form.BookingId!));
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
              } as ModalFeeType,
              () => {
                showModalConfirm({
                  t18nTitle: 'order_detail:updated_data',
                  t18nSubtitle: 'order_detail:sub_modal_confirm',
                  t18nCancel: 'modal_confirm:close',
                  themeColorCancel: 'neutral50',
                  themeColorTextCancel: 'neutral900',
                });
                // dispatch(bookingActions.getBookingById(form.BookingId!));
              },
            ),
          );
        }
      })();
    }, [feeForm, isInsert, newListPassenger]);

    return (
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
          <FormProvider {...feeForm}>
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
                  control={feeForm.control}
                  name={'ChargeType'}
                  render={({ field: { value } }) => {
                    const text = listChargeType.filter(
                      item => item.key === value,
                    );

                    const disable =
                      value !== null &&
                      !listChargeType.map(item => item.key).includes(value!);

                    return (
                      <Block flex={1} marginTop={4}>
                        <Pressable
                          onPress={() => {
                            chargeTypeRef.current?.present(
                              feeForm.getValues('ChargeType')!,
                            );
                          }}
                          disabled={disable}
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
                              .includes(value!)) && (
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
                {/* //cmt: choose PaxName controller */}
                <Controller
                  control={feeForm.control}
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
                  control={feeForm.control}
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
                  control={feeForm.control}
                  name={'ChargeValue'}
                  render={({ field: { value, onChange } }) => (
                    <Block flex={1}>
                      <TextInput
                        placeholderI18n="order_detail:param"
                        placeholderTextColor={colors.neutral600}
                        defaultValue={value!}
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
                  control={feeForm.control}
                  name={'Remark'}
                  render={({ field: { value, onChange } }) => (
                    <Block flex={1}>
                      <TextInput
                        useBottomSheetTextInput
                        placeholderI18n="order_detail:note"
                        placeholderTextColor={colors.neutral600}
                        defaultValue={value!}
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
                    control={feeForm.control}
                    name={'Amount'}
                    render={({ field: { value, onChange } }) => (
                      <Block flex={1} height={48}>
                        <TextInput
                          useBottomSheetTextInput
                          placeholderI18n="flight:enter_the_amount_of_money"
                          placeholderTextColor={colors.neutral600}
                          defaultValue={String(value)}
                          onChangeText={txt => {
                            onChange(
                              convertStringToNumber(txt).currencyFormat(),
                            );
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
                    control={feeForm.control}
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
                                text={value!}
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
                            showCloseButton={false}
                            showIndicator
                            data={listCurrencies}
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
                        isInsert
                          ? 'order_detail:more'
                          : 'order_detail:save_order'
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
  }),
  isEqual,
);
