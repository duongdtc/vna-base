import { Block, Separator, Text } from '@vna-base/components';
import { FlightPassengerWithCharge } from '@vna-base/screens/booking-detail/type';
import { Passenger } from '@services/axios/axios-ibe';
import { getFullNameOfPassenger } from '@vna-base/utils';
import React from 'react';

export const PassengerItem = ({
  discount,
  serviceFee,
  ticketFare,
  ticketTax,
  GivenName,
  Surname,
}: FlightPassengerWithCharge) => {
  const total = serviceFee + ticketFare + ticketTax - discount;

  return (
    <Block
      borderRadius={12}
      colorTheme="neutral100"
      overflow="hidden"
      rowGap={12}
      padding={12}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          text={getFullNameOfPassenger({ Surname, GivenName } as Passenger)}
          fontStyle="Body14Semi"
          colorTheme="primary900"
        />
        <Text
          text={total.currencyFormat()}
          fontStyle="Body14Bold"
          colorTheme="price"
        />
      </Block>
      <Separator type="horizontal" size={3} />
      <Block flexDirection="row" alignItems="center" columnGap={12}>
        <Block flex={1} rowGap={8}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              t18n="booking:price_ticket"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
            <Text
              text={ticketFare.currencyFormat()}
              fontStyle="Body14Semi"
              colorTheme="primary600"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              t18n="booking:tax_fees"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
            <Text
              text={ticketTax.currencyFormat()}
              fontStyle="Body14Semi"
              colorTheme="primary600"
            />
          </Block>
        </Block>
        <Separator type="vertical" size={3} />
        <Block flex={1} rowGap={8}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              t18n="booking:service_fees"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
            <Text
              text={serviceFee.currencyFormat() ?? '0'}
              fontStyle="Body14Semi"
              colorTheme="primary600"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              t18n="booking:discounts"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
            <Text
              text={discount.currencyFormat() ?? '0'}
              fontStyle="Body14Semi"
              colorTheme="primary600"
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
