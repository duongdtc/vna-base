import { Block, ContentLoading, EmptyList, Screen } from '@vna-base/components';
import { Agent as AgentAxios } from '@services/axios/axios-data';
import { WindowWidth, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { AgentItem, FilterBar, Header } from './components';
import { useFilterAgent } from './hooks';
import { useStyles } from './style';

export const Agents = () => {
  const styles = useStyles();

  const { formMethod, handleRefresh, loadMore, ListAgent, TotalItem } =
    useFilterAgent();

  const _renderItem = useCallback<ListRenderItem<AgentAxios>>(({ item }) => {
    if (isEmpty(item)) {
      return <ContentLoading width={WindowWidth - scale(20)} />;
    }

    return <AgentItem item={item} />;
  }, []);

  // render
  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header />
        <FilterBar total={TotalItem ?? 0} />
        <FlatList
          data={ListAgent}
          keyExtractor={(item, index) => `${item?.Id}${index}`}
          renderItem={_renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <Block height={8} />}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
          onEndReachedThreshold={0.01}
          onEndReached={loadMore}
          ListEmptyComponent={
            <EmptyList
              height={500}
              t18nTitle="agent:not_found_agent"
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
