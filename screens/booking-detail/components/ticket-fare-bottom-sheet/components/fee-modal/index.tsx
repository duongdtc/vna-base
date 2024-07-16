import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FeeForm, FeeModalRef } from '@vna-base/screens/booking-detail/type';
import { ModalCustomPickerRef } from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { Charge } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useStyles } from './styles';

export const FeeModal = memo(
  forwardRef<FeeModalRef, any>((_, ref) => {
    const styles = useStyles();
    const { colors } = useTheme();

    const normalRef = useRef<BottomSheetModal>(null);

    const chargeTypeRef = useRef<ModalCustomPickerRef>(null);
    const passengerRef = useRef<ModalCustomPickerRef>(null);
    const routeFlightRef = useRef<ModalCustomPickerRef>(null);
    const currencyRef = useRef<ModalCustomPickerRef>(null);

    const feeForm = useForm<FeeForm>({
      mode: 'all',
    });

    const show = (flCharge?: Charge) => {
      feeForm.reset({
        Id: flCharge?.Id,
        OrderId: flCharge?.OrderId,
        BookingId: flCharge?.BookingId,
        ChargeType: flCharge?.ChargeType,
        PassengerId: flCharge?.PassengerId,
        StartPoint: flCharge?.StartPoint ?? null,
        EndPoint: flCharge?.EndPoint ?? null,
        ChargeValue: flCharge?.ChargeValue ?? '',
        Remark: flCharge?.Remark ?? '',
        Amount: flCharge?.Amount ?? 0,
        Currency: flCharge?.Currency,
      });

      normalRef.current?.present();
    };

    useImperativeHandle(
      ref,
      () => ({
        show,
      }),
      [],
    );

    // // cmt: get all passenger

    // const listPassengers = useMemo(() => {
    //   const allPassengers: FlightPassenger[] = [];

    //   order.FlightBookings?.[0]?.FlightPassengers?.forEach(passenger => {
    //     allPassengers.push(passenger);
    //   });

    //   return allPassengers;
    // }, [order.FlightBookings]);

    // // cmt: get all passenger with unique value
    // const uniquePassengers = useMemo(() => {
    //   const uniquePsg: FlightPassenger[] = [];
    //   const uniqurePassengerKeys = new Set();

    //   listPassengers?.forEach(psg => {
    //     const key = psg.Id;

    //     if (!uniqurePassengerKeys.has(key)) {
    //       uniqurePassengerKeys.add(key);
    //       uniquePsg.push(psg);
    //     }
    //   });

    //   return uniquePsg;
    // }, [listPassengers]);

    // // cmt: format passenger to ItemCustom type
    // const formatListPsg = uniquePassengers?.map(psg => ({
    //   key: psg.Id as string,
    //   t18n: `${psg.Surname} ${psg.GivenName}`,
    //   description: psg.PaxType,
    // }));

    // // cmt: list option passenger
    // const newListPassenger = listOptionPassengers.concat(
    //   formatListPsg as ItemCustom[],
    // );

    // // cmt: choose charge type
    // const selectChargeType = (val: string | null) => {
    //   feeForm.setValue('ChargeType', val, {
    //     shouldDirty: true,
    //   });
    // };

    // // cmt: choose passenger
    // const showModalChoosePassenger = () => {
    //   const PaxName = newListPassenger.filter(
    //     item => item.t18n === feeForm.getValues('PaxName'),
    //   );

    //   passengerRef.current?.present(PaxName[0]?.key ?? null);
    // };

    // const selectPassenger = (val: string | null) => {
    //   feeForm.setValue('PaxName', val, {
    //     shouldDirty: true,
    //   });
    // };

    // // cmt: get route
    // // const routeFlight = order.FlightBookings?.map(booking => ({
    // //   key: `${booking.StartPoint}-${booking.EndPoint}`,
    // //   t18n: `${booking.StartPoint} - ${booking.EndPoint}`,
    // // }));

    // const routeFlight = useMemo(() => {
    //   const rou: Array<{ key: string; t18n: string }> = [];
    //   order.FlightBookings?.forEach(booking => {
    //     rou?.push({
    //       key: `${booking.StartPoint}-${booking.EndPoint}`,
    //       t18n: `${booking.StartPoint} - ${booking.EndPoint}`,
    //     });

    //     booking.FlightJourneys?.forEach(jou => {
    //       if (
    //         jou.StartPoint !== booking.StartPoint ||
    //         jou.EndPoint !== booking.EndPoint
    //       ) {
    //         rou?.push({
    //           key: `${jou.StartPoint}-${jou.EndPoint}`,
    //           t18n: `${jou.StartPoint} - ${jou.EndPoint}`,
    //         });
    //         return;
    //       }

    //       jou.FlightSegments?.forEach(seg => {
    //         if (
    //           seg?.StartPoint !== booking.StartPoint ||
    //           seg?.EndPoint !== booking.EndPoint ||
    //           seg?.StartPoint !== jou.StartPoint ||
    //           seg?.EndPoint !== jou.EndPoint
    //         ) {
    //           rou?.push({
    //             key: `${seg.StartPoint}-${seg.EndPoint}`,
    //             t18n: `${seg.StartPoint} - ${seg.EndPoint}`,
    //           });
    //           return;
    //         }
    //       });
    //     });
    //   });

    //   return rou;
    // }, [order.FlightBookings]);

    // const newRouteFlight = listOptionRoutes.concat(routeFlight as ItemCustom[]);

    // const showModalRoutesFlight = () => {
    //   routeFlightRef.current?.present(feeForm.getValues('Route'));
    // };

    // const selectRouteFlight = (val: string | null) => {
    //   feeForm.setValue('Route', val, {
    //     shouldDirty: true,
    //   });
    // };

    // // cmt: choose currency
    // const openModalCurrency = () => {
    //   currencyRef.current?.present(feeForm.getValues('Currency'));
    // };

    // const selectCurrency = (val: string | null) => {
    //   feeForm.setValue('Currency', val, { shouldDirty: true });
    // };

    // const submit = useCallback(() => {
    //   normalRef.current?.close();

    //   feeForm.handleSubmit(form => {
    //     // TODO: save data was edited or save new data here
    //     const paxName = newListPassenger.filter(
    //       item => item.key === form.PaxName,
    //     );

    //     if (isInsert) {
    //       dispatch(
    //         FlightChargeActions.insertFlightCharge(
    //           {
    //             ...form,
    //             PaxName:
    //               paxName[0] !== undefined ? paxName[0].t18n : form.PaxName,
    //             StartPoint:
    //               form.Route !== null ? form.Route?.slice(0, 3) : null,
    //             EndPoint: form.Route !== null ? form.Route?.slice(4) : null,
    //           },
    //           () => {
    //             setIsVisibleModalConfirm(true);
    //           },
    //         ),
    //       );
    //     } else {
    //       dispatch(
    //         FlightChargeActions.updateFlightCharge(
    //           {
    //             ...form,
    //             PaxName:
    //               paxName[0] !== undefined ? paxName[0].t18n : form.PaxName,
    //             StartPoint:
    //               form.Route !== null ? form.Route?.slice(0, 3) : null,
    //             EndPoint: form.Route !== null ? form.Route?.slice(4) : null,
    //           },
    //           () => {
    //             setIsVisibleModalConfirm(true);
    //           },
    //         ),
    //       );
    //     }
    //   })();
    // }, [feeForm, isInsert, newListPassenger]);

    // const _onCancel = () => {
    //   normalRef.current?.dismiss();
    // };

    return (
      <>
        <BottomSheet
          useDynamicSnapPoint={true}
          ref={normalRef}
          showCloseButton={false}
          showIndicator={false}
          showLineBottomHeader={false}
          style={{
            marginHorizontal: 30,
          }}
          enablePanDownToClose={true}
          enableOverDrag={false}
          detachedCenter={true}>
          {/* <FormProvider {...feeForm}>
            <Block
              colorTheme="neutral100"
              borderRadius={16}
              minWidth={scale(310)}
              rowGap={16}
              alignSelf="center"
              paddingBottom={Platform.OS === 'android' ? 16 : undefined}
              maxWidth={WindowWidth}
              paddingHorizontal={16}>
        
              <Controller
                control={feeForm.control}
                name={'ChargeType'}
                render={({ field: { value } }) => {
                  const text = listChargeType.filter(
                    item => item.key === value,
                  );

                  return (
                    <Pressable
                      onPress={() => {
                        chargeTypeRef.current?.present(
                          feeForm.getValues('ChargeType'),
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
                  );
                }}
              />
            
              <Controller
                control={feeForm.control}
                name={'PaxName'}
                render={({ field: { value } }) => {
                  const text = newListPassenger.filter(
                    item => item.key === value || item.t18n === value,
                  );

                  return (
                    <Pressable
                      onPress={showModalChoosePassenger}
                      style={styles.row}>
                      <Text
                        colorTheme="neutral900"
                        fontStyle="Body16Reg"
                        t18n={text[0]?.t18n ?? 'order_detail:all'}
                      />
                      <Icon
                        icon="arrow_ios_down_fill"
                        size={24}
                        colorTheme="neutral900"
                      />
                    </Pressable>
                  );
                }}
              />
        
              <Controller
                control={feeForm.control}
                name={'Route'}
                render={({ field: { value } }) => {
                  const text = newRouteFlight.filter(
                    item => item.key === value,
                  );
                  return (
                    <Pressable
                      onPress={showModalRoutesFlight}
                      style={styles.row}>
                      <Text
                        colorTheme="neutral900"
                        fontStyle="Body16Reg"
                        text={value as string}
                        t18n={text[0]?.t18n ?? 'order_detail:all'}
                      />
                      <Icon
                        icon="arrow_ios_down_fill"
                        size={24}
                        colorTheme="neutral900"
                      />
                    </Pressable>
                  );
                }}
              />
 
              <Controller
                control={feeForm.control}
                name={'ChargeValue'}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    placeholderI18n="order_detail:param"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value}
                    onChangeText={txt => onChange(txt)}
                  />
                )}
              />
    
              <Controller
                control={feeForm.control}
                name={'Remark'}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    placeholderI18n="order_detail:note"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value}
                    onChangeText={txt => onChange(txt)}
                  />
                )}
              />
              
              <Block flexDirection="row" alignItems="center" columnGap={12}>
                <Controller
                  control={feeForm.control}
                  name={'Amount'}
                  render={({ field: { value, onChange } }) => (
                    <Block flex={1} maxWidth={scale(198)} height={48}>
                      <TextInput
                        placeholderI18n="flight:enter_the_amount_of_money"
                        placeholderTextColor={colors.neutral600}
                        defaultValue={String(value)}
                        onChangeText={txt => onChange(txt)}
                      />
                    </Block>
                  )}
                />
                <Controller
                  control={feeForm.control}
                  name={'Currency'}
                  render={({ field: { value } }) => {
                    return (
                      <Pressable onPress={openModalCurrency}>
                        <Block
                          flex={1}
                          maxWidth={scale(76)}
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
                    );
                  }}
                />
              </Block>
              <Block
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Block flex={1} maxWidth={135} height={40}>
                  <Button
                    type="classic"
                    fullWidth
                    size="medium"
                    t18n="common:cancel"
                    textColorTheme="neutral900"
                    onPress={_onCancel}
                  />
                </Block>
                <Block flex={1} maxWidth={135} height={40}>
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
            </Block>
          </FormProvider> */}
        </BottomSheet>

        {/* <ModalCustomPicker
          ref={chargeTypeRef}
          data={listChargeType}
          snapPoints={['30%']}
          showCloseButton={false}
          showIndicator={true}
          hasDescription
          t18nTitle={undefined as unknown as I18nKeys}
          handleDone={selectChargeType}
        />
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
        <ModalCustomPicker
          ref={routeFlightRef}
          data={newRouteFlight}
          snapPoints={['30%']}
          showCloseButton={false}
          showIndicator={true}
          t18nTitle={undefined as unknown as I18nKeys}
          handleDone={selectRouteFlight}
        />
        <ModalCustomPicker
          ref={currencyRef}
          data={listCurrencies}
          snapPoints={['25%']}
          t18nTitle={undefined as unknown as I18nKeys}
          handleDone={selectCurrency}
        /> */}
      </>
    );
  }),
  () => true,
);
