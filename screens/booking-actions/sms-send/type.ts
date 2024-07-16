import { I18nKeys } from '@translations/locales';

export enum LanguageType {
  'VI' = 'VI',
  'VI_WITHOUT_ACC' = 'VI_WITHOUT_ACC',
  'EN' = 'EN',
}

export type LanguageTypeDetail = {
  t18n: I18nKeys;
  key: LanguageType;
};

export const LanguageTypeDetails: Record<LanguageType, LanguageTypeDetail> = {
  [LanguageType.VI]: {
    key: LanguageType.VI,
    t18n: 'sms_send:vi',
  },
  [LanguageType.VI_WITHOUT_ACC]: {
    key: LanguageType.VI_WITHOUT_ACC,
    t18n: 'sms_send:vi_without_accent',
  },
  [LanguageType.EN]: {
    key: LanguageType.EN,
    t18n: 'sms_send:en',
  },
};

export type SMSSendForm = {
  languageType: LanguageType;
  content: string;
};
