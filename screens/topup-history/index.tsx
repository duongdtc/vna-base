import { goBack } from '@navigation/navigation-service';
import { TopupRealm } from '@services/realm/models';
import { useQuery } from '@services/realm/provider';
import {
  Block,
  Button,
  EmptyList,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { HitSlop, load, StorageKey } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { FilterButton, Item, Skeleton, TopInfo } from './components';
import { useFilterTopup } from './hooks';
import { useStyles } from './style';

export const TopupHistory = () => {
  const styles = useStyles();

  const { formMethod } = useFilterTopup();

  const agentId = load(StorageKey.CURRENT_AGENT_ID);

  const allTopup = useQuery<TopupRealm>(TopupRealm.schema.name);

  const listTopup = allTopup
    .filtered('AgentId == $0', agentId)
    .sorted('CreatedDate', true);

  const _renderItem = useCallback<ListRenderItem<TopupRealm>>(({ item }) => {
    if (!item) {
      return <Skeleton />;
    }

    return <Item item={item} />;
  }, []);

  const exportExcel = () => {
    // if (list && list.length > 0) {
    //   dispatch(topupActions.exportExcel(formMethod.getValues()));
    // } else {
    //   showToast({
    //     type: 'error',
    //     t18n: 'topup:no_transaction_history',
    //   });
    // }
  };

  return (
    <Screen backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <NormalHeader
          colorTheme="neutral10"
          leftContent={
            <Button
              hitSlop={HitSlop.Large}
              leftIcon="arrow_ios_left_fill"
              leftIconSize={24}
              textColorTheme="neutral900"
              onPress={() => {
                goBack();
              }}
              padding={4}
            />
          }
          centerContent={
            <Text
              fontStyle="Title20Semi"
              t18n="transaction_history:topup_history"
              colorTheme="neutral900"
            />
          }
          rightContent={
            <Block flexDirection="row" columnGap={4} alignItems="center">
              <Button
                hitSlop={HitSlop.Large}
                leftIcon="excel_fill"
                leftIconSize={24}
                textColorTheme="neutral900"
                padding={4}
                onPress={exportExcel}
              />
              <FilterButton />
            </Block>
          }
        />

        <TopInfo />
        <FlatList
          data={listTopup}
          keyExtractor={(item, index) => `${item}_${index}`}
          renderItem={_renderItem}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={() => <Block height={8} />}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={false}
          //     onRefresh={handleRefresh}
          //     tintColor={colors.neutral900}
          //   />
          // }
          // onEndReachedThreshold={0.01}
          // onEndReached={loadMore}
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
