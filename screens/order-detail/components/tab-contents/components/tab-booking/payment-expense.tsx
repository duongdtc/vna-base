import { Block, Text } from '@vna-base/components';
import { selectBalanceInfo, selectListPaymentExpense } from '@vna-base/redux/selector';
import { Payment } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { System, SystemDetails, WindowWidth, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Line, Svg } from 'react-native-svg';
import { useSelector } from 'react-redux';

export const PaymentExpense = () => {
  const { colors } = useTheme();

  const paymentExpense = useSelector(selectListPaymentExpense);
  const { balance } = useSelector(selectBalanceInfo);

  const renderItem = useCallback<ListRenderItem<Payment>>(({ item }) => {
    return (
      <Block rowGap={8} padding={12}>
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Block flexDirection="row" alignItems="center" columnGap={12}>
            <Block
              width={32}
              height={32}
              alignItems="center"
              justifyContent="center"
              borderRadius={4}
              colorTheme={SystemDetails[item.System as System].colorTheme}>
              <Text
                text={item.System as string}
                fontStyle="Capture11Bold"
                colorTheme="classicWhite"
              />
            </Block>
            <Block>
              <Text
                text={item.TicketNumber?.toString()}
                fontStyle="Body12Bold"
                colorTheme="neutral900"
              />
              <Text
                text={item.Passenger?.toString()}
                fontStyle="Body12Med"
                colorTheme="neutral600"
              />
            </Block>
          </Block>
          <Block alignItems="flex-end">
            <Text
              text={item.TicketType as string}
              fontStyle="Body12Bold"
              colorTheme="success500"
            />
            <Text
              text={`${item.StartPoint} - ${item.EndPoint}`}
              fontStyle="Body12Reg"
              colorTheme="neutral600"
            />
          </Block>
        </Block>
        <Svg height={1} width={'100%'}>
          <Line
            x1={0}
            y1={0}
            x2={WindowWidth - 48}
            y2={0}
            stroke={colors.neutral200}
            strokeDasharray="4, 4"
            strokeWidth={1}
          />
        </Svg>
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text fontStyle="Capture11Reg" colorTheme="neutral800">
            {translate('order_detail:date_payment') + ': '}
            <Text
              text={dayjs(item.PaymentDate).format('DD/MM/YYYY HH:mm')}
              fontStyle="Capture11Reg"
              colorTheme="neutral800"
            />
          </Text>
          <Text
            text={'-' + item.Amount?.currencyFormat()}
            fontStyle="Capture11Bold"
            colorTheme="error500"
          />
        </Block>
      </Block>
    );
  }, []);

  const _totalPaidAmt = useMemo(() => {
    return paymentExpense
      .reduce((sum, item) => sum + item.PaidAmt!, 0)
      .currencyFormat();
  }, [paymentExpense]);

  const listFooter = () => {
    return (
      <Block
        borderTopWidth={5}
        padding={12}
        borderBottomRadius={8}
        rowGap={4}
        borderColorTheme="neutral50"
        colorTheme="neutral100"
        overflow="hidden">
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="order:total_paid_amount"
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
          <Text
            text={'-' + _totalPaidAmt}
            fontStyle="Title16Bold"
            colorTheme="error500"
          />
        </Block>
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="order:balance_at_payment_time"
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
          <Text
            text={balance?.currencyFormat()}
            fontStyle="Body12Med"
            colorTheme="success500"
          />
        </Block>
      </Block>
    );
  };

  if (isEmpty(paymentExpense)) {
    return null;
  }

  return (
    <Block paddingTop={8} rowGap={8}>
      <Text
        t18n="order:return_payment_expense"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <FlatList
        scrollEnabled={false}
        data={paymentExpense}
        keyExtractor={item => `${item.Id}`}
        renderItem={renderItem}
        contentContainerStyle={{
          backgroundColor: colors.neutral100,
          borderRadius: scale(8),
        }}
        ItemSeparatorComponent={() => (
          <Block height={1} colorTheme="neutral50" />
        )}
        ListFooterComponent={listFooter}
      />
    </Block>
  );
};
