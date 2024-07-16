import { Colors } from '@theme';

export interface HelperTextProps {
  /**
   * Text for text component
   */
  msg: string;

  /**
   * Overwrite color error with theme
   * @default undefined
   */
  colorTheme?: keyof Colors;
}
