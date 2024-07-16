import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from './styles';
import { LabelProps } from './type';
import { useTheme } from '@theme';

export type LabelRef = {
  focus: () => void;
  blur: (txt: string) => void;
  isFocused: React.MutableRefObject<boolean>;
};

export const Label = forwardRef<LabelRef, LabelProps>(
  ({ label, labelI18n, layout, ml, required }, ref) => {
    // state
    const [t] = useTranslation();
    const { colors } = useTheme();
    const styles = useStyles();

    const isFocused = useRef(false);

    const labelSize = useSharedValue(16);
    const labelLineHeight = useSharedValue(19);
    const labelColors = useSharedValue(colors.neutral600);
    const transY = useSharedValue(0);
    const left = useSharedValue(ml);

    const textStyles = useAnimatedStyle(() => ({
      fontSize: labelSize.value,
      color: labelColors.value,
      lineHeight: labelLineHeight.value,
    }));

    const containerStyles = useAnimatedStyle(() => ({
      transform: [{ translateY: transY.value }],
      left: left.value,
    }));

    const focus = () => {
      isFocused.current = true;
      labelSize.value = withTiming(12, { duration: 150 });
      labelLineHeight.value = withTiming(16, { duration: 150 });
      transY.value = withTiming(-layout.height / 2 - 2, { duration: 150 });
      labelColors.value = withTiming(colors.neutral900, { duration: 150 });
      left.value = withTiming(10 - layout.x, { duration: 150 });
    };

    const blur = (txt: string) => {
      if (txt === '' || txt === undefined) {
        isFocused.current = false;
        labelSize.value = withTiming(16, { duration: 150 });
        labelLineHeight.value = withTiming(19, { duration: 150 });
        transY.value = withTiming(0, { duration: 150 });
        left.value = withTiming(ml, { duration: 150 });
      }

      labelColors.value = withTiming(colors.neutral600, { duration: 150 });
    };

    useImperativeHandle(ref, () => ({ focus, blur, isFocused }));

    const content = useMemo(
      () => label || (labelI18n && t(labelI18n)),
      [label, labelI18n, t],
    );

    // render
    return (
      <Animated.View
        style={[styles.rowLabel, containerStyles]}
        pointerEvents={'none'}>
        <Animated.Text style={[textStyles, styles.label]}>
          {content}
          {!!required && <Animated.Text style={styles.star}>*</Animated.Text>}
        </Animated.Text>
      </Animated.View>
    );
  },
);
