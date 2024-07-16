import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';

import { Order } from '@services/axios/axios-data';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import {
  OrderStatus,
  OrderStatusDetails,
  rxSpitStringToArr,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { APP_SCREEN } from '@utils';

export type Props = {
  // bắt buộc phải truyền 1 trong 2 : id hoặc item
  id?: string;
  item?: Order;
  customStyle?: StyleProp<ViewStyle>;
};

export const OrderItem = memo(({ id, item, customStyle }: Props) => {
  const { colors } = useTheme();

  const _orderDetail = useObject<OrderRealm>(OrderRealm.schema.name, id);

  const orderDetail = (item ?? _orderDetail?.toJSON()) as Order;

  const _onPress = () => {
    navigate(APP_SCREEN.ORDER_DETAIL, {
      id: orderDetail.Id as string,
    });
  };

  const flInfoArr = orderDetail?.FlightInfo?.split(rxSpitStringToArr);

  const renderFlightInfo = () => {
    return flInfoArr?.map((fl, idx) => (
      <Block
        key={idx}
        flex={1}
        alignItems="center"
        marginTop={
          // eslint-disable-next-line no-nested-ternary
          orderDetail?.FlightBooking?.includes('\n') ? (idx !== 0 ? 8 : 0) : 0
        }>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon icon="navigation_2_fill" colorTheme="neutral600" size={16} />
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              text={fl.split('-')[1] as string}
              fontStyle="Body14BoldMono"
              colorTheme={orderDetail?.Visible ? 'neutral800' : 'neutral600'}
            />
            <Block
              width={4}
              height={4}
              borderRadius={2}
              colorTheme="neutral400"
            />
            <Text
              text={fl.split('-')[2] as string}
              fontStyle="Body12Reg"
              colorTheme={orderDetail?.Visible ? 'neutral800' : 'neutral600'}
            />
          </Block>
        </Block>
      </Block>
    ));
  };

  const colorTextFlBooking = (flBooking: string) => {
    if (!orderDetail?.Visible) {
      return 'neutral600';
    }

    return flBooking?.includes('FAIL') ? 'error500' : 'success500';
  };

  // render (Tạm thời ẩn long press)
  return (
    <Block style={customStyle}>
      <Pressable onPress={_onPress} delayLongPress={300} onLongPress={() => {}}>
        <Block
          paddingTop={12}
          paddingBottom={8}
          colorTheme="neutral100"
          paddingHorizontal={12}
          rowGap={12}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            {/* //cmt: index <=> mã của item order */}
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={String(orderDetail?.Index) ?? 'N/A'}
                fontStyle="Title20Bold"
                colorTheme={orderDetail?.Visible ? 'primary600' : 'neutral600'}
              />
            </Block>

            {/* //cmt: trạng thái order status */}
            <Block flexDirection="row" alignItems="center" columnGap={6}>
              {!orderDetail?.Visible && (
                <Block
                  paddingVertical={6}
                  paddingHorizontal={8}
                  colorTheme="neutral50"
                  borderRadius={4}>
                  <Text
                    t18n="order:deleted"
                    colorTheme="neutral600"
                    fontStyle="Capture11Reg"
                  />
                </Block>
              )}
              <Block
                flexDirection="row"
                alignItems="center"
                columnGap={4}
                paddingVertical={4}
                paddingHorizontal={8}
                borderRadius={4}
                colorTheme={
                  orderDetail?.Visible
                    ? OrderStatusDetails[
                        orderDetail?.OrderStatus as OrderStatus
                      ]?.colorTheme
                    : 'neutral50'
                }>
                <Icon
                  icon={
                    OrderStatusDetails[orderDetail?.OrderStatus as OrderStatus]
                      ?.icon
                  }
                  size={13}
                  colorTheme={
                    orderDetail?.Visible
                      ? OrderStatusDetails[
                          orderDetail?.OrderStatus as OrderStatus
                        ]?.iconColorTheme
                      : 'neutral600'
                  }
                />
                <Text
                  t18n={
                    OrderStatusDetails[orderDetail?.OrderStatus as OrderStatus]
                      ?.t18n as I18nKeys
                  }
                  fontStyle="Body12Med"
                  colorTheme={
                    orderDetail?.Visible ? 'neutral900' : 'neutral600'
                  }
                />
              </Block>
            </Block>
          </Block>
          {/* //cmt: thời hạn thanh toán */}
          {orderDetail?.PaymentExpiry !== null && (
            <Block
              flexDirection="row"
              alignItems="center"
              style={{ marginTop: -8 }}>
              <Block
                flex={1}
                flexDirection="row"
                alignItems="center"
                columnGap={4}>
                <Icon
                  icon="alert_circle_fill"
                  size={16}
                  colorTheme={orderDetail?.Visible ? 'error500' : 'neutral600'}
                />
                <Text
                  text={`${translate('order:payment_deadline')}: `}
                  fontStyle="Body14Reg"
                  colorTheme={orderDetail?.Visible ? 'error500' : 'neutral600'}
                />
              </Block>
              <Block alignItems="flex-end">
                <Text
                  colorTheme={orderDetail?.Visible ? 'error500' : 'neutral600'}
                  fontStyle="Body14Reg">
                  {`${dayjs(orderDetail?.PaymentExpiry).format('DD/MM/YYYY')} `}
                  <Text
                    text={`${dayjs(orderDetail?.PaymentExpiry).format(
                      'HH:mm',
                    )}`}
                    colorTheme={
                      orderDetail?.Visible ? 'error500' : 'neutral600'
                    }
                    fontStyle="Body14Bold"
                  />
                </Text>
              </Block>
            </Block>
          )}
          <Block rowGap={8}>
            {/* //cmt: tên khách hàng */}
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Icon icon="person_fill" size={16} colorTheme="neutral700" />
                <Text
                  text={translate('order:customer_name') + ':'}
                  fontStyle="Body14Reg"
                  colorTheme="neutral700"
                />
              </Block>
              <Block flex={1} alignItems="flex-end">
                <Text
                  text={orderDetail?.PaxName as string}
                  fontStyle="Body14Semi"
                  colorTheme={
                    orderDetail?.Visible ? 'neutral900' : 'neutral600'
                  }
                />
              </Block>
            </Block>
            {/* //cmt: số khách hàng */}
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Icon icon="people_fill" size={16} colorTheme="neutral700" />
                <Text
                  text={translate('order:number_of_passengers') + ':'}
                  fontStyle="Body14Reg"
                  colorTheme="neutral700"
                />
              </Block>
              <Block flex={1} alignItems="flex-end">
                <Text
                  text={orderDetail?.PaxSumm as string}
                  fontStyle="Body14Reg"
                  colorTheme={
                    orderDetail?.Visible ? 'neutral900' : 'neutral600'
                  }
                />
              </Block>
            </Block>
            {/* //cmt: mã đặt chỗ */}
            <Block flexDirection="row" justifyContent="space-between">
              <Block flexDirection="row" columnGap={4}>
                <Icon icon="pricetag_fill" size={16} colorTheme="neutral700" />
                <Text
                  text={translate('order:booking_code') + ':'}
                  fontStyle="Body14Semi"
                  colorTheme="neutral700"
                />
              </Block>
              <Block
                flex={1}
                flexDirection="row"
                justifyContent="flex-end"
                columnGap={4}>
                <Block rowGap={8}>
                  <Text
                    text={orderDetail?.FlightBooking?.split('\n')[0]}
                    fontStyle="Body14BoldMono"
                    colorTheme={colorTextFlBooking(
                      orderDetail?.FlightBooking?.split('\n')[0] as string,
                    )}
                  />
                  {orderDetail?.FlightBooking?.split('\n')[1] && (
                    <Text
                      text={orderDetail?.FlightBooking?.split('\n')[1]}
                      fontStyle="Body14BoldMono"
                      colorTheme={colorTextFlBooking(
                        orderDetail?.FlightBooking?.split('\n')[1] as string,
                      )}
                    />
                  )}
                </Block>
                <Block alignItems="flex-start" justifyContent="flex-start">
                  {renderFlightInfo()}
                </Block>
              </Block>
            </Block>
            {/* //cmt: ngày đặt */}
            <Block flexDirection="row" justifyContent="space-between">
              <Block flexDirection="row" columnGap={4}>
                <Icon icon="edit_2_fill" size={16} colorTheme="neutral700" />
                <Text
                  text={translate('order:date_ordered') + ':'}
                  fontStyle="Body14Reg"
                  colorTheme="neutral700"
                />
              </Block>
              <Block flex={1} alignItems="flex-end">
                <Text
                  text={dayjs(orderDetail?.CreatedDate).format(
                    'DD/MM/YYYY HH:mm',
                  )}
                  fontStyle="Body14Reg"
                  colorTheme="neutral700"
                />
              </Block>
            </Block>
            {/* //cmt: tổng tiền */}
            <Block flexDirection="row" justifyContent="space-between">
              <Block flexDirection="row" columnGap={4}>
                <Icon icon="coin_fill" size={16} colorTheme="neutral700" />
                <Text
                  t18n="order:total_payment"
                  fontStyle="Body14Reg"
                  colorTheme="neutral700"
                />
              </Block>
              <Block flex={1} alignItems="flex-end">
                <Text
                  text={`${orderDetail?.TotalPrice?.currencyFormat()} ${
                    orderDetail?.Currency
                  }`}
                  colorTheme={orderDetail?.Visible ? 'price' : 'neutral600'}
                  fontStyle="Title16Bold"
                />
              </Block>
            </Block>
          </Block>
        </Block>
      </Pressable>
      {orderDetail?.SubAgCode && orderDetail?.SubAgName && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: colors.neutral100 }}
          contentContainerStyle={{
            backgroundColor: colors.neutral100,
            paddingBottom: scale(12),
          }}>
          <Block
            flexDirection="row"
            alignItems="center"
            columnGap={4}
            paddingHorizontal={12}>
            {orderDetail?.SubAgCode && orderDetail?.SubAgName && (
              <Block
                flexDirection="row"
                alignItems="center"
                columnGap={4}
                colorTheme="neutral50"
                borderRadius={24}
                paddingVertical={4}
                paddingLeft={8}
                paddingRight={6}>
                <Text
                  text={translate('order:customer') + ': '}
                  fontStyle="Body12Reg"
                  colorTheme="neutral700"
                />
                <Text
                  text={`${orderDetail?.SubAgCode} - ${orderDetail?.SubAgName}`}
                  fontStyle="Body12Reg"
                  colorTheme="neutral700"
                />
              </Block>
            )}
            {orderDetail?.AgentCode && orderDetail?.AgentName && (
              <Block
                flexDirection="row"
                alignItems="center"
                columnGap={4}
                colorTheme="neutral50"
                borderRadius={24}
                paddingVertical={4}
                paddingLeft={8}
                paddingRight={6}>
                <Text
                  text={translate('order:agent_booking') + ': '}
                  fontStyle="Body12Reg"
                  colorTheme="neutral700"
                />
                <Text
                  text={`${orderDetail?.AgentCode} - ${orderDetail?.AgentName}`}
                  fontStyle="Body12Reg"
                  colorTheme="neutral700"
                />
              </Block>
            )}
          </Block>
        </ScrollView>
      )}
    </Block>
  );
}, isEqual);
