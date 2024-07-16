import { IconTypes } from '@assets/icon';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';

export type ItemCustom = {
  t18n: I18nKeys;
  key: string | null;
  icon?: IconTypes;
  iconColorTheme?: keyof Colors;
  description?: string | null;
};

export type ModalCustomPickerRef = {
  present: (key: string | null) => void;
};

export type ModalCustomPickerProps = {
  handleDone: (key: string | null) => void;
  t18nTitle: I18nKeys;
  snapPoints?: (string | number)[] | undefined;
  data: Array<ItemCustom>;
  hasDescription?: boolean;
  showCloseButton?: boolean;
  showIndicator?: boolean;
};
