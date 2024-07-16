import { BlockProps } from '@vna-base/components/block/type';
import { Colors } from '@theme';

export type LazyPlaceholderProps = BlockProps & {
  colorTheme?: keyof Colors;
  backgroundColorTheme?: keyof Colors;
  size?: number | 'small' | 'large';
};
