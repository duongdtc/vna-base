import { IconTypes } from '@assets/icon';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN } from '@utils';

export enum FeatureType {
  NAV,
  LANGUAGE,
  THEME,
}

export type Feature = {
  t18n: I18nKeys;
  icon: IconTypes;
  path?: APP_SCREEN;
  type: FeatureType;
  iconColorTheme: keyof Colors;
  /**
   * tên của action mà item sẽ thực hiện
   */
  actionName?: string;
};
