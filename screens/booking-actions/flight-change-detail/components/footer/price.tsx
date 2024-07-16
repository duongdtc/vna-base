import { Block, Text } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import { selectPriceChangeFlight } from '@redux-selector';
import React from 'react';
import { useSelector } from 'react-redux';

export const Price = () => {
  const { fee, newPrice } = useSelector(selectPriceChangeFlight);

  return (
    <Block rowGap={12}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="flight_change_detail:new_bookig_price"
          colorTheme="neutral900"
          fontStyle="Body14Reg"
        />
        <Text
          text={newPrice.currencyFormat()}
          colorTheme="price"
          fontStyle="Body14Semi"
        />
      </Block>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="flight_change_detail:flight_change_fee"
          colorTheme="neutral900"
          fontStyle="Body14Reg"
        />
        <Text
          text={fee.currencyFormat()}
          colorTheme="price"
          fontStyle="Body14Semi"
        />
      </Block>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="flight_change_detail:total"
          colorTheme="neutral900"
          fontStyle="Body14Semi"
        />
        <Text colorTheme="price" fontStyle="Title16Bold">
          {(newPrice + fee).currencyFormat()}{' '}
          <Text
            text={DEFAULT_CURRENCY}
            colorTheme="neutral900"
            fontStyle="Title16Bold"
          />
        </Text>
      </Block>
    </Block>
  );
};
