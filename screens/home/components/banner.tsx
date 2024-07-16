import { images } from '@assets/image';
import { Image } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import {
  selectLoadingSpecializeNews,
  selectOutStandingPolicy,
} from '@redux-selector';
import { dbsContentActions } from '@redux-slice';
import { Content } from '@services/axios/axios-email';
import { createStyleSheet, useStyles, bs } from '@theme';
import { ActiveOpacity, WindowWidth, dispatch, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import isEqual from 'react-fast-compare';
import { TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  CarouselRenderItem,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';

const Height = (WindowWidth - scale(24)) * (160 / 366);

export const Banner = memo(() => {
  const {
    styles,
    theme: { dark },
  } = useStyles(styleSheet);
  const progress = useSharedValue<number>(0);
  const { List } = useSelector(selectOutStandingPolicy);
  const isLoading = useSelector(selectLoadingSpecializeNews);

  useEffect(() => {
    dispatch(dbsContentActions.getListOutStandingPolicy());
  }, []);

  const data = useMemo(() => {
    if (isLoading) {
      return Array(4).fill(null) as Array<Content>;
    } else {
      return List?.slice(0, 10) ?? [];
    }
  }, [List, isLoading]);

  const baseOptions = {
    vertical: false,
    width: WindowWidth,
    height: Height,
  } as const;

  const renderItem = useCallback<CarouselRenderItem<Content>>(
    ({ item }) => {
      if (isEmpty(item)) {
        return (
          <View style={styles.itemContainer}>
            <View style={[bs.borderRadius_8, bs.overflowHidden]}>
              <ContentLoader
                speed={1}
                width={WindowWidth - scale(24)}
                height={Height}
                backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
                foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
                <Rect
                  x={0}
                  y={0}
                  width={WindowWidth - scale(24)}
                  height={Height}
                />
              </ContentLoader>
            </View>
          </View>
        );
      }

      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          style={styles.itemContainer}
          onPress={() => {
            navigate(APP_SCREEN.BANNER_AND_NEWS_DETAIL, { id: item.Id! });
          }}>
          <Image
            resizeMode="stretch"
            source={item.Image ?? images.image_default}
            containerStyle={styles.img}
          />
        </TouchableOpacity>
      );
    },
    [dark, styles.img, styles.itemContainer],
  );

  return (
    <View style={bs.rowGap_4}>
      <Carousel
        {...baseOptions}
        loop
        autoPlay={true}
        autoPlayInterval={3000}
        data={data}
        pagingEnabled={true}
        renderItem={renderItem}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        onProgressChange={progress}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        containerStyle={styles.dotContainer}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      />
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors }) => ({
  itemContainer: {
    paddingHorizontal: scale(12),
  },
  img: {
    width: WindowWidth - scale(24),
    height: Height,
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  dotContainer: { columnGap: scale(4) },
  dot: {
    width: scale(16),
    height: scale(2),
    borderRadius: scale(2),
    backgroundColor: colors.primarySurface,
  },
  activeDot: {
    backgroundColor: colors.primaryColor,
  },
}));
