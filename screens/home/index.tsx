import {
  AnimatedBg,
  AnimatedHeader,
  CustomScreen,
} from '@screens/home/components';
import { useStyles } from '@theme';
import { scale } from '@vna-base/utils';
import React, { useRef } from 'react';
import Animated, {
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { createStyleSheet } from 'react-native-unistyles';
import { Banner, SpecializedNews } from './components';

export const Home = () => {
  const { styles } = useStyles(styleSheet);

  const scrollSharedValue = useSharedValue(0);
  const animatedRef = useAnimatedRef<ScrollView>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const scrollToY = (y: number) => {
    timeoutRef.current = setTimeout(() => {
      if (y > 40 && y < 72) {
        runOnUI(scrollTo)(animatedRef, 0, 72, true);
      } else if ((y > 5 && y <= 40) || y < 0) {
        runOnUI(scrollTo)(animatedRef, 0, 0, true);
      }
    }, 300);
  };

  const clearTimeoutScroll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        scrollSharedValue.value = withTiming(event.contentOffset.y, {
          duration: 0,
        });
      },
      onBeginDrag: () => {
        runOnJS(clearTimeoutScroll)();
      },
      onEndDrag: event => {
        runOnJS(scrollToY)(event.contentOffset.y);
      },
      onMomentumBegin: () => {
        runOnJS(clearTimeoutScroll)();
      },
      onMomentumEnd: event => {
        runOnJS(scrollToY)(event.contentOffset.y);
      },
    },
    [],
  );

  return (
    <CustomScreen backgroundColor={styles.container.backgroundColor}>
      <AnimatedBg scrollSharedValue={scrollSharedValue} />
      <AnimatedHeader sharedValue={scrollSharedValue} />
      <Animated.ScrollView
        ref={animatedRef}
        onScroll={scrollHandler}
        onMomentumScrollEnd={() => {}}
        onMomentumScrollBegin={() => {}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {/* <Balance /> */}
        {/* <ProcessingTask /> */}
        <Banner />
        <SpecializedNews />
      </Animated.ScrollView>
    </CustomScreen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: { backgroundColor: colors.neutral10 },
  contentContainer: {
    paddingTop: scale(8),
    rowGap: scale(12),
  },
}));
