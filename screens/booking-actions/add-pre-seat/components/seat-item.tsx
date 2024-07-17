/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectLanguage } from '@vna-base/redux/selector';
import { Passenger } from '@vna-base/screens/flight/type';
import { Seat } from '@services/axios/axios-ibe';
import { ActiveOpacity, getFullNameOfPassenger } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { AddPreSeatForm } from '../type';
import { useStyles } from './styles';
import { APP_SCREEN } from '@utils';

export const SeatItem = (props: {
  passengerIndex: number;
  flightIndex: number;
  segmentIndex: number;
}) => {
  const { passengerIndex, flightIndex, segmentIndex } = props;
  const styles = useStyles();
  const lng = useSelector(selectLanguage);
  const { control, getValues, setValue } = useFormContext<AddPreSeatForm>();

  const flights = useWatch({
    control,
    name: 'flights',
  });

  const seat = useWatch({
    control,
    name: `passengers.${passengerIndex}.PreSeats.${flightIndex}.${segmentIndex}`,
  });

  const onPickDone = (seats: Array<Seat | undefined | null>) => {
    seats?.forEach((_seats, index) => {
      setValue(
        `passengers.${index}.PreSeats.${flightIndex}.${segmentIndex}`,
        _seats,
        { shouldDirty: true },
      );
    });
  };

  const onPress = () => {
    const passengerData = getValues().passengers;
    const initData = passengerData
      .filter(passenger => passenger.PaxType !== 'INF')
      ?.map(passenger => passenger?.PreSeats[flightIndex]?.[segmentIndex]);

    navigate(APP_SCREEN.SELECT_SEAT, {
      passengers: passengerData
        .filter(passenger => passenger.PaxType !== 'INF')
        .map(passenger => ({
          ...passenger,
          FullName: getFullNameOfPassenger(passenger),
        })) as Array<Passenger>,
      flightIndex,
      initData: initData,
      initPassengerIndex: passengerIndex,
      segment: {
        ...flights[flightIndex]!.ListSegment![segmentIndex],
        index: segmentIndex,
      },
      onSubmit: onPickDone,
      isSelectForActionBooking: false,
    });
  };

  if (getValues().passengers[passengerIndex].PaxType === 'INF') {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={onPress}
      style={[styles.servicePassengerItem]}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Text
          text={getFullNameOfPassenger(getValues().passengers[passengerIndex])}
          fontStyle="Body12Med"
          colorTheme="neutral900"
        />
        {!seat ? (
          <Block flexDirection="row" columnGap={4} alignItems="center">
            <Text
              t18n="input_info_passenger:select_seat"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
            <Icon
              icon="arrow_ios_down_outline"
              size={16}
              colorTheme="neutral900"
            />
          </Block>
        ) : (
          <Text
            text={lng === 'vi' ? 'Giá' : 'Price'}
            fontStyle="Body12Med"
            colorTheme="neutral900"
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
              colorTheme="neutral800"
            />
            <Text
              text={!seat ? undefined : (seat.SeatNumber as string)}
              fontStyle="Body12Bold"
              colorTheme="success500"
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
