import { IconTypes } from '@assets/icon';
import { BottomSheetTextInputProps as BottomSheetTextInputBaseProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import { Colors } from '@theme';

export type BottomSheetTextInputProps = BottomSheetTextInputBaseProps & {
  leftIcon?: IconTypes;
  leftIconSize?: number;
  colorTheme?: keyof Colors;
  placeholderColorTheme?: keyof Colors;
  color?: string;
};
