import { Colors, FontStyle } from '@theme/type';
import { StyleProp, TextStyle } from 'react-native';

export type HighLightTextProps = {
  searchWords: string[];
  textToHighlight: string;
  fontStyle: FontStyle;
  highlightStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
  colorTheme?: Colors;
  highlightColorTheme?: Colors;
};
