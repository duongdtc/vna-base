import { Text } from '@vna-base/components';
import React, { memo, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const NextStepText = memo(() => {
  const sharedValue = useSharedValue(182);

  useEffect(() => {
    sharedValue.value = withRepeat(withTiming(194, { duration: 1000 }), -1);
  }, []);

  const styles = useAnimatedStyle(() => ({
    marginHorizontal: 8,
    marginBottom: 8,
    width: sharedValue.value,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 18,
  }));

  return (
    <Animated.View style={styles}>
      <Text
        t18n="flight:select_next_stage"
        fontStyle="Body14Semi"
        colorTheme="warning600"
      />
    </Animated.View>
  );
});
