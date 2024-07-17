import {
  Button,
  EmptyList,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  selectListSpecializeNews,
  selectLoadingPolicy,
  selectLoadingSpecializeNews,
  selectOutStandingPolicy,
} from '@vna-base/redux/selector';
import { dbsContentActions } from '@vna-base/redux/action-slice';
import { Content } from '@services/axios/axios-email';
import { useStyles, bs } from '@theme';
import { HitSlop, dispatch, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl, View } from 'react-native';
import { createStyleSheet } from 'react-native-unistyles';
import { useSelector } from 'react-redux';
import { ItemNews, SkeletonItem } from './components';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const SpecializeNewsAll = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.SPECIALIZE_NEWS_ALL
>) => {
  const { styles } = useStyles(styleSheet);
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

      return isNews ? <ItemNews item={item} /> : <ItemNews item={item} />;
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
            textColorTheme="neutral100"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n={isNews ? 'home:specialized_news' : 'home:specialized_news'}
            fontStyle="H320Semi"
            colorTheme="neutral100"
          />
        }
      />
      <View style={[bs.flex, bs.paddingHorizontal_16]}>
        <FlatList
          data={isNews ? ListDataNews : ListDataPolicy}
          keyExtractor={(item, index) => `${item?.Id}${index}`}
          renderItem={_renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={[bs.height_16]} />}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.01}
          onEndReached={loadMore}
          ListEmptyComponent={
            <EmptyList
              style={{ height: scale(500) }}
              t18nTitle="common:not_found_result"
              t18nSubtitle="common:no_data"
              image="img_empty_total"
              imageStyle={{ width: 234, height: 132 }}
            />
          }
          numColumns={isNews ? 2 : 1}
          columnWrapperStyle={isNews && { justifyContent: 'space-between' }}
        />
      </View>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: { backgroundColor: colors.neutral10 },
}));
