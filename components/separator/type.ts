import { BlockProps } from '@components/block/type';
import { Spacing } from '@theme/type';

export type SeparatorProps = {
  type: 'horizontal' | 'vertical';
  height?: Spacing;
  width?: Spacing;
  /**
   * StyleSheet.hairLineWidth * size
   * default 2
   */
  size?: 1 | 2 | 3 | 4;

  /**
   *
   * @default false
   */
  usePercent?: boolean;
} & Omit<BlockProps, 'height' | 'width'>;
