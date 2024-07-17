/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { Flight } from '@services/axios/axios-data';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { FlightItem } from './flight-item';
import { SeatItem } from './seat-item';
import { useFormContext } from 'react-hook-form';
import { SeatMapUpdateForm } from '../type';
import { navigate } from '@navigation/navigation-service';
import { getFullNameOfPassenger } from '@vna-base/utils';
import { Passenger } from '@vna-base/screens/flight/type';
import { Seat } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { APP_SCREEN } from '@utils';

export const ListFlight = memo(() => {
  const { bookingId } = useSelector(selectCurrentFeature);

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const { getValues, setValue } = useFormContext<SeatMapUpdateForm>();

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
          ...bookingDetail!.Flights![flightIdx]!.Segments![segmentIdx],
          index: segmentIdx,
        },
        onSubmit: onPickDone(flightIdx, segmentIdx),
        isSelectForActionBooking: true,
      });
    },
    [bookingDetail, getValues, onPickDone],
  );

  const _renderServiceItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex: number;
    }) => (
      <SeatItem {...data} isOneway={bookingDetail?.Flights?.length !== 1} />
    ),
    [bookingDetail?.Flights?.length],
  );

  const renderFlight = useCallback<ListRenderItem<Flight>>(
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      data={bookingDetail?.Flights ?? []}
      renderItem={renderFlight}
      scrollEnabled={false}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={() => <Block height={12} />}
    />
  );
}, isEqual);
