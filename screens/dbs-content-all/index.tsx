import {
  Block,
  Button,
  EmptyList,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  selectOutStandingPolicy,
  selectListSpecializeNews,
  selectLoadingPolicy,
  selectLoadingSpecializeNews,
} from '@redux-selector';
import { dbsContentActions } from '@redux-slice';
import { Content } from '@services/axios/axios-email';
import { HitSlop, dispatch } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemNews, ItemPolicy, SkeletonItem } from './components';
import { useStyles } from './style';

export const DBSContentAll = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.DBS_CONTENT_ALL>) => {
  const styles = useStyles();
  const { isNews } = route.params;

  const isLoadingPolicy = useSelector(selectLoadingPolicy);
  const isLoadingNews = useSelector(selectLoadingSpecializeNews);

  const {
    List: ListNews,
    TotalPage: TotalPageNews,
    PageIndex: PageIndexNews,
  } = useSelector(selectListSpecializeNews);

  const ListDataNews = useMemo(() => {
    if (isLoadingNews) {
      return Array(8).fill(null) as Array<Content>;
    }

    if ((PageIndexNews ?? 0) < (TotalPageNews ?? 0)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return ListNews!.concat([null]);
    }

    return ListNews;
  }, [ListNews, PageIndexNews, TotalPageNews, isLoadingNews]);

  const {
    List: ListPolicy,
    TotalPage: TotalPagePolicy,
    PageIndex: PageIndexPolicy,
  } = useSelector(selectOutStandingPolicy);

  const ListDataPolicy = useMemo(() => {
    if (isLoadingPolicy) {
      return Array(6).fill(null) as Array<Content>;
    }

    if ((PageIndexPolicy ?? 0) < (TotalPagePolicy ?? 0)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return ListPolicy!.concat([null]);
    }

    return ListPolicy;
  }, [ListPolicy, PageIndexPolicy, TotalPagePolicy, isLoadingPolicy]);

  const loadMore = useCallback(() => {
    if (isNews) {
      if ((PageIndexNews ?? 0) < (TotalPageNews ?? 0)) {
        dispatch(
          dbsContentActions.getListSpecializeNews((PageIndexNews ?? 0) + 1),
        );
      }
    } else {
      if ((PageIndexPolicy ?? 0) < (TotalPagePolicy ?? 0)) {
        dispatch(
          dbsContentActions.getListOutStandingPolicy(
            (PageIndexPolicy ?? 0) + 1,
          ),
        );
      }
    }
  }, [PageIndexNews, PageIndexPolicy, TotalPageNews, TotalPagePolicy, isNews]);

  const handleRefresh = useCallback(() => {
    if (isNews) {
      dispatch(dbsContentActions.getListSpecializeNews());
    } else {
      dispatch(dbsContentActions.getListOutStandingPolicy());
    }
  }, [isNews]);

  const _renderItem = useCallback<ListRenderItem<Content>>(
    ({ item }) => {
      if (isEmpty(item)) {
        return <SkeletonItem isNews={isNews} />;
      }

      return isNews ? <ItemNews item={item} /> : <ItemPolicy item={item} />;
    },
    [isNews],
  );

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        shadow=".3"
        colorTheme="neutral100"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n={isNews ? 'home:specialized_news' : 'home:outstanding_policy'}
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1} paddingHorizontal={16}>
        <FlatList
          data={isNews ? ListDataNews : ListDataPolicy}
          keyExtractor={(item, index) => `${item?.Id}${index}`}
          renderItem={_renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <Block height={16} />}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.01}
          onEndReached={loadMore}
          ListEmptyComponent={
            <EmptyList
              height={500}
              t18nTitle="common:not_found_result"
              t18nSubtitle="order:sub_empty_list"
              image="emptyListFlight"
              imageStyle={{ width: 234, height: 132 }}
            />
          }
          numColumns={isNews ? 2 : 1}
          columnWrapperStyle={isNews && { justifyContent: 'space-between' }}
        />
      </Block>
    </Screen>
  );
};
