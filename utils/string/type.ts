import { I18nKeys } from '@vna-base/translations/locales';

export type ValidateMessageObject = {
  keyT: I18nKeys;
  optionsTx?: Record<string, I18nKeys>;
  options?: Record<string, string | number>;
};
