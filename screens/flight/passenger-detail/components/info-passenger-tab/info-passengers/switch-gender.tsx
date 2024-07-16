import { Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity, scale } from '@vna-base/utils';
import React from 'react';
import { useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const SwitchGender = ({ index }: { index: number }) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const animatedValue = useSharedValue(1);

  const {
    field: { value, onChange },
  } = useController<PassengerForm>({
    name: `Passengers.${index}.Gender`,
    rules: {
      required: true,
    },
  });

  const handlePress = () => {
    onChange(!value);

    animatedValue.value = withTiming(value ? 0 : 1, {
      duration: 300,
      easing: Easing.linear,
    });
  };

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedValue.value * 17 }],
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 1],
        [colors.white, colors.white],
      ),
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={handlePress}
      style={styles.switchContainer(value as boolean)}>
      <Animated.View style={[styles.thumb, animatedThumbStyle]}>
        <Text
          fontStyle="Body10Bold"
          colorTheme="black"
          text={value ? 'NAM' : 'NỮ'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: (isMale: boolean) => ({
    width: scale(54),
    height: scale(24),
    borderRadius: radius[12],
    backgroundColor: isMale ? colors.primaryColor : colors.primaryPressed,
    padding: spacings[2],
    justifyContent: 'center',
  }),
  thumb: {
    width: scale(33),
    height: scale(20),
    borderRadius: radius[12],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
}));
