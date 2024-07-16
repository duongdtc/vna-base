/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { FlightOfPassengerForm, Passenger } from '@vna-base/screens/flight/type';
import { Seat } from '@services/axios/axios-ibe';
import { getFullNameOfPassenger } from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { AddPreSeatForm } from '../type';
import { FlightItem } from './flight-item';
import { SeatItem } from './seat-item';
import { APP_SCREEN } from '@utils';

export const ListFlight = memo(() => {
  const { getValues, setValue, control } = useFormContext<AddPreSeatForm>();

  const flights = useWatch({
    control,
    name: 'flights',
  });

  const onPickDone = useCallback(
    (flIndex: number, segmentIndex: number) =>
      (seats: Array<Seat | undefined | null>) => {
        seats?.forEach((_seats, index) => {
          setValue(
            `passengers.${index}.PreSeats.${flIndex}.${segmentIndex}`,
            _seats,
            {
              shouldDirty: true,
            },
          );
        });
      },
    [setValue],
  );

  const onPressPreSeat = useCallback(
    (flightIdx: number, segmentIdx: number) => {
      const passengerData = getValues().passengers;
      const initData = passengerData
        .filter(passenger => passenger.PaxType !== 'INF')
        ?.map(passenger => passenger?.PreSeats[flightIdx]?.[segmentIdx]);

      navigate(APP_SCREEN.SELECT_SEAT, {
        passengers: passengerData
          .filter(passenger => passenger.PaxType !== 'INF')
          .map(passenger => ({
            ...passenger,
            FullName: getFullNameOfPassenger(passenger),
          })) as Array<Passenger>,
        flightIndex: flightIdx,
        initData: initData,
        initPassengerIndex: 0,
        segment: {
          ...flights[flightIdx]!.ListSegment![segmentIdx],
          index: segmentIdx,
        },
        onSubmit: onPickDone(flightIdx, segmentIdx),
        isSelectForActionBooking: false,
      });
    },
    [flights, getValues, onPickDone],
  );

  const _renderServiceItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex: number;
    }) => <SeatItem {...data} />,
    [],
  );

  const renderFlight = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    ({ item, index }) => (
      <FlightItem
        {...item}
        index={index}
        renderSegment={true}
        onPressSegmentPreSeat={onPressPreSeat}
        renderServiceItem={_renderServiceItem}
      />
    ),
    [_renderServiceItem, onPressPreSeat],
  );

  return (
    <FlatList
      data={flights}
      renderItem={renderFlight}
      scrollEnabled={false}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={() => <Block height={12} />}
    />
  );
}, isEqual);
