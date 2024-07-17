import { Shadows } from '@theme';
import { Colors } from '@theme/type';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type NormalHeaderType = ViewProps & {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  leftContentStyle?: StyleProp<ViewStyle>;
  zIndex?: number;
  colorTheme?: Colors;
  shadow?: Shadows;
};
