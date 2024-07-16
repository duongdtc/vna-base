import { Block, EmptyList, Screen } from '@vna-base/components';
import React, { useCallback } from 'react';
import { useStyles } from './styles';
import { FilterBar, Header, Item, SkeletonItem } from './components';
import { useFilterFlightTicket } from './hooks';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { useTheme } from '@theme';
import isEmpty from 'lodash.isempty';

export const FlightTicket = () => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { list, formMethod, handleRefresh, loadMore } = useFilterFlightTicket();

  const _renderItem = useCallback<ListRenderItem<string>>(({ item }) => {
    if (isEmpty(item)) {
      return <SkeletonItem />;
    }

    return <Item id={item} />;
  }, []);

  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header />
        <FilterBar />
        <FlatList
          data={list}
          style={styles.list}
          keyExtractor={(item, index) => `${item}${index}`}
          renderItem={_renderItem}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={() => <Block height={8} />}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={handleRefresh}
              tintColor={colors.neutral900}
            />
          }
          onEndReachedThreshold={0.01}
          onEndReached={loadMore}
          ListEmptyComponent={
            <EmptyList
              height={500}
              t18nTitle="order:empty_list"
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
