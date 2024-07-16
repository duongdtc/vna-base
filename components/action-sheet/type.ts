import { IconTypes } from '@assets/icon';
import { Colors } from '@theme';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { I18nKeys } from '@translations/locales';

export interface OptionData<T = string> {
  /**
   * (Required) Text to display
   */
  t18n?: I18nKeys | string;

  subtitle?: string;

  key: T;

  icon?: IconTypes;

  iconTheme?: keyof Colors;

  /**
   * Param pass to the call back function
   */
  itemCallback?: any;
}

export interface ActionSheetProps {
  /**
   * List option
   */
  option?: OptionData[];

  /**
   * key of selected option
   */
  selectedKey?: string;

  /**
   * Function call back when click option
   * @default undefined
   */
  onPressOption?: (item: OptionData, index: number) => void;

  typeBackDrop?: 'blur' | 'shadow' | 'gray';

  type: 'menu' | 'select';

  t18nTitle?: I18nKeys;
}
