/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  ColorValue,
  LayoutRectangle,
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
} from 'react-native';

import { UseFormTrigger } from 'react-hook-form';
import Animated from 'react-native-reanimated';

import { Colors } from '@theme';
import { I18nKeys } from '@vna-base/translations/locales';
import { IconTypes } from '@assets/icon';
import { FontStyle } from '@theme/typography';

export type ErrorLineProps = {
  error: Animated.SharedValue<boolean>;
  disabled: Animated.SharedValue<boolean>;
};

export type FocusedLineProps = {
  focused: Animated.SharedValue<boolean>;
  disabled: Animated.SharedValue<boolean>;
};

export type PresentType = 'normal' | 'success' | 'warning' | 'error';

export type TextInputProps = RNTextInputProps & {
  /**
   * Format text before call onChangeText function
   * @default undefined
   */
  rxFormat?: RegExp;

  /**
   * Trigger name field of react hook form
   * @default undefined
   */
  nameTrigger?: string;

  /**
   * Call trigger react hook form
   * @default undefined
   */
  trigger?: UseFormTrigger<any>;

  /**
   * Translate placeholder by I18n
   * @default undefined
   */
  placeholderI18n?: I18nKeys;

  /**
   * Fill placeholder color by Theme
   * @default undefined
   */
  placeholderTextColorTheme?: keyof Colors;

  /**
   * Children right input.(ex:Icon show/hide password)
   */
  right?: React.ReactNode;
  /**
   * Children left input.(ex:Icon show/hide password)
   */
  left?: React.ReactNode;

  enableHelperText?: boolean;

  helperTextI18n?: I18nKeys;

  helperText?: string;

  borderColorTheme?: Colors;

  helperTextColorTheme?: Colors;

  disable?: boolean;

  type?: 'normal' | 'filled';

  present?: PresentType;

  size?: 'large' | 'small';

  toggleDefault?: boolean;

  styleInput?: StyleProp<TextStyle>;

  /**
   * @default false
   */
  useBottomSheetTextInput?: boolean;
} & Omit<LabelProps, 'position' | 'layout' | 'ml'>;

export type LabelProps = {
  /**
   * Label of text input
   */
  label?: string;

  /**
   * Translate label by I18n
   * @default undefined
   */
  labelI18n?: I18nKeys;

  layout: LayoutRectangle;

  ml: number;

  required?: boolean;
};

export type TextInputShrinkProps = TextInputProps & {
  leftIcon?: IconTypes;
  rightIcon?: IconTypes;
  leftIconSize?: number;
  rightIconSize?: number;
  leftIconColorTheme?: keyof Colors;
  rightIconColorTheme?: keyof Colors;
  leftIconStyle?: StyleProp<TextStyle>;
  rightIconStyle?: StyleProp<TextStyle>;
  fontStyle: keyof typeof FontStyle;
  placeholderTextColor?: ColorValue | undefined;
  useBottomSheetInput?: boolean;
};

export type TextInputAutoHeightProps = TextInputProps & {
  fontStyle?: keyof typeof FontStyle;
  placeholderTextColor?: ColorValue | undefined;
  useBottomSheetInput?: boolean;
};
