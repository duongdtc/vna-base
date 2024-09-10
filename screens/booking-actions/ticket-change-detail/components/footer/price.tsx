import { Block, Separator, Text } from '@vna-base/components';
import { selectPriceExchangeTicket } from '@vna-base/redux/selector';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const Price = () => {
  const { NewPrice, OldPrice, TotalPrice } = useSelector(
    selectPriceExchangeTicket,
  );

  const getPrice = useMemo(() => {
    const different = (NewPrice?.Amount ?? 0) - (OldPrice?.Amount ?? 0);
    const panalty = 360_000;
    const totalPrice = different + panalty;
    return {
      OldPrice: OldPrice?.Amount?.currencyFormat(),
      NewPrice: NewPrice?.Amount?.currencyFormat(),
      Different: Math.abs(different).currencyFormat(),
      Penalty: panalty.currencyFormat(),
      PaidAmount: OldPrice?.Amount?.currencyFormat(),
      TotalPrice: Math.abs(totalPrice).currencyFormat(),
    };
  }, [NewPrice?.Amount, OldPrice?.Amount]);

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
            text={getPrice.OldPrice}
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
            text={getPrice.NewPrice}
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
            text={getPrice.Different}
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
            text={getPrice.Penalty}
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
            text={getPrice.PaidAmount}
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
            {getPrice.TotalPrice}{' '}
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
