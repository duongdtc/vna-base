import { Block, Icon, Separator, Text } from '@vna-base/components';
import { selectLanguage } from '@vna-base/redux/selector';
import { useWatchName } from '@vna-base/screens/flight/passenger-detail/hooks';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { bs } from '@theme';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export const SeatItem = ({
  passengerIndex,
  flightIndex,
}: {
  passengerIndex: number;
  flightIndex: number;
}) => {
  const { control } = useFormContext<PassengerForm>();
  const lng = useSelector(selectLanguage);

  const fullName = useWatchName(passengerIndex);

  const preSeat = useWatch({
    control,
    name: `Passengers.${passengerIndex}.PreSeats.${flightIndex}`,
  });

  if (!preSeat[0] || isEmpty(preSeat[0])) {
    return null;
  }

  return (
    <Block>
      <View style={[bs.marginVertical_16]}>
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
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon icon="seat_fill" size={16} colorTheme="neutral80" />
          <Text
            t18n="input_info_passenger:seat_number"
            fontStyle="Body14Semi"
            colorTheme="neutral80"
          />
          <Text
            text={preSeat[0]?.SeatNumber as string}
            fontStyle="Body14Bold"
            colorTheme="successColor"
          />
        </Block>

        <Text
          text={preSeat[0]?.Price?.currencyFormat()}
          fontStyle="Body14Bold"
          colorTheme="price"
        />
      </Block>
    </Block>
  );
};
