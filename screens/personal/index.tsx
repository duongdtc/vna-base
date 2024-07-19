import { Block, Button, LinearGradient, Screen } from '@vna-base/components';
import { logout } from '@vna-base/utils';
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
import { PersonalInfo, Setup } from './components';
import { useStyles } from './style';
import { useCASLContext } from '@services/casl';
import { InfoCard } from '@screens/personal/components/info-card';
import { AnimatedHeader } from '@screens/personal/components/animated-header';

export const Personal = () => {
  const styles = useStyles();

  const { can } = useCASLContext();

  const scrollSharedValue = useSharedValue(0);
  const animatedRef = useAnimatedRef<ScrollView>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const hideBalanceAndAgentInfo =
    !can('view', 'agent_info_custom') && !can('view', 'balance_custom');

  const scroll = (y: number) => {
    timeoutRef.current = setTimeout(() => {
      if (y > 56 && y < (hideBalanceAndAgentInfo ? 110 : 180)) {
        runOnUI(scrollTo)(
          animatedRef,
          0,
          hideBalanceAndAgentInfo ? 110 : 180,
          true,
        );
      } else if ((y > 5 && y <= 56) || y < 0) {
        runOnUI(scrollTo)(animatedRef, 0, 0, true);
      }
    }, 300);
  };

  const scrollClearTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollSharedValue.value = withTiming(event.contentOffset.y, {
        duration: 0,
      });
    },

    onBeginDrag: () => {
      runOnJS(scrollClearTimeout)();
    },
    onMomentumBegin: () => {
      runOnJS(scrollClearTimeout)();
    },
    onEndDrag: event => {
      runOnJS(scroll)(event.contentOffset.y);
    },
    onMomentumEnd: event => {
      runOnJS(scroll)(event.contentOffset.y);
    },
  });

  const linearGradientOpacity = useDerivedValue(() =>
    interpolate(scrollSharedValue.value, [0, 100], [1, 0], Extrapolate.CLAMP),
  );

  const animatedStyleLinearGradient = useAnimatedStyle(() => ({
    opacity: linearGradientOpacity.value,
  }));

  // render
  return (
    <Screen
      unsafe
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <Animated.View
        style={[styles.linearContainer, animatedStyleLinearGradient]}>
        <LinearGradient type="gra1" style={styles.bgLinear} />
      </Animated.View>
      <AnimatedHeader sharedValue={scrollSharedValue} />

      <Animated.ScrollView
        ref={animatedRef}
        onScroll={scrollHandler}
        onMomentumScrollBegin={() => {}}
        onMomentumScrollEnd={() => {}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={4}
        contentContainerStyle={[styles.contentContainer]}>
        <InfoCard sharedValue={scrollSharedValue} />
        <PersonalInfo />
        <Setup />
        <Block>
          <Button
            size="medium"
            fullWidth
            t18n="common:logout"
            buttonColorTheme="neutral100"
            textColorTheme="error500"
            onPress={logout}
          />
        </Block>
      </Animated.ScrollView>
    </Screen>
  );
};
