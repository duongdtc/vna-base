import { Text } from '@vna-base/components';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
} from 'react-native-tab-view';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from '@theme';
import { scale } from '@vna-base/utils';

export const TabBarDepartureTime = ({
  navigationState,
  jumpTo,
  layout,
}: SceneRendererProps & {
  navigationState: NavigationState<Route>;
}) => {
  const { styles } = useStyles(styleSheet);
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
    <View style={styles.container}>
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
              fontStyle={isTabActive ? 'Body14Bold' : 'Body14Reg'}
              colorTheme={isTabActive ? 'neutral100' : 'neutral60'}
            />
          </Pressable>
        );
      })}
      <Animated.View
        style={[styles.departureTabBarAnimatedFooter, animatedStyleFooter]}
      />
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings, borders }) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral10,
    borderBottomWidth: borders[5],
    borderTopWidth: borders[5],
    borderColor: colors.neutral30,
  },
  departureTabBarAnimatedFooter: {
    backgroundColor: colors.primaryColor,
    bottom: 0,
    position: 'absolute',
    height: scale(3),
  },
  departureTabBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacings[12],
  },
}));
