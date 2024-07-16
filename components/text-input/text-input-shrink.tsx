import { Icon } from '@vna-base/components/icon';
import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { scale } from '@utils';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { TextInputShrinkProps } from './type';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export const TextInputShrink = forwardRef<TextInput, TextInputShrinkProps>(
  (props, ref) => {
    const { colors } = useTheme();
    const {
      leftIcon,
      leftIconSize = 16,
      leftIconColorTheme = 'neutral900',
      rightIcon,
      rightIconSize = 16,
      rightIconColorTheme = 'neutral900',
      fontStyle,
      style,
      styleInput: styleInput,
      placeholderTextColor = colors.neutral500,
      disable,
      useBottomSheetInput = false,
      ...subProps
    } = props;
    const inputRef = useRef<any>(null);

    const [isShowIcon, setIsShowIcon] = useState(true);

    const onFocus = () => {
      setIsShowIcon(false);
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 160,
      });
    };

    const onBlur = () => {
      setIsShowIcon(true);
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 160,
      });
    };

    useImperativeHandle(ref, () => inputRef.current, []);

    return (
      <TouchableOpacity
        disabled={disable}
        style={[styles.container, style]}
        activeOpacity={1}
        onPress={() => {
          inputRef.current?.focus();
        }}>
        {!disable && leftIcon && isShowIcon && (
          <Icon
            icon={leftIcon}
            colorTheme={leftIconColorTheme}
            size={leftIconSize}
          />
        )}
        {useBottomSheetInput ? (
          <BottomSheetTextInput
            ref={inputRef}
            {...subProps}
            style={[styles.input, FontStyle[fontStyle], styleInput]}
            placeholderTextColor={placeholderTextColor}
            onFocus={onFocus}
            onBlur={onBlur}
            editable={!disable}
          />
        ) : (
          <TextInput
            ref={inputRef}
            {...subProps}
            style={[styles.input, FontStyle[fontStyle], styleInput]}
            placeholderTextColor={placeholderTextColor}
            onFocus={onFocus}
            onBlur={onBlur}
            editable={!disable}
          />
        )}
        {!disable && rightIcon && isShowIcon && (
          <Icon
            icon={rightIcon}
            colorTheme={rightIconColorTheme}
            size={rightIconSize}
          />
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: scale(4),
  },
  input: {
    flex: 1,
  },
});
