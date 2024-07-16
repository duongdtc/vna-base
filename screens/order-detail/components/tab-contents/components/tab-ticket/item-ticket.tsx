import { Block, Text } from '@vna-base/components';
import { Ticket } from '@services/axios/axios-data';
import { System, SystemDetails, TicketTypeDetails, TicketType } from '@vna-base/utils';
import React from 'react';

type Props = {
  item: Ticket;
};

export const ItemFlTicket = ({ item }: Props) => {
  return (
    <Block
      colorTheme="neutral100"
      flexDirection="row"
      alignItems="center"
      paddingVertical={12}
      paddingHorizontal={16}
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
            text={item.FullName?.toString()}
            fontStyle="Body12Med"
            colorTheme="neutral600"
          />
        </Block>
      </Block>
      <Block alignItems="flex-end">
        <Text
          text={TicketTypeDetails[item.TicketType as TicketType]?.t18n}
          fontStyle="Body12Bold"
          colorTheme={
            TicketTypeDetails[item.TicketType as TicketType]?.colorTheme
          }
        />
        <Text
          text={`${item.StartPoint} - ${item.EndPoint}`}
          fontStyle="Body12Reg"
          colorTheme="neutral600"
        />
      </Block>
    </Block>
  );
};
