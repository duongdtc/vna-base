import { IconTypes } from '@assets/icon';
import { BottomSheetTextInputProps as BottomSheetTextInputBaseProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import { Colors } from '@theme/type';

export type BottomSheetTextInputProps = BottomSheetTextInputBaseProps & {
  leftIcon?: IconTypes;
  leftIconSize?: number;
  leftIconColorTheme?: Colors;
  colorTheme?: Colors;
  placeholderColorTheme?: Colors;
  color?: string;
};
