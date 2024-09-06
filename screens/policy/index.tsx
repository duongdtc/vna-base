import { Policy as PolicyType } from '@services/axios/axios-data';
import { createStyleSheet, useStyles } from '@theme';
import { Block, EmptyList, Screen } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { WindowWidth, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useRef } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { FilterBar, Header, Item } from './components';
import { FilterBottomSheet } from './components/filter-bar/filter-bottom-sheet';
import { useFilterOrder } from './hooks';
import { Filter, FilterFormInBottomSheet, FilterName } from './type';

export const Policy = () => {
  const {
    styles,
    theme: { colors, dark },
  } = useStyles(styleSheet);
  const filterRef = useRef<NormalRef>(null);

  const { list, formMethod, handleRefresh, loadMore } = useFilterOrder();

  const _renderItem = useCallback<ListRenderItem<PolicyType>>(
    ({ item }) => {
      if (isEmpty(item)) {
        return (
          <Block padding={12} colorTheme="neutral100">
            <ContentLoader
              speed={1}
              width={WindowWidth - 24}
              height={scale(80)}
              backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
              foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
              <Rect x={0} y={0} width={WindowWidth - 144} height={scale(22)} />
              <Rect
                x={WindowWidth - 125}
                y={0}
                width={112}
                height={scale(22)}
              />

              <Rect x={0} y={36} width={16} height={18} />
              <Rect x={20} y={36} width={90} height={18} />
              <Rect x={132} y={36} width={WindowWidth - 132} height={18} />

              <Rect x={0} y={62} width={16} height={18} />
              <Rect x={20} y={62} width={90} height={18} />
              <Rect x={132} y={62} width={70} height={18} />
            </ContentLoader>
          </Block>
        );
      }

      return <Item {...item} />;
    },
    [dark],
  );

  const closeBottomSheet = useCallback(() => {
    filterRef.current?.close();
  }, []);

  const showFilterBottomSheet = useCallback(() => {
    filterRef.current?.expand();
  }, []);

  const submitFilterForm = useCallback(
    (data: FilterFormInBottomSheet) => {
      const d: Array<Filter> = [];
      Object.keys(data.Filter).forEach(k => {
        if (
          data.Filter[k as FilterName] &&
          data.Filter[k as FilterName] !== ''
        ) {
          d.push({
            Name: k as FilterName,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            Value: data.Filter[k as FilterName],
            Contain: true,
          });
        }
      });

      formMethod.setValue('Filter', d, { shouldDirty: true });
    },
    [formMethod],
  );

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header />
        <FilterBar showFilterBottomSheet={showFilterBottomSheet} />
        <FlatList
          data={list}
          style={{ marginTop: -1 }}
          keyExtractor={(item, index) => `${item?.Id}${index}`}
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
      <FilterBottomSheet
        ref={filterRef}
        onDismiss={submitFilterForm}
        closeBottomSheet={closeBottomSheet}
      />
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    backgroundColor: colors.neutral30,
  },
  contentContainer: { paddingTop: 8, paddingBottom: scale(36) },
}));
