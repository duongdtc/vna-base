import {
  Block,
  Button,
  EmptyList,
  NormalHeader,
  Screen,
  Text,
  showToast,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { paymentActions } from '@vna-base/redux/action-slice';
import { useTheme } from '@theme';
import { dispatch, HitSlop } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { FilterButton, Item, Skeleton, TopInfo } from './components';
import { useFilterPayment } from './hooks';
import { useStyles } from './style';

export const PaymentHistory = () => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { list, formMethod, handleRefresh, loadMore } = useFilterPayment();

  const _renderItem = useCallback<ListRenderItem<string>>(({ item }) => {
    if (!item) {
      return <Skeleton />;
    }

    return <Item id={item} />;
  }, []);

  const exportExcel = () => {
    if (list && list.length > 0) {
      dispatch(paymentActions.exportExcel(formMethod.getValues()));
    } else {
      showToast({
        type: 'error',
        t18n: 'payment_history:no_payment_history',
      });
    }
  };

  return (
    <Screen backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <NormalHeader
          colorTheme="neutral100"
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
              t18n="payment_history:payment_history"
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
          data={list}
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
