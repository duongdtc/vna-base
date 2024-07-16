import { Colors } from '@theme';

export type BarChartProps = {
  onPressBar: (idx: number) => void;
  data: Array<{ value: number; DD: string; dd: string }>;
};

export type BarProps = {
  value: number;
  DD: string;
  dd: string;
  index: number;
  onPress: (index: number) => void;
  colorTheme: keyof Colors;
  height: number;
};
