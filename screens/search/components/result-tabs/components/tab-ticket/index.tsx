import { Block, EmptyList } from '@vna-base/components';
import { selectResultSearch } from '@redux-selector';
import { Item } from '@vna-base/screens/flight-ticket/components';
import { Ticket } from '@services/axios/axios-data';
import { scale } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';

export const TabTicket = () => {
  const { Ticket: ticket } = useSelector(selectResultSearch);

  const renderItem = useCallback<ListRenderItem<Ticket>>(({ item }) => {
    return <Item item={item} />;
  }, []);

  return (
    <FlatList
      data={ticket}
      keyExtractor={item => `${item?.Id}`}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Block height={8} />}
      ListEmptyComponent={
        <EmptyList
          t18nTitle="search:no_data"
          height={500}
          image="emptyListFlight"
          imageStyle={{ width: 192, height: 101 }}
        />
      }
      contentContainerStyle={{ padding: scale(12) }}
    />
  );
};
