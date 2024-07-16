import { Block, EmptyList } from '@vna-base/components';
import { Ticket } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject, useRealm } from '@services/realm/provider';
import React, { memo, useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemFlTicket } from './item-ticket';
import { useStyles } from './style';

export const TabTicket = memo(({ id }: { id: string }) => {
  const styles = useStyles();
  const realm = useRealm();
  const orderDetail = useObject<OrderRealm>(OrderRealm.schema.name, id);

  const [listTicket, setListTicket] = useState<Record<string, Array<Ticket>>>(
    {},
  );

  useEffect(() => {
    orderDetail?.Bookings.forEach(bookingId => {
      realm
        .objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, bookingId)
        ?.addListener(newBooking => {
          setListTicket(pre => ({
            ...pre,
            [bookingId]: newBooking.Tickets.map(tk => tk),
          }));
        });
    });

    return () => {
      orderDetail?.Bookings.forEach(bookingId => {
        realm
          .objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, bookingId)
          ?.removeAllListeners();
      });
    };
  }, []);

  const renderItem = useCallback<ListRenderItem<Ticket>>(({ item }) => {
    return <ItemFlTicket item={item} />;
  }, []);

  return (
    <Block flex={1}>
      <FlatList
        data={Object.values(listTicket).flatMap(arrTk => arrTk)}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => (
          <Block height={1} colorTheme="neutral50" />
        )}
        ListEmptyComponent={
          <EmptyList
            height={500}
            image="emptyListFlight"
            imageStyle={{ width: 192, height: 101 }}
            t18nTitle="common:no_data"
          />
        }
        style={{ paddingTop: 12, paddingHorizontal: 12 }}
        contentContainerStyle={styles.contentContainer}
      />
    </Block>
  );
}, isEqual);
