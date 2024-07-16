import { IconTypes } from '@assets/icon';
import { Icon } from '@vna-base/components/icon';
import { Colors, useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { scale } from '@vna-base/utils';
import React, { useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

type TextInputWithLeftIconProps = TextInputProps & {
  leftIcon?: IconTypes;
  leftIconSize?: number;
  leftIconColorTheme?: keyof Colors;
  leftIconStyle?: StyleProp<TextStyle>;
  styleInput?: StyleProp<TextStyle>;
};

export const TextInputWithLeftIcon = (props: TextInputWithLeftIconProps) => {
  const {
    leftIcon,
    leftIconSize = 16,
    leftIconColorTheme = 'neutral900',
    style,
    styleInput,
    ...subProps
  } = props;
  const inputRef = useRef<any>(null);
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={1}
      onPress={() => {
        inputRef.current?.focus();
      }}>
      {leftIcon && (
        <Icon
          icon={leftIcon}
          colorTheme={leftIconColorTheme}
          size={leftIconSize}
        />
      )}
      <TextInput
        ref={inputRef}
        {...subProps}
        style={[styles.input, styleInput]}
        placeholderTextColor={colors.neutral500}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(10),
    columnGap: scale(6),
    ...FontStyle.Body12Reg,
  },
  input: {
    flex: 1,
  },
});
