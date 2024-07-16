import { Block, Text } from '@vna-base/components';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
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

export const TabBar = ({
  navigationState,
  jumpTo,
  layout,
}: SceneRendererProps & {
  navigationState: NavigationState<Route>;
}) => {
  const styles = useStyles();
  const sharedValue = useSharedValue(0);

  const widthTab = Math.floor(layout.width / navigationState.routes.length);

  const _jumpTo = (key: string, index: number) => {
    sharedValue.value = withTiming(index * widthTab, { duration: 240 });
    jumpTo(key);
  };

  const animatedStyleFooter = useAnimatedStyle(() => ({
    transform: [{ translateX: sharedValue.value + 10 }],
    width: widthTab - 20,
  }));

  useEffect(() => {
    _jumpTo(
      navigationState.routes[navigationState.index].key,
      navigationState.index,
    );
  }, []);

  return (
    <Block
      flexDirection="row"
      colorTheme="neutral100"
      borderBottomWidth={3}
      borderColorTheme="neutral300">
      {navigationState.routes.map((route, idxRoute) => {
        const isTabActive = idxRoute === navigationState.index;
        return (
          <Pressable
            key={route.key}
            onPress={() => _jumpTo(route.key, idxRoute)}
            style={styles.departureTabBarBtn}>
            <Text
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              t18n={route.title}
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
  );
};
