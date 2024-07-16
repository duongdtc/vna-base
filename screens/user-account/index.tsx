import { Block, ContentLoading, EmptyList, Screen } from '@vna-base/components';
import { WindowWidth, scale } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FilterBar, Header, UserAccountItem } from './components';
import { useStyles } from './style';
import { useFilterUserAccount } from './hooks';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import isEmpty from 'lodash.isempty';
import { UserAccount as UserAccountAxios } from '@services/axios/axios-data';
import { FormProvider } from 'react-hook-form';

export const UserAccountScreen = () => {
  const styles = useStyles();

  const { formMethod, handleRefresh, loadMore, ListUserAccount, TotalItem } =
    useFilterUserAccount();

  const _renderItem = useCallback<ListRenderItem<UserAccountAxios>>(
    ({ item }) => {
      if (isEmpty(item)) {
        return <ContentLoading width={WindowWidth - scale(20)} />;
      }

      return <UserAccountItem item={item} />;
    },
    [],
  );

  // render
  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header />
        <FilterBar total={TotalItem ?? 0} />
        <FlatList
          data={ListUserAccount}
          showsVerticalScrollIndicator={false}
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
