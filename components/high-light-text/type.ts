import { Colors } from '@theme';
import { FontStyle } from '@theme/typography';
import { StyleProp, TextStyle } from 'react-native';

export type HighLightTextProps = {
  searchWords: string[];
  textToHighlight: string;
  fontStyle: FontStyle;
  highlightStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
  colorTheme?: keyof Colors;
  highlightColorTheme?: keyof Colors;
};
