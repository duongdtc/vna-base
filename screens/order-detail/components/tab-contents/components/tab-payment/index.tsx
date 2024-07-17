import { Block, Icon, RowOfForm, Separator, Text } from '@vna-base/components';
import { selectAllPayMethod } from '@vna-base/redux/selector';
import { ModalInputMoneyPayment } from '@vna-base/screens/order-detail/components/modal-input-money-payment';
import { ModalInputMoneyPaymentRef } from '@vna-base/screens/order-detail/components/modal-input-money-payment/type';
import { FormOrderDetailType } from '@vna-base/screens/order-detail/type';
import { translate } from '@vna-base/translations/translate';
import { PaymentStatus, PaymentStatusDetails, SnapPoint } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export const TabPayment = () => {
  const { control, setValue, getValues } =
    useFormContext<FormOrderDetailType>();

  const payMethods = useSelector(selectAllPayMethod);

  const modalInputMoneyPaymentRef = useRef<ModalInputMoneyPaymentRef>(null);

  const _onChangeTotalPayment = (
    val: string | undefined,
    curr: string | undefined,
  ) => {
    setValue('FormPaymentTab.PaidAmt', val, {
      shouldDirty: true,
    });

    setValue('FormPaymentTab.PaidCur', curr, {
      shouldDirty: true,
    });
  };

  const resultPayMentDate = useCallback(
    (date: Date) => (
      <Text
        fontStyle="Body14Semi"
        colorTheme="error500"
        text={dayjs(date).format('HH:mm DD/MM/YYYY')}
      />
    ),
    [],
  );

  const resultPayMentStatus = useCallback(
    (val: PaymentStatus) => (
      <Text
        fontStyle="Body14Semi"
        colorTheme={PaymentStatusDetails[val].iconColorTheme}
        t18n={PaymentStatusDetails[val].t18n}
      />
    ),
    [],
  );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block
          margin={12}
          borderRadius={8}
          overflow="hidden"
          colorTheme="neutral100">
          {/* //cmt: status payment */}
          <RowOfForm<FormOrderDetailType>
            type="dropdown"
            typeDetails={PaymentStatusDetails}
            t18n="order_detail:choose_status"
            t18nBottomSheet="order_detail:choose_status"
            t18nAll="common:not_choose"
            name="FormPaymentTab.PaymentStatus"
            fixedTitleFontStyle={true}
            control={control}
            snapPoint={[SnapPoint['30%']]}
            removeAll
            ValueView={resultPayMentStatus}
          />

          {/* //cmt: method payment */}
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormOrderDetailType>
            type="dropdown"
            disable={Object.values(payMethods).length === 0}
            typeDetails={payMethods}
            t18n="order_detail:method"
            t18nBottomSheet="order_detail:method"
            name="FormPaymentTab.PaymentMethod"
            fixedTitleFontStyle={true}
            t18nAll="common:not_choose"
            control={control}
            snapPoint={[SnapPoint['30%']]}
          />

          {/* //cmt: gateways payment */}
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormOrderDetailType>
            type="dropdown"
            typeDetails={{}}
            disable
            t18n="order_detail:gateway_payment"
            name="FormPaymentTab.PaymentGateway"
            fixedTitleFontStyle={true}
            t18nAll="common:not_choose"
            control={control}
          />

          {/* //cmt: date payment */}
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormOrderDetailType>
            t18n="order_detail:date_payment"
            name="FormPaymentTab.PaymentDate"
            fixedTitleFontStyle={true}
            type="date-time-picker"
            control={control}
            t18nDatePicker="order_detail:date_payment"
          />

          {/*  //cmt: expired date payment */}
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormOrderDetailType>
            t18n="order_detail:expired_date_payment"
            name="FormPaymentTab.PaymentExpiry"
            fixedTitleFontStyle={true}
            type="date-time-picker"
            ValueView={resultPayMentDate}
            control={control}
            titleFontStyle="Title16Semi"
          />

          {/*  //cmt: money */}
          <Separator type="horizontal" size={3} />
          <Controller
            control={control}
            name="FormPaymentTab.PaidAmt"
            render={({ field: { value } }) => {
              return (
                <Pressable
                  onPress={() =>
                    modalInputMoneyPaymentRef.current?.present(
                      getValues('FormPaymentTab.PaidAmt'),
                      getValues('FormPaymentTab.PaidCur') as string,
                    )
                  }>
                  <Block
                    flexDirection="row"
                    alignItems="center"
                    paddingLeft={16}
                    paddingVertical={20}
                    paddingRight={12}
                    justifyContent="space-between">
                    <Text
                      t18n="order_detail:total_payment"
                      fontStyle="Body16Reg"
                      colorTheme="neutral900"
                    />
                    <Block
                      flexDirection="row"
                      alignItems="center"
                      columnGap={4}>
                      <Text
                        text={value ? value : '0'}
                        colorTheme="success500"
                        fontStyle="Body14Semi"
                      />
                      <Controller
                        control={control}
                        name="FormPaymentTab.PaidCur"
                        render={({ field: { value } }) => {
                          return (
                            <Text
                              text={
                                value
                                  ? String(value)
                                  : translate('common:select')
                              }
                              colorTheme="neutral700"
                              fontStyle="Body14Reg"
                            />
                          );
                        }}
                      />
                      <Icon
                        icon="edit_2_fill"
                        size={20}
                        colorTheme="neutral700"
                      />
                    </Block>
                  </Block>
                </Pressable>
              );
            }}
          />
        </Block>
      </ScrollView>
      <ModalInputMoneyPayment
        ref={modalInputMoneyPaymentRef}
        handleDone={_onChangeTotalPayment}
      />
    </>
  );
};
