import { initReactI18next } from 'react-i18next';

import { DEFAULT_FALLBACK_LNG_I18n } from '@env';
import i18n, { LanguageDetectorAsyncModule, Resource } from 'i18next';

import { appActions } from '@redux-slice';
import { dispatch } from '@vna-base/utils';
import { load, save } from '@vna-base/utils/storage';
import { StorageKey } from '@vna-base/utils/storage/constants';
import { resources } from '@translations/locales';
import { Language } from '@translations/type';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  // flags below detection to be async
  async: true,
  detect: (callback: (lng: string | readonly string[] | undefined) => void) => {
    const savedLanguage = load(StorageKey.LANGUAGE);
    callback(savedLanguage ?? DEFAULT_FALLBACK_LNG_I18n);
  },
  init: () => {
    // console.log('init I18n');
  },
  cacheUserLanguage: lng => {
    save(StorageKey.LANGUAGE, lng);
    // console.log('cacheUserLanguage I18n', lng);
  },
};

export const initOptionsI18n = (source: Resource) => {
  return {
    fallbackLng: DEFAULT_FALLBACK_LNG_I18n,

    resources: source,

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug: false,

    cache: {
      enabled: true,
    },

    interpolation: {
      // not needed for react as it does escape per default to prevent xss!
      escapeValue: false,
    },
  };
};

/**
 * Config i18n for app
 */
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init(initOptionsI18n(resources));

i18n.on('languageChanged', lng => {
  dispatch(appActions.saveLanguage(lng as Language));
});

export default i18n;
