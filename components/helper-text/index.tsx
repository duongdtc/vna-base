import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useTheme } from '@theme';
import {
  sharedTiming,
  useInterpolate,
  useSharedTransition,
} from '@utils/animated';

import { Text } from '@vna-base/components/text';
import { styles } from './styles';
import { HelperTextProps } from './type';

export const HelperText = ({ msg, colorTheme }: HelperTextProps) => {
  // state
  const { colors } = useTheme();

  const [measured, setMeasured] = useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const [currentMessage, setCurrentMessage] = useState<string>(msg ?? '');

  const progress = useSharedTransition(msg !== '');

  const height = useSharedValue(0);

  const opacity = useInterpolate(progress, [0, 1], [0, 1]);

  // function
  const _onLayoutContent = (e: LayoutChangeEvent) => {
    setMeasured({ ...e.nativeEvent.layout });
  };

  // style
  const textStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      { height: measured.height },
      {
        color: colorTheme ? colors[colorTheme] : colors.neutral600,
      },
    ],
    [measured.height, colorTheme, colors],
  );

  // effect
  useEffect(() => {
    if (msg) {
      setCurrentMessage(msg);
    }
  }, [msg]);

  useEffect(() => {
    height.value = sharedTiming(measured.height);
  }, [height, measured.height]);

  // reanimated style
  const style = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  // render
  return (
    <View style={[styles.container]}>
      <Animated.View
        pointerEvents={'none'}
        onLayout={_onLayoutContent}
        style={[styles.hiddenView]}>
        <Text
          style={[styles.text]}
          fontStyle="Body10Semi"
          colorTheme="neutral600">
          {currentMessage}
        </Text>
      </Animated.View>
      <Animated.View style={[style]}>
        <Text
          style={[styles.text, textStyle]}
          fontStyle="Body10Semi"
          colorTheme="neutral600">
          {currentMessage}
        </Text>
      </Animated.View>
    </View>
  );
};
