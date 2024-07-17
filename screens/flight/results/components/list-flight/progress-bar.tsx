import { selectSearchDone } from '@vna-base/redux/selector';
import { useStyles } from '@theme';
import { scale } from '@vna-base/utils';
import { useInterpolate } from '@vna-base/utils/animated';
import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

export const ProgressBar = memo(
  () => {
    const sharedValue = useSharedValue(0);
    const {
      theme: { colors },
    } = useStyles();
    const searchDone = useSelector(selectSearchDone);

    useEffect(() => {
      sharedValue.value = withTiming(searchDone ? 1 : 0.8, { duration: 500 });
    }, [searchDone, sharedValue]);

    const opacityProgressBar = useInterpolate(
      sharedValue,
      [0, 0.9, 1],
      [1, 0.9, 0],
    );

    const animatedProgressBar = useAnimatedStyle(() => ({
      width: `${sharedValue.value * 100}%`,
      opacity: opacityProgressBar.value,
    }));

    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height: scale(4),
          },
        ]}>
        <Animated.View
          style={[
            { height: '100%', backgroundColor: colors.white },
            animatedProgressBar,
          ]}
        />
      </View>
    );
  },
  () => true,
);
