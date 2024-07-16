import { Block, Child } from '@vna-base/components';
import { PagerProps, PagerRef } from '@vna-base/components/pager/type';
import { WindowWidth } from '@vna-base/utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import isEqual from 'react-fast-compare';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { useValidateForm } from '../../hooks';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export const Pager = memo(
  forwardRef<PagerRef, PagerProps & { sharedValue: SharedValue<number> }>(
    ({ renderScene = [], onChangeTab, sharedValue }, ref) => {
      const scrollViewRef = useRef<ScrollView>(null);
      const { validateForm } = useValidateForm();

      const changeTab = (index: number) => {
        scrollViewRef.current?.scrollTo({
          x: WindowWidth * index,
        });
      };

      useImperativeHandle(ref, () => ({
        changeTab,
      }));

      const validateScroll = useCallback(
        (start: number, end: number) => {
          if (end > start && !validateForm()) {
            scrollViewRef.current?.scrollTo({ x: start });
          }
        },
        [validateForm],
      );

      const onMomentumScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
          onChangeTab?.(
            Math.round(e.nativeEvent.contentOffset.x / WindowWidth),
          );
        },
        [onChangeTab],
      );

      const scrollHandler = useAnimatedScrollHandler(
        {
          onScroll: e => {
            sharedValue.value = e.contentOffset.x;
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          onBeginDrag: (e, ctx: { preX: number }) => {
            ctx.preX = e.contentOffset.x;
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          onEndDrag: (e, ctx: { preX: number }) => {
            runOnJS(validateScroll)(ctx.preX, e.contentOffset.x);
          },
        },
        [],
      );
      return (
        <Animated.ScrollView
          overScrollMode={'never'}
          bounces={false}
          ref={scrollViewRef}
          horizontal
          onScroll={scrollHandler}
          onMomentumScrollEnd={onMomentumScrollEnd}
          pagingEnabled
          scrollEventThrottle={4}
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}>
          {renderScene.map(({ child, tabKey }, index) => (
            <Block key={tabKey} width={WindowWidth}>
              <Child child={child} lazy={index !== 0} lazyTime={50 * index} />
            </Block>
          ))}
        </Animated.ScrollView>
      );
    },
  ),
  isEqual,
);
