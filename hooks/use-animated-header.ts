/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useInterpolate } from '@utils/animated';
import { useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const useAnimatedHeader = () => {
  const scrollY = useSharedValue(0);
  const transFooterY = useSharedValue(0);
  const [footerHeight, setFooterHeights] = useState(0);
  const [mainHeaderHeight, setMainHeaderHeight] = useState(0);

  const headerHeight = useMemo(
    () => mainHeaderHeight + footerHeight,
    [mainHeaderHeight, footerHeight],
  );

  const scrollHandler = useAnimatedScrollHandler<Record<'prevY', number>>({
    onScroll: (event, ctx) => {
      switch (true) {
        case event.contentOffset.y > 0 &&
          event.contentOffset.y - (ctx?.prevY ?? 0) > 7:
          transFooterY.value = withTiming(-footerHeight, { duration: 100 });
          break;

        case event.contentOffset.y - (ctx?.prevY ?? 0) < -5:
          transFooterY.value = withTiming(0, { duration: 100 });
          break;
      }

      scrollY.value = event.contentOffset.y;
      // @ts-ignore
      ctx.prevY = event.contentOffset.y;
    },
    onBeginDrag: (event, ctx) => {
      // @ts-ignore
      ctx.prevY = event.contentOffset.y;
    },
  });

  const onLayoutHeader = (e: LayoutChangeEvent) => {
    setMainHeaderHeight(e.nativeEvent.layout.height);
  };

  const zIndexMain = useInterpolate(scrollY, [0, mainHeaderHeight], [1, 0]);

  const zIndexSecond = useInterpolate(scrollY, [0, mainHeaderHeight], [0, 1]);

  return {
    zIndexSecond,
    zIndexMain,
    headerHeight,
    onLayoutHeader,
    setFooterHeights,
    scrollHandler,
    transFooterY,
  };
};
