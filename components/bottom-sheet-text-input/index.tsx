import { BottomSheetTextInput as BottomSheetTextInputBase } from '@gorhom/bottom-sheet';
import React, { memo, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { BottomSheetTextInputProps } from './type';
import { Icon } from '@components/icon';
import { useTheme } from '@theme';

export const BottomSheetTextInput = memo(
  (props: BottomSheetTextInputProps) => {
    const {
      leftIcon,
      leftIconSize = 16,
      colorTheme,
      color,
      placeholderColorTheme,
      placeholderTextColor,
      style,
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
            size={leftIconSize}
            colorTheme={colorTheme}
            color={color}
          />
        )}
        <BottomSheetTextInputBase
          ref={inputRef}
          {...subProps}
          placeholderTextColor={
            placeholderColorTheme
              ? colors[placeholderColorTheme]
              : placeholderTextColor
          }
          style={[
            styles.input,
            { color: colorTheme ? colors[colorTheme] : color },
          ]}
        />
      </TouchableOpacity>
    );
  },
  () => true,
);
