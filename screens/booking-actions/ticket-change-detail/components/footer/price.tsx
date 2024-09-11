import { Block, Separator, Text } from '@vna-base/components';
import { selectPriceExchangeTicket } from '@vna-base/redux/selector';
import React from 'react';
import { useSelector } from 'react-redux';

export const Price = () => {
  const { NewPrice, OldPrice, TotalPrice, PaidAmount, Different, Penalty } =
    useSelector(selectPriceExchangeTicket);

  return (
    <Block rowGap={12} style={{ marginTop: -12 }}>
      <Block
        colorTheme="neutral50"
        borderRadius={8}
        overflow="hidden"
        padding={12}
        rowGap={12}>
        {/* Giá cũ */}
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="exchange_ticket:old_price"
            colorTheme="neutral900"
            fontStyle="Body14Reg"
          />
          <Text
            text={OldPrice?.Amount?.currencyFormat()}
            colorTheme="price"
            fontStyle="Body14Semi"
          />
        </Block>
        <Separator type="horizontal" colorTheme="neutral200" size={3} />
        {/* Giá mới */}
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="exchange_ticket:new_price"
            colorTheme="neutral900"
            fontStyle="Body14Reg"
          />
          <Text
            text={NewPrice?.Amount?.currencyFormat()}
            colorTheme="price"
            fontStyle="Body14Semi"
          />
        </Block>
      </Block>

      <Block padding={12} rowGap={12} paddingBottom={0}>
        {/* Tổng chênh lệch */}
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="exchange_ticket:different"
            colorTheme="neutral900"
            fontStyle="Body14Reg"
          />
          <Text
            text={Different?.Amount?.currencyFormat()}
            colorTheme="price"
            fontStyle="Body14Semi"
          />
        </Block>
        <Separator type="horizontal" colorTheme="neutral200" size={3} />
        {/* Phí đổi */}
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="exchange_ticket:penalty"
            colorTheme="neutral900"
            fontStyle="Body14Reg"
          />
          <Text
            text={Penalty?.Amount?.currencyFormat()}
            colorTheme="price"
            fontStyle="Body14Semi"
          />
        </Block>
        <Separator type="horizontal" colorTheme="neutral200" size={3} />
        {/* Đã thanh toán */}
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="exchange_ticket:paid_amount"
            colorTheme="neutral900"
            fontStyle="Body14Reg"
          />
          <Text
            text={PaidAmount?.currencyFormat()}
            colorTheme="price"
            fontStyle="Body14Semi"
          />
        </Block>
        <Separator type="horizontal" colorTheme="neutral200" size={3} />
        {/* Tổng */}
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            text={
              (TotalPrice?.Amount ?? 0) >= 0 ? 'Tổng thanh toán' : 'Tổng hoàn'
            }
            colorTheme="neutral900"
            fontStyle="Body14Semi"
          />
          <Text
            colorTheme={(TotalPrice?.Amount ?? 0) >= 0 ? 'price' : 'success500'}
            fontStyle="Title16Bold">
            {Math.abs(TotalPrice?.Amount ?? 0).currencyFormat()}{' '}
            <Text
              colorTheme="neutral900"
              fontStyle="Title16Bold"
              text={TotalPrice?.Currency ?? ''}
            />
          </Text>
        </Block>
      </Block>
    </Block>
  );
};
