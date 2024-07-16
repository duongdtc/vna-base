import { Block, Icon, Text } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  selectCharges,
  selectIsLoadingCharges,
  selectViewingOrderId,
} from '@redux-selector';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { Opacity } from '@theme/color';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomSheetChargeContent } from './bottom-sheet-charge-content';

export const PriceBookingInfo = () => {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<NormalRef>(null);

  const charges = useSelector(selectCharges);
  const isLoading = useSelector(selectIsLoadingCharges);
  const viewingOrderId = useSelector(selectViewingOrderId);

  const orderDetail = useObject<OrderRealm>(
    OrderRealm.schema.name,
    viewingOrderId ?? '',
  );

  const _totalDiscount = useMemo(() => {
    return (
      charges.reduce(
        (totalDiscount, currDiscount) =>
          totalDiscount +
          (currDiscount.ChargeType === 'DISCOUNT' ? currDiscount.Amount! : 0),
        0,
      ) ?? 0
    );
  }, [charges]);

  const _totalServiceFee = useMemo(() => {
    return (
      charges.reduce(
        (totalServiceFee, currServiceFee) =>
          totalServiceFee +
          (currServiceFee.ChargeType === 'SERVICE_FEE'
            ? currServiceFee.Amount!
            : 0),
        0,
      ) ?? 0
    );
  }, [charges]);

  const totalPrice = useMemo(
    () => (orderDetail?.TotalPrice ?? 0) - _totalDiscount - _totalServiceFee,
    [_totalDiscount, _totalServiceFee, orderDetail?.TotalPrice],
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        disabled={isLoading}
        onPress={() => {
          bottomSheetRef.current?.present();
        }}>
        <Block
          padding={12}
          colorTheme="neutral100"
          borderRadius={12}
          rowGap={12}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              fontStyle="Body14Reg"
              text={`${translate('order_detail:total_fare').replace(
                ':',
                '',
              )} NET`}
              colorTheme="neutral800"
            />
            <Text
              fontStyle="Body14Bold"
              text={totalPrice.currencyFormat()}
              // text={orderDetail?.NetPrice?.currencyFormat()}
              colorTheme="neutral900"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              fontStyle="Body14Reg"
              t18n="input_info_passenger:service_fee"
              colorTheme="neutral800"
            />
            <Text
              fontStyle="Body14Bold"
              text={_totalServiceFee.currencyFormat()}
              // text={(orderDetail?.Profit! - _totalDiscount)?.currencyFormat()}
              colorTheme="neutral900"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              fontStyle="Body14Reg"
              t18n="order_detail:discount"
              colorTheme="neutral800"
            />
            <Text
              fontStyle="Body14Bold"
              text={_totalDiscount.currencyFormat()}
              colorTheme="neutral900"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block flexDirection="row" alignItems="center" columnGap={2}>
              <Text
                fontStyle="Body14Semi"
                text={`${translate('common:total')} (VND)`}
                colorTheme="neutral800"
              />
              <Icon icon="info_outline" size={16} colorTheme="primary500" />
            </Block>
            <Block
              justifyContent="flex-end"
              flexDirection="row"
              alignItems="center"
              columnGap={4}>
              <Text
                fontStyle="Title20Semi"
                text={orderDetail?.TotalPrice?.currencyFormat()}
                colorTheme="price"
              />
              <Text
                fontStyle="Title20Semi"
                text="VND"
                colorTheme="neutral800"
              />
            </Block>
          </Block>
        </Block>
        {isLoading && (
          <Block
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.neutral100 + Opacity[80],
            }}>
            <ActivityIndicator color={colors.neutral800} size="small" />
          </Block>
        )}
      </TouchableOpacity>

      <BottomSheetChargeContent ref={bottomSheetRef} />
    </>
  );
};
