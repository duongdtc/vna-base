/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Icon } from '@vna-base/components';
import { selectCurrentStage, selectListRoute } from '@vna-base/redux/selector';
import { FareFilter } from '@vna-base/screens/flight/type';
import { bs } from '@theme';
import React, { memo, useCallback, useRef } from 'react';
import { ListRenderItem, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import { useSelector } from 'react-redux';
import { useMinFareFollowingDate, useScrollDateHeader } from '../hooks';
import { DateHeaderItem } from './date-header-item';

export const DateHeaderSearchFlight = memo(
  () => {
    const headerRef = useRef<FlatList<Date>>(null);

    const currentStage = useSelector(selectCurrentStage);
    const listRoute = useSelector(selectListRoute);

    const { leftArrowStyle, rightArrowStyle, scrollHandler } =
      useScrollDateHeader(headerRef);

    const { data, minDate } = useMinFareFollowingDate();

    const _renderHeaderItem: ListRenderItem<{
      date: Date;
      fare: FareFilter;
    }> = useCallback(
      ({ item, index }) => (
        <DateHeaderItem {...item} index={index} minDate={minDate} />
      ),
      [minDate],
    );

    if (currentStage === listRoute.length) {
      return null;
    }

    // render
    return (
      <View style={[bs.paddingTop_4, bs.paddingBottom_12]}>
        <Animated.View style={leftArrowStyle}>
          <Icon icon="arrow_ios_left_fill" size={16} colorTheme="white" />
        </Animated.View>
        <View style={bs.marginHorizontal_24}>
          <Animated.FlatList
            //@ts-ignore
            ref={headerRef}
            horizontal
            data={data}
            onScroll={scrollHandler}
            keyExtractor={item => item.date.toISOString()}
            showsHorizontalScrollIndicator={false}
            renderItem={_renderHeaderItem}
          />
        </View>
        <Animated.View style={rightArrowStyle}>
          <Icon icon="arrow_ios_right_fill" size={16} colorTheme="white" />
        </Animated.View>
      </View>
    );
  },
  () => true,
);
