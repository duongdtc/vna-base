import { TextInputShrinkProps } from '@components/text-input/type';
import { Colors } from '@theme';
import { FontStyle, Spacing } from '@theme/type';
import { I18nKeys } from '@translations/locales';
import { SnapPoint } from '@utils';
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  Validate,
  ValidationRule,
} from 'react-hook-form';

export type RowItemControllerFormProps<
  F extends FieldValues = FieldValues,
  N extends FieldPath<F> = FieldPath<F>,
> =
  | (InputProps & CommonProps<F, N>)
  | (HTMLProps & CommonProps<F, N>)
  | (Dropdown & CommonProps<F, N>)
  | (Switch & CommonProps<F, N>)
  | (Radio & CommonProps<F, N>)
  | (DatePicker & CommonProps<F, N>)
  | (CountryPicker & CommonProps<F, N>)
  | (ColorPicker & CommonProps<F, N>);

export type CommonProps<
  F extends FieldValues = FieldValues,
  N extends FieldPath<F> = FieldPath<F>,
> = Pick<ControllerProps<F, N>, 'control' | 'name'> & {
  disable?: boolean;
  t18n: I18nKeys;
  isRequire?: boolean;

  /**
   * Hiện dấu sao require nhưng không bắt buộc truyền giá trị.
   * Cái này dùng khi truyền validate
   */
  showStar?: boolean;
  hideBottomSheet?: () => void;
  fixedTitleFontStyle?: boolean;
  t18nAll?: I18nKeys;
  colorThemeValue?: Colors;
  titleFontStyle?: FontStyle;
  numberOfLines?: number;
  colorTheme?: Colors;
  paddingHorizontal?: Spacing;
  opacity?: number;
  showRightIcon?: boolean;
  // onPress?: (val?: PathValue<F, N>) => void;
};

export type InputProps = {
  type?: 'input';
  pattern?: ValidationRule<RegExp> | undefined;
  validate?: Validate<any, any>;
  ValueView?: (value: any) => string;
  processValue?: (value: string) => string;
} & Omit<
  TextInputShrinkProps,
  'onChange' | 'value' | 'onChangeText' | 'fontStyle'
>;

export type HTMLProps = Omit<InputProps, 'type'> & {
  type?: 'html';
  sharedTransitionTag: string;
  t18nModal?: I18nKeys;
};

export type Dropdown = {
  type?: 'dropdown';
  typeDetails: Record<any, any>;
  snapPoint?: [SnapPoint];
  t18nBottomSheet?: I18nKeys;
  ValueView?: (value: any, isValid: boolean) => JSX.Element;
  /**
   * Bỏ option all
   */
  removeAll?: boolean;

  onChangeValue?: (value: any) => void;
};

export type Switch = {
  type?: 'switch';
};

export type Radio = {
  type?: 'radio';
  revertValue?: boolean;
  sizeDot?: number;
};

export type DatePicker = {
  type?: 'date-picker' | 'date-time-picker';
  minimumDate?: Date;
  maximumDate?: Date;
  t18nDatePicker?: I18nKeys;
  ValueView?: (value: Date) => JSX.Element;
};

export type CountryPicker = {
  type?: 'country-picker';
  minimumDate?: Date;
  maximumDate?: Date;
  t18nDatePicker?: I18nKeys;
  ValueView?: (value: Date) => string;
};

export type ColorPicker = {
  type?: 'color-picker';
};
