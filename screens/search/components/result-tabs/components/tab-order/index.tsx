import { Block, EmptyList } from '@vna-base/components';
import { selectResultSearch } from '@vna-base/redux/selector';
import { OrderItem } from '@vna-base/screens/order/components';
import { Order } from '@services/axios/axios-data';
import { scale } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';

export const TabOrder = () => {
  const { Order: orders } = useSelector(selectResultSearch);

  const renderItem = useCallback<ListRenderItem<Order>>(
    ({ item }) => (
      <OrderItem
        item={item}
        id=""
        // customStyle={{ borderRadius: scale(12), overflow: 'hidden' }}
      />
    ),
    [],
  );

  return (
    <FlatList
      data={orders}
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
      contentContainerStyle={{ paddingVertical: scale(12) }}
    />
  );
};
