import { Block, Text } from '@vna-base/components';
import { FareOption } from '@services/axios/axios-ibe';
import React from 'react';

export const OtherInfoTicket = ({ fareOption }: { fareOption: FareOption }) => {
  return (
    <Block>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={12}
        colorTheme="neutral100">
        <Text
          t18n="flight:type_ticket"
          fontStyle="Body14Reg"
          colorTheme="neutral800"
        />
        <Text
          text={fareOption.FareFamily ?? 'N/A'}
          fontStyle="Title16Semi"
          colorTheme="primary600"
        />
      </Block>
      <Block
        marginVertical={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={12}
        colorTheme="neutral100">
        <Text
          t18n="flight:refundable"
          fontStyle="Body14Reg"
          colorTheme="neutral800"
        />
        <Text
          t18n={
            fareOption?.Refundable
              ? 'common:refundable'
              : 'common:fl_conditional'
          }
          fontStyle="Body14Semi"
          colorTheme={fareOption.Refundable ? 'success500' : 'primary600'}
        />
      </Block>
    </Block>
  );
};
