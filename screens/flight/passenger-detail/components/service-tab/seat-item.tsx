/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectLanguage } from '@vna-base/redux/selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { Seat } from '@services/axios/axios-ibe';
import { ActiveOpacity, scale } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useWatchName } from '../../hooks';
import { createStyleSheet, useStyles } from '@theme';
import { SeatItemProps } from './type';
import { APP_SCREEN } from '@utils';

export const SeatItem = (props: SeatItemProps) => {
  const { styles } = useStyles(styleSheet);
  const { passengerIndex, flightIndex, segmentIndex, isOneway } = props;

  const { control, getValues, setValue } = useFormContext<PassengerForm>();

  const lng = useSelector(selectLanguage);

  const fullName = useWatchName(passengerIndex);

  const typePassenger = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Type`,
  });

  const seat = useWatch({
    control,
    name: `Passengers.${passengerIndex}.PreSeats.${flightIndex}.${segmentIndex}`,
  });

  const onPickDone = (seats: Array<Seat | undefined | null>) => {
    seats?.forEach((_seats, index) => {
      setValue(
        `Passengers.${index}.PreSeats.${flightIndex}.${segmentIndex}`,
        _seats,
      );
    });
  };

  const onPress = () => {
    const passengerData = getValues().Passengers;
    const initData = passengerData
      .filter(passenger => passenger.Type !== 'INF')
      ?.map(passenger => passenger?.PreSeats[flightIndex]?.[segmentIndex]);

    navigate(APP_SCREEN.SELECT_SEAT, {
      passengers: passengerData
        .filter(passenger => passenger.Type !== 'INF')
        .map(passenger => ({ ...passenger, FullName: fullName })),
      flightIndex,
      initData: initData,
      initPassengerIndex: passengerIndex,
      segment: {
        ...getValues().FLights[flightIndex].ListSegment![segmentIndex],
        index: segmentIndex,
      },
      onSubmit: onPickDone,
    });
  };

  if (typePassenger === 'INF') {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={onPress}
      style={[
        styles.servicePassengerItem,
        isOneway && {
          paddingHorizontal: scale(12),
        },
      ]}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Text text={fullName} fontStyle="Body12Med" colorTheme="neutral100" />
        {!seat ? (
          <Block flexDirection="row" columnGap={4} alignItems="center">
            <Text
              t18n="input_info_passenger:select_seat"
              fontStyle="Body12Reg"
              colorTheme="neutral80"
            />
            <Icon
              icon="arrow_ios_down_outline"
              size={16}
              colorTheme="neutral100"
            />
          </Block>
        ) : (
          <Text
            text={lng === 'vi' ? 'Giá' : 'Price'}
            fontStyle="Body12Med"
            colorTheme="neutral100"
          />
        )}
      </Block>
      {seat && (
        <Block
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              t18n="input_info_passenger:seat_number"
              fontStyle="Body12Med"
              colorTheme="neutral80"
            />
            <Text
              text={!seat ? undefined : (seat.SeatNumber as string)}
              fontStyle="Body12Bold"
              colorTheme="successColor"
            />
          </Block>
          <Text
            text={!seat ? undefined : seat.Price?.currencyFormat()}
            fontStyle="Body12Bold"
            colorTheme="price"
          />
        </Block>
      )}
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  servicePassengerItem: {
    paddingVertical: spacings[12],
  },
}));
