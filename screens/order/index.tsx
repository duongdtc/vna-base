import { Block, EmptyList, Screen } from '@vna-base/components';
import { useTheme } from '@theme';
import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { FilterBar, Header, OrderItem, SkeletonItem } from './components';
import { useFilterOrder } from './hooks';
import { useStyles } from './style';

export const Order = () => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { list, formMethod, handleRefresh, loadMore } = useFilterOrder();

  const _renderItem = useCallback<ListRenderItem<string>>(({ item }) => {
    if (!item) {
      return <SkeletonItem />;
    }

    return <OrderItem id={item} />;
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
          data={list}
          style={{ marginTop: -1 }}
          keyExtractor={(item, index) => `${item}_${index}`}
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
