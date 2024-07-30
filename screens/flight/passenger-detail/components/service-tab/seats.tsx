import {
  selectIsLoadingSeatMaps,
  selectSeatMaps,
} from '@vna-base/redux/selector';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Service } from '.';
import { ItemContainer } from './item-container';
import { SeatItem } from './seat-item';

export const Seats = ({
  t18nTitle,
  icon,
}: Pick<Service, 't18nTitle' | 'icon'>) => {
  const seatMaps = useSelector(selectSeatMaps);
  const isLoading = useSelector(selectIsLoadingSeatMaps);

  const isNotEmp = useMemo(
    () => Object.values(seatMaps).some(seats => seats.length > 0),
    [seatMaps],
  );

  const renderItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex: number;
      isOneway: boolean;
    }) => {
      return <SeatItem {...data} />;
    },
    [],
  );

  return (
    <ItemContainer
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      renderServiceItem={renderItem}
      t18nTitle={t18nTitle}
      disabled={!isNotEmp}
      services={seatMaps}
      loading={isLoading}
      t18nEmpty="input_info_passenger:no_more_seats"
      icon={icon}
    />
  );
};
