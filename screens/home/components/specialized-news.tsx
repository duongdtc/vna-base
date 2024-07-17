/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { EmptyList, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import {
  selectListSpecializeNews,
  selectLoadingSpecializeNews,
} from '@vna-base/redux/selector';
import { dbsContentActions } from '@vna-base/redux/action-slice';
import { Content } from '@services/axios/axios-email';
import { createStyleSheet, useStyles, bs } from '@theme';
import { SeparatorWidth, WindowWidth, dispatch, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';

export const SpecializedNews = memo(() => {
  const {
    styles,
    theme: { dark },
  } = useStyles(styleSheet);
  const { List } = useSelector(selectListSpecializeNews);
  const isLoading = useSelector(selectLoadingSpecializeNews);

  useEffect(() => {
    dispatch(dbsContentActions.getListSpecializeNews());
  }, []);

  const ListData = useMemo(() => {
    if (isLoading) {
      return Array(4).fill(null) as Array<Content>;
    } else {
      return List?.slice(0, 4);
    }
  }, [List, isLoading]);

  const onViewAll = () => {
    navigate(APP_SCREEN.SPECIALIZE_NEWS_ALL, { isNews: true });
  };

  const onPressItem = (id: string) => {
    navigate(APP_SCREEN.BANNER_AND_NEWS_DETAIL, { id });
  };

  const renderItem = useCallback<ListRenderItem<Content>>(
    ({ item }) => {
      if (isEmpty(item)) {
        return (
          <View style={[bs.borderRadius_8, bs.overflowHidden]}>
            <ContentLoader
              speed={1}
              width={(WindowWidth - 48) / 2}
              height={scale(176)}
              backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
              foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
              <Rect
                x={0}
                y={0}
                width={(WindowWidth - 48) / 2}
                height={scale(176)}
              />
            </ContentLoader>
          </View>
        );
      }

      return (
        <Pressable onPress={() => onPressItem(item.Id!)}>
          <View style={[bs.rowGap_8, styles.itemContentContainer]}>
            <View style={[bs.borderRadius_12, styles.itemContent]}>
              <Image
                source={item.Image ?? images.image_default}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <Text
              text={item.Title as string}
              numberOfLines={1}
              ellipsizeMode="tail"
              fontStyle="Body14Semi"
              colorTheme="neutral100"
            />
          </View>
        </Pressable>
      );
    },
    [dark, styles],
  );

  return (
    <View style={[bs.padding_16, bs.rowGap_16]}>
      <View style={[bs.flexDirectionRow, styles.headerContainer]}>
        <View style={[bs.flex]}>
          <Text
            t18n="home:specialized_news"
            fontStyle="H320Semi"
            colorTheme="neutral90"
          />
        </View>
        <Pressable onPress={onViewAll}>
          <Text
            t18n="common:see_more"
            fontStyle="Body12Med"
            colorTheme="primaryColor"
          />
        </Pressable>
      </View>
      <FlatList
        data={ListData}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item?.Id}_${index}`}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <EmptyList
            style={styles.listEmpty}
            t18nTitle="home:not_found_specialized_news"
          />
        }
      />
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors }) => ({
  itemContentContainer: {
    width: (WindowWidth - 48) / 2,
  },
  itemContent: {
    width: '100%',
    height: scale(176),
    overflow: 'hidden',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listEmpty: {
    height: scale(170),
    width: WindowWidth - SeparatorWidth * 2,
    backgroundColor: colors.neutral50,
    borderRadius: scale(12),
  },
}));
