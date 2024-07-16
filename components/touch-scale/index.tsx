import React, { useCallback, useMemo } from 'react';
import {
  GestureResponderEvent,
  Platform,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ActiveOpacity, MinScaleButton, onCheckType } from '@utils';
import { sharedTiming } from '@utils/animated';

import { styles } from './styles';
import { TouchableScaleProps } from './type';

export const TouchableScale = (props: TouchableScaleProps) => {
  // props
  const {
    children,
    onPressIn,
    onPressOut,
    minScale = MinScaleButton,
    containerStyle: overwriteContainerStyle,
    ...rest
  } = props;

  // reanimated
  const scale = useSharedValue(1);

  // function
  const _onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = sharedTiming(minScale, { duration: 150 });

      if (onCheckType(onPressIn, 'function')) {
        onPressIn(e);
      }
    },
    [minScale, onPressIn, scale],
  );

  const _onPressOut = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = sharedTiming(1, { duration: 150 });

      if (onCheckType(onPressOut, 'function')) {
        onPressOut(e);
      }
    },
    [onPressOut, scale],
  );

  //reanimated style
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const activeOpacity = useMemo(
    () => (Platform.OS === 'android' ? 1 : ActiveOpacity),
    [],
  );

  // render
  return (
    <TouchableOpacity
      onPressIn={_onPressIn}
      onPressOut={_onPressOut}
      activeOpacity={activeOpacity}
      {...rest}>
      <Animated.View
        style={[
          styles.container,
          overwriteContainerStyle,
          containerAnimatedStyle,
        ]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
