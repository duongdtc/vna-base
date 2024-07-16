import { IconTypes } from '@assets/icon';

import { Colors, FontStyle, Spacing } from '@theme/type';

import { I18nKeys } from '@translations/locales';
import {
  FlexAlignType,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface StylesTextI {
  [key: string]: FontStyle;
}

export const stylesText: StylesTextI = {
  large: 'Body16Bold',
  medium: 'Body14Bold',
  small: 'Body12Bold',
};

export interface ButtonProps extends TouchableOpacityProps {
  margin?: Spacing;

  marginLeft?: Spacing;

  marginRight?: Spacing;

  marginTop?: Spacing;

  marginBottom?: Spacing;

  marginHorizontal?: Spacing;

  marginVertical?: Spacing;

  padding?: Spacing;

  paddingHorizontal?: Spacing;

  paddingVertical?: Spacing;

  /**
   * Using align self
   * @default undefined
   */
  alignSelf?: 'auto' | FlexAlignType;

  /**
   * Preset for button
   * @default common
   */
  type?: 'common' | 'outline' | 'lowSat' | 'classic';

  /**
   * Size of button
   * @default large
   */
  size?: 'large' | 'medium' | 'small';

  fullWidth?: boolean;

  /**
   * Text which is looked up via i18n.
   * @default undefined
   */
  t18n?: I18nKeys;

  /**
   * Using text instead i18n
   * @default undefined
   */
  text?: string;

  /**
   * Overwrite style for button
   * khi button có icon mà icon đó có padding left hoặc right khác với 12 16 20,
   * hoặc khi padding Vertical khác 8 13 thì custom style
   * @default undefined
   */
  buttonStyle?: StyleProp<ViewStyle>;

  style?: StyleProp<ViewStyle>;

  /**
   * Overwrite style for text
   * @default undefined
   */
  textStyle?: StyleProp<TextStyle>;

  textFontStyle?: FontStyle;

  /**
   * Overwrite background color with theme for text
   */
  textColorTheme?: Colors;

  /**
   * Overwrite button background with theme
   * @default undefined
   */
  buttonColorTheme?: Colors;

  leftIcon?: IconTypes;

  leftIconSize?: number;

  rightIcon?: IconTypes;

  rightIconSize?: number;

  scale?: boolean;

  columnGap?: Spacing;

  shadow?: boolean;

  numberOfLines?: number;

  ellipsizeMode?: 'middle' | 'head' | 'tail' | 'clip';

  isLoading?: boolean;

  activityIndicatorColorTheme?: Colors;
}
