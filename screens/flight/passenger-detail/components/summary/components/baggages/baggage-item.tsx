import { Block, Icon, Separator, Text } from '@vna-base/components';
import { selectLanguage } from '@redux-selector';
import { useWatchName } from '@vna-base/screens/flight/passenger-detail/hooks';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { bs } from '@theme';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export const BaggageItem = ({
  passengerIndex,
  flightIndex,
}: {
  passengerIndex: number;
  flightIndex: number;
}) => {
  const { control } = useFormContext<PassengerForm>();
  const lng = useSelector(selectLanguage);

  const fullName = useWatchName(passengerIndex);

  const baggage = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Baggages.${flightIndex}`,
  });

  if (!baggage || isEmpty(baggage)) {
    return null;
  }

  return (
    <Block>
      <View style={bs.marginVertical_16}>
        <Separator type="horizontal" />
      </View>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text text={fullName} fontStyle="Body12Med" colorTheme="neutral100" />
        <Text
          text={lng === 'vi' ? 'Giá' : 'Price'}
          fontStyle="Body12Med"
          colorTheme="neutral100"
        />
      </Block>
      <Block
        marginTop={8}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Block flex={0.07}>
          <Icon icon="suitcase_fill" size={16} colorTheme="neutral80" />
        </Block>
        <Block flex={1}>
          <Text
            text={baggage?.Name as string}
            fontStyle="Body14Semi"
            colorTheme="neutral80"
          />
        </Block>
        <Block flex={0.23} alignItems="flex-end">
          <Text
            text={baggage?.Price?.currencyFormat()}
            fontStyle="Body12Bold"
            colorTheme="price"
          />
        </Block>
      </Block>
    </Block>
  );
};
