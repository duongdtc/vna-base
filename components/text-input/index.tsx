import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutRectangle,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { useTheme } from '@theme';
import { delay, execFunc, HairlineWidth, scale } from '@vna-base/utils';

import { Block } from '@vna-base/components/block';
import { HelperText } from '@vna-base/components/helper-text';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import isEmpty from 'lodash.isempty';
import isEqual from 'react-fast-compare';
import { Label, LabelRef } from './label';
import { useStyles } from './styles';
import { TextInputProps } from './type';

export * from './text-input-auto-height';
export * from './text-input-left-icon';
export * from './text-input-shrink';

export const TextInput = memo(
  forwardRef<RNTextInput, TextInputProps>(
    (
      {
        label,
        rxFormat,
        labelI18n,
        multiline,
        placeholder,
        nameTrigger,
        left,
        right,
        placeholderI18n,
        placeholderTextColor,
        placeholderTextColorTheme = 'neutral600',
        onBlur,
        trigger,
        onFocus,
        onChangeText,
        enableHelperText = false,
        borderColorTheme = 'neutral300',
        helperTextColorTheme = 'neutral600',
        helperTextI18n,
        helperText = '',
        disable,
        type = 'normal',
        present = 'normal',
        size = 'large',
        required,
        toggleDefault,
        styleInput: inputStyle,
        useBottomSheetTextInput = false,
        ...rest
      },
      ref,
    ) => {
      // state
      const [t] = useTranslation();
      const styles = useStyles();
      const { colors } = useTheme();
      const labelRef = useRef<LabelRef>(null);
      const [inputLayout, setInputLayout] = useState<LayoutRectangle>({
        height: 0,
        width: 0,
        x: 0,
        y: 0,
      });

      const focusedValue = useSharedValue(false);

      const _disabled = useDerivedValue(() => disable === true, [disable]);

      const editable = useMemo(() => type !== 'filled', [type]);

      useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;

        if (toggleDefault) {
          timeoutId = setTimeout(() => {
            labelRef.current?.focus();
          }, 160);
        }

        return () => {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }
        };
      }, [toggleDefault]);

      const checkInitToggle = useCallback(async (val: string | undefined) => {
        if (!labelRef.current?.isFocused.current && !isEmpty(val)) {
          await delay(100);

          labelRef.current?.focus();
        }
      }, []);

      useEffect(() => {
        checkInitToggle(rest.value);
      }, [rest.value]);

      useEffect(() => {
        checkInitToggle(rest.defaultValue);
      }, [rest.defaultValue]);

      // func
      const handleTextChange = (text: string) => {
        const actualText =
          rxFormat !== undefined ? text.replace(rxFormat, '') : text;

        execFunc(onChangeText, actualText);

        if (nameTrigger) {
          execFunc(trigger, nameTrigger);
        }
      };

      const handleFocus = (
        e: NativeSyntheticEvent<TextInputFocusEventData>,
      ) => {
        focusedValue.value = true;
        labelRef.current?.focus();
        execFunc(onFocus, e);
      };

      const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusedValue.value = false;
        // labelRef.current?.blur(e.nativeEvent.text);
        execFunc(onBlur, e);
      };

      const onEndEditing = (
        e: NativeSyntheticEvent<TextInputEndEditingEventData>,
      ) => {
        labelRef.current?.blur(e.nativeEvent.text);
      };

      const _borderColor = useDerivedValue(() => {
        switch (true) {
          case focusedValue.value:
            return colors.primary500;

          case _disabled.value:
            return colors.neutral300;

          case present === 'error':
            return colors.error500;

          case present === 'warning':
            return colors.warning500;

          case present === 'success':
            return colors.success500;

          default:
            return colors[borderColorTheme];
        }
      }, [colors, borderColorTheme, present]);

      const _borderWidth = useDerivedValue(() => {
        let coefficient = 3;
        switch (true) {
          case focusedValue.value ||
            present === 'error' ||
            present === 'warning' ||
            present === 'success':
            coefficient = 6;
            break;

          default:
            coefficient = 3;
            break;
        }

        return coefficient * HairlineWidth;
      }, [colors, borderColorTheme, present]);

      const _helperTextColorTheme = useMemo(() => {
        if (disable) {
          return 'neutral600';
        }

        switch (present) {
          case 'error':
            return 'error500';
          case 'success':
            return 'success500';
          case 'warning':
            return 'warning500';

          default:
            return helperTextColorTheme;
        }
      }, [disable, helperTextColorTheme, present]);

      const containerRestyle = useAnimatedStyle(
        () => ({
          borderColor: _borderColor.value,
          borderWidth: _borderWidth.value,
        }),
        [],
      );

      const inputStyles = useMemo(
        () => [
          styles.input,
          size === 'large' ? styles.largeInput : styles.smallInput,
          multiline && styles.multiline,
          !!left && size === 'large' && styles.paddingLeft8,
          !!right && size === 'large' && styles.paddingRight8,
          !!left && size === 'small' && styles.paddingLeft4,
          !!right && size === 'small' && styles.paddingRight4,
          inputStyle,
        ],
        [
          inputStyle,
          left,
          multiline,
          right,
          size,
          styles.input,
          styles.largeInput,
          styles.multiline,
          styles.paddingLeft4,
          styles.paddingLeft8,
          styles.paddingRight4,
          styles.paddingRight8,
          styles.smallInput,
        ],
      );

      const containerStyles = useMemo(
        () => [
          styles.containerInput,
          disable && { opacity: 0.4 },
          !editable && styles.filled,
          size === 'large'
            ? styles.containerInputLarge
            : styles.containerInputSmall,
        ],
        [
          disable,
          editable,
          size,
          styles.containerInput,
          styles.containerInputLarge,
          styles.containerInputSmall,
          styles.filled,
        ],
      );

      const borderStyles = useMemo(
        () => [
          styles.border,
          containerRestyle,
          size === 'large'
            ? styles.containerInputLarge
            : styles.containerInputSmall,
        ],
        [
          containerRestyle,
          size,
          styles.border,
          styles.containerInputLarge,
          styles.containerInputSmall,
        ],
      );

      // render
      return (
        <Block pointerEvents={disable ? 'none' : undefined}>
          <Animated.View style={containerStyles}>
            <Animated.View style={borderStyles} />
            {left}
            <Block
              flex={1}
              onLayout={({ nativeEvent }) => {
                setInputLayout(nativeEvent.layout);
              }}
              style={{ justifyContent: 'center' }}>
              {(!!label || !!labelI18n) && editable && (
                <Label
                  label={label}
                  labelI18n={labelI18n}
                  ref={labelRef}
                  layout={inputLayout}
                  required={required}
                  ml={left ? scale(4) : scale(0)}
                />
              )}
              {useBottomSheetTextInput ? (
                <BottomSheetTextInput
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  ref={ref}
                  {...rest}
                  editable={!disable && editable}
                  autoCorrect={false}
                  clearButtonMode={'never'}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor={
                    editable === false
                      ? colors.border
                      : placeholderTextColor ||
                        (placeholderTextColorTheme &&
                          colors[placeholderTextColorTheme])
                  }
                  placeholder={
                    placeholder || (placeholderI18n && t(placeholderI18n))
                  }
                  selectionColor={colors.primary800}
                  style={inputStyles}
                  multiline={multiline}
                  onChangeText={handleTextChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onEndEditing={onEndEditing}
                />
              ) : (
                <RNTextInput
                  ref={ref}
                  {...rest}
                  editable={!disable && editable}
                  autoCorrect={false}
                  clearButtonMode={'never'}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor={
                    editable === false
                      ? colors.border
                      : placeholderTextColor ||
                        (placeholderTextColorTheme &&
                          colors[placeholderTextColorTheme])
                  }
                  placeholder={
                    placeholder || (placeholderI18n && t(placeholderI18n))
                  }
                  selectionColor={colors.primary800}
                  style={inputStyles}
                  multiline={multiline}
                  onChangeText={handleTextChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onEndEditing={onEndEditing}
                />
              )}
            </Block>
            {right}
          </Animated.View>
          {enableHelperText && (
            <Block style={{ marginTop: 2 }} marginHorizontal={4}>
              <HelperText
                msg={helperTextI18n ? t(helperTextI18n) : helperText}
                colorTheme={_helperTextColorTheme}
              />
            </Block>
          )}
        </Block>
      );
    },
  ),
  isEqual,
);
