import { I18nKeys } from '@translations/locales';

export type ModalUserAccountPickerRef = {
  present: (selectedId?: string | null) => void;
};

export type ModalUserAccountPickerProps = {
  handleDone: (Id: string | null) => void;
  t18nTitle: I18nKeys;
};
