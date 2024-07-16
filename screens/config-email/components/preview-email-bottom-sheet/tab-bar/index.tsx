import React, { useRef } from 'react';
import {
  NavigationState,
  Route,
  SceneRendererProps,
} from 'react-native-tab-view';
import { useStyles } from './styles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { Block, Text } from '@vna-base/components';
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet';
import { WindowWidth } from '@vna-base/utils';

const WIDTH_TAB = 102;

export const TabBar = ({
  navigationState,
  jumpTo,
}: SceneRendererProps & {
  navigationState: NavigationState<Route>;
}) => {
  const styles = useStyles();
  const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null);
  const sharedValue = useSharedValue(0);

  const _jumpTo = (key: string, index: number) => {
    sharedValue.value = withTiming(index * WIDTH_TAB, { duration: 240 });
    jumpTo(key);

    scrollViewRef.current?.scrollTo({
      x: WIDTH_TAB * (index + 0.5) - WindowWidth / 2,
      animated: true,
    });
  };

  const animatedStyleFooter = useAnimatedStyle(() => ({
    transform: [{ translateX: sharedValue.value + 10 }],
    width: WIDTH_TAB - 20,
  }));

  return (
    <Block
      borderBottomWidth={5}
      borderTopWidth={5}
      height={44}
      colorTheme="neutral100"
      borderColorTheme="neutral300">
      <BottomSheetScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <Block flexDirection="row" colorTheme="neutral100" height={44}>
          {navigationState.routes.map((route, idxRoute) => {
            const isTabActive = idxRoute === navigationState.index;
            return (
              <Pressable
                key={route.key}
                onPress={() => _jumpTo(route.key, idxRoute)}
                style={[styles.departureTabBarBtn, { width: WIDTH_TAB }]}>
                <Text
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  t18n={route.t18n}
                  fontStyle="Body16Reg"
                  colorTheme={isTabActive ? 'neutral900' : 'neutral600'}
                />
              </Pressable>
            );
          })}
          <Animated.View
            style={[styles.departureTabBarAnimatedFooter, animatedStyleFooter]}
          />
        </Block>
      </BottomSheetScrollView>
    </Block>
  );
};
