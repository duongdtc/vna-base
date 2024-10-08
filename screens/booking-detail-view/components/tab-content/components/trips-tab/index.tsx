/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { selectViewingBookingVersion } from '@vna-base/redux/selector';
import { Flight } from '@services/axios/axios-data';
import { scale } from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemFlightJourney } from './item-flight-journey';
import { useStyles } from './style';

export const TripsTab = () => {
  const styles = useStyles();

  const bookingDetail = useSelector(selectViewingBookingVersion);

  const fareClassFollowingADT = useMemo(() => {
    const ADTs = [];
    for (
      let i = 0;
      i < (bookingDetail?.FareInfos ?? []).length;
      i += bookingDetail?.Passengers?.length ?? 0
    ) {
      ADTs.push(bookingDetail?.FareInfos![i]);
    }

    return ADTs;
  }, [bookingDetail?.FareInfos, bookingDetail?.Passengers?.length]);

  const data = useMemo(
    () =>
      bookingDetail?.Flights?.map((journey, idx) => ({
        ...journey,
        ...fareClassFollowingADT[idx],
      })) ?? [],
    [bookingDetail?.Flights, fareClassFollowingADT],
  );

  const renderItem = useCallback<ListRenderItem<Flight>>(({ item }) => {
    return <ItemFlightJourney item={item} />;
  }, []);

  return (
    <Block flex={1}>
      <FlatList
        showsVerticalScrollIndicator={false}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        data={data}
        keyExtractor={(item, index) => `${item.Id}-${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Block height={scale(12)} />}
        contentContainerStyle={styles.contentContainer}
      />
    </Block>
  );
};
