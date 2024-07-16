import { Block, Icon, Text } from '@vna-base/components';
import { Ancillary } from '@services/axios/axios-data';
import { translate } from '@vna-base/translations/translate';
import { getFullNameOfPassenger } from '@vna-base/utils';
import React from 'react';

export const AncillaryItem = ({
  Passenger,
  StartPoint,
  EndPoint,
  Value,
  Name,
  Price,
  Confirmed,
}: Ancillary) => {
  return (
    <Block
      padding={12}
      borderRadius={8}
      flexDirection="row"
      alignItems="center"
      colorTheme="neutral100"
      justifyContent="space-between">
      <Block rowGap={2} flex={1}>
        <Text
          text={getFullNameOfPassenger(Passenger)}
          fontStyle="Body12Med"
          colorTheme="neutral900"
        />
        <Block flexDirection="row" columnGap={4} alignItems="center" flex={1}>
          <Block flexShrink={1}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              text={`${Name} ${Value}`}
              fontStyle="Body12Reg"
              colorTheme="neutral900"
            />
          </Block>
          <Block width={1} height={16} colorTheme="neutral800" />
          <Text
            text={`${StartPoint} - ${EndPoint}`}
            fontStyle="Body12Med"
            colorTheme="neutral900"
          />
        </Block>
      </Block>
      <Block rowGap={2} alignItems="flex-end">
        <Block flexDirection="row" columnGap={4} alignItems="center">
          <Icon
            icon={Confirmed ? 'checkmark_circle_fill' : 'alert_circle_fill'}
            size={16}
            colorTheme={Confirmed ? 'success500' : 'error500'}
          />
          <Text
            t18n={
              Confirmed
                ? 'flight_change_detail:confirmed'
                : 'flight_change_detail:unconfimred'
            }
            fontStyle="Body12Reg"
            colorTheme="neutral900"
          />
        </Block>
        <Text fontStyle="Body12Med" colorTheme="neutral900">
          {translate('common:price')}{' '}
          <Text
            text={(Price ?? 0).currencyFormat()}
            fontStyle="Body12Bold"
            colorTheme="price"
          />
        </Text>
      </Block>
    </Block>
  );
};
