import { I18nKeys } from '@translations/locales';

export type Item = {
  t18n: I18nKeys;
  key: string | null;
  image?: string;
  description?: string | null;
  price: number;
  capacity: number;
};

export type ModalPickerRef = {
  present: (key: string | null) => void;
};

export type ModalPickerProps = {
  handleDone: (key: string | null) => void;
  t18nTitle: I18nKeys;
  snapPoints?: (string | number)[] | undefined;
  data: Array<Item>;
  hasDescription?: boolean;
  showCloseButton?: boolean;
  showIndicator?: boolean;
};
