import { createStyleSheet, useStyles } from '@theme';
import { Block, EmptyList, Screen } from '@vna-base/components';
import { scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { FilterBar, Header, Item, SkeletonItem } from './components';
import { useFilterFlightTicket } from './hooks';

export const FlightTicket = () => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

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

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    backgroundColor: colors.neutral30,
  },
  contentContainer: {
    paddingHorizontal: scale(12),
    paddingTop: 8,
    paddingBottom: UnistylesRuntime.insets.bottom + 8,
  },
  list: {
    marginTop: -1,
  },
}));
