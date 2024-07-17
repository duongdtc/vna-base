import { Block, Separator, Text } from '@vna-base/components';
import { selectPriceExchangeTicket } from '@vna-base/redux/selector';
import React from 'react';
import { useSelector } from 'react-redux';

export const Price = () => {
  const { Different, NewPrice, OldPrice, PaidAmount, Penalty, TotalPrice } =
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
            text={(OldPrice?.Amount ?? 0).currencyFormat()}
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
            text={(NewPrice?.Amount ?? 0).currencyFormat()}
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
            text={(Different?.Amount ?? 0).currencyFormat()}
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
            text={(Penalty?.Amount ?? 0).currencyFormat()}
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
            text={(PaidAmount ?? 0).currencyFormat()}
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
            t18n="exchange_ticket:total"
            colorTheme="neutral900"
            fontStyle="Body14Semi"
          />
          <Text colorTheme="price" fontStyle="Title16Bold">
            {(TotalPrice?.Amount ?? 0).currencyFormat()}{' '}
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
