import { LinearGradient, Screen } from '@vna-base/components';
import { useStyles } from '@theme';
import { scale } from '@vna-base/utils';
import React, { useRef } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { createStyleSheet } from 'react-native-unistyles';
import {
  AnimatedHeader,
  Balance,
  Banner,
  ProcessingTask,
  SpecializedNews,
} from './components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Home = () => {
  const { styles } = useStyles(styleSheet);
  const { top } = useSafeAreaInsets();

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

  const linearGradientOpacity = useDerivedValue(() =>
    interpolate(scrollSharedValue.value, [0, 70], [1, 0], Extrapolate.CLAMP),
  );

  const animatedStyleLinearGradient = useAnimatedStyle(() => ({
    opacity: linearGradientOpacity.value,
  }));

  return (
    <Screen
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <Animated.View
        style={[
          styles.linearContainer,
          { height: scale(96) + top },
          animatedStyleLinearGradient,
        ]}>
        <LinearGradient type="gra1" style={styles.bgLinear} />
      </Animated.View>
      <AnimatedHeader sharedValue={scrollSharedValue} />
      <Animated.ScrollView
        ref={animatedRef}
        onScroll={scrollHandler}
        onMomentumScrollEnd={() => {}}
        onMomentumScrollBegin={() => {}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <Balance />
        <ProcessingTask />
        <Banner />
        <SpecializedNews />
      </Animated.ScrollView>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: { backgroundColor: colors.neutral10 },
  linearContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral100,
  },
  bgLinear: { flex: 1 },
  contentContainer: {
    paddingTop: scale(8),
    rowGap: scale(12),
  },
}));
