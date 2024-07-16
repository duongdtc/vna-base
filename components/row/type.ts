import { IconTypes } from '@assets/icon';
import { TextInputShrinkProps } from '@vna-base/components/text-input/type';
import { Colors } from '@theme';
import { Spacing } from '@theme/type';
import { FontStyle } from '@theme/typography';
import { I18nKeys } from '@translations/locales';
import { SnapPoint } from '@utils';

export type RowProps =
  | (InputProps & CommonProps)
  | (Dropdown & CommonProps)
  | (Switch & CommonProps)
  | (Nav & CommonProps);
// | (Radio & CommonProps)
// | (DatePicker & CommonProps)
// | (CountryPicker & CommonProps);

export type CommonProps = {
  disable?: boolean;
  t18n: I18nKeys;
  fixedTitleFontStyle?: boolean;
  t18nAll?: I18nKeys;
  colorThemeValue?: keyof Colors;
  titleFontStyle?: FontStyle;
  numberOfLines?: number;
  colorTheme?: keyof Colors;
  paddingHorizontal?: Spacing;
  leftIcon?: IconTypes;
  leftIconSize?: number;
  leftIconColorTheme?: keyof Colors;
  rightIcon?: IconTypes;
  rightIconSize?: number;
  rightIconColorTheme?: keyof Colors;

  // onPress?: (val?: PathValue<F, N>) => void;
};

export type InputProps = {
  type?: 'input';
  ValueView?: (value: any) => string;
} & Omit<TextInputShrinkProps, 'onChange' | 'fontStyle'>;

export type Dropdown = {
  type?: 'dropdown';
  typeDetails: Record<any, any>;
  snapPoint?: [SnapPoint];
  t18nBottomSheet?: I18nKeys;
  value?: any;
  onChange: (value: any) => void;
  ValueView?: (value: any) => JSX.Element;
  /**
   * Bỏ option all
   */
  removeAll?: boolean;
};

export type Switch = {
  type?: 'switch';
  value: boolean;
  onChange?: (val: boolean) => void;
};

export type Nav = {
  type?: 'nav';
  onPress?: () => void;
};

// export type Radio = {
//   type?: 'radio';
//   revertValue?: boolean;
//   sizeDot?: number;
// };

// export type DatePicker = {
//   type?: 'date-picker' | 'date-time-picker';
//   minimumDate?: Date;
//   maximumDate?: Date;
//   t18nDatePicker?: I18nKeys;
//   ValueView?: (value: Date) => JSX.Element;
// };

// export type CountryPicker = {
//   type?: 'country-picker';
//   minimumDate?: Date;
//   maximumDate?: Date;
//   t18nDatePicker?: I18nKeys;
//   ValueView?: (value: Date) => string;
// };
