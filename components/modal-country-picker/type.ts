import { CountryCode } from '@services/realm/models';
import { I18nKeys } from '@vna-base/translations/locales';

export type ModalCountryPickerRef = {
  present: (selected?: CountryCode | undefined) => void;
};

export type ModalCountryPickerProps = {
  handleDone: (country: CountryCode | undefined) => void;
  showDialCode?: boolean;
  t18nTitle: I18nKeys;
  isCanReset?: boolean;
};
