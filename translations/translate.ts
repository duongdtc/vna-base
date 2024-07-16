import I18n from './i18n';
import { I18nKeys } from '@translations/locales';

export function translate(
  key: I18nKeys | undefined,
  option?: Record<string, unknown>,
) {
  return key ? I18n.t(key, option) : '';
}
