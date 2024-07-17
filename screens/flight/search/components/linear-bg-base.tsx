import { createStyleSheet, useStyles } from '@theme';
import { LinearGradient } from '@vna-base/components';
import { GradientProps } from '@vna-base/components/linear-gradient/type';
import { scale } from '@vna-base/utils';
import { useInterpolateColor } from '@vna-base/utils/animated';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { UnistylesRuntime } from 'react-native-unistyles';

export const LinearBgBase = ({
  sharedValueScrollView,
  type = 'gra1',
}: Pick<GradientProps, 'type'> & {
  sharedValueScrollView: SharedValue<number>;
}) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const bgHeader = useInterpolateColor(
    sharedValueScrollView,
    [0, 0, 60],
    ['#00000000', '#00000000', colors.neutral10],
  );

  const bgHeaderStyles = useAnimatedStyle(
    () => ({
      backgroundColor: bgHeader.value,
    }),
    [],
  );

  return (
    <View style={styles.bgLinearContainer}>
      <LinearGradient type={type} style={styles.bgLinearAbove} />
      <Animated.View style={[styles.bgLinearBelow, bgHeaderStyles]}>
        <LinearGradient type="transparent" style={styles.bgLinearBelow} />
      </Animated.View>
    </View>
  );
};

const styleSheet = createStyleSheet(() => ({
  bgLinearContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(56 + 132) + UnistylesRuntime.insets.top,
  },
  bgLinearAbove: { flex: 1 },
  bgLinearBelow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scale(132),
  },
}));
