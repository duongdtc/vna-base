import { Block, EmptyList, Screen } from '@vna-base/components';
import isEmpty from 'lodash.isempty';
import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { BookingItem, FilterBar, Header } from './components';
import { Skeleton } from './components/booking-item/skeleton';
import { useFilterBooking } from './hooks';
import { useStyles } from './style';

export const Bookings = () => {
  const styles = useStyles();

  const { list, formMethod, handleRefresh } = useFilterBooking();

  const _renderItem = useCallback<ListRenderItem<string>>(({ item }) => {
    if (isEmpty(item)) {
      return <Skeleton />;
    }

    return <BookingItem id={item} />;
  }, []);

  // render
  return (
    <Screen
      unsafe={true}
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <FormProvider {...formMethod}>
        <Header />
        <FilterBar />
        <FlatList
          style={{ marginTop: -1 }}
          data={list}
          keyExtractor={(item, index) => `${item}${index}`}
          renderItem={_renderItem}
          contentContainerStyle={{ padding: 8, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <Block height={8} />}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
          onEndReachedThreshold={0.01}
          // onEndReached={loadMore}
          ListEmptyComponent={
            <EmptyList
              height={500}
              t18nTitle="booking:not_found_booking"
              t18nSubtitle="order:sub_empty_list"
              image="emptyListFlight"
              imageStyle={{ width: 234, height: 132 }}
            />
          }
        />
      </FormProvider>
    </Screen>
  );
};
