import React, { useMemo, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { execFunc } from '@utils';
import { useInterpolate, useSharedTransition } from '@utils/animated';

import { ACTIVE_COLOR, SIZE, STROKE_WIDTH, UN_ACTIVE_COLOR } from './constants';
import { styles } from './styles';
import { RadioButtonProps } from './type';

export const RadioButton = ({
  value,
  onToggle,
  sizeDot = SIZE - 10,
  initialValue = false,
  activeColor = ACTIVE_COLOR,
  strokeWidth = STROKE_WIDTH,
  unActiveColor = UN_ACTIVE_COLOR,
  disable,
  opacity,
}: RadioButtonProps) => {
  // state

  const [localValue, setLocalValue] = useState<boolean>(initialValue);

  const progress = useSharedTransition(value ?? localValue, { duration: 200 });

  const size = useInterpolate(progress, [0, 1], [0, sizeDot - strokeWidth]);

  // function
  const onPress = () => {
    if (typeof value === 'boolean') {
      execFunc(onToggle, !value);
    } else {
      execFunc(onToggle, !localValue);

      setLocalValue(v => !v);
    }
  };

  // style
  const wrapStyle = useMemo(
    () => ({
      width: sizeDot + 6,
      height: sizeDot + 6,
      borderRadius: (sizeDot + 10) / 2,
      borderWidth: strokeWidth,
    }),
    [sizeDot, strokeWidth],
  );

  // reanimated style
  const wrapAnimaStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [unActiveColor, activeColor],
    ),
    opacity: opacity ?? (disable ? 0.4 : 1),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    borderRadius: (sizeDot - strokeWidth) / 2,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [unActiveColor, activeColor],
    ),
  }));

  // render
  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={disable}>
      <Animated.View style={[styles.wrap, wrapStyle, wrapAnimaStyle]}>
        <Animated.View pointerEvents={'none'} style={[styles.dot, dotStyle]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
