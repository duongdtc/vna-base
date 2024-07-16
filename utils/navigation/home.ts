import { IconTypes } from '@assets/icon';
import { I18nKeys } from '@vna-base/translations/locales';
import { APP_SCREEN } from './screen-types';
import { Colors } from '@theme';

export type UtilitiesType = {
  icon: IconTypes;
  iconColorTheme: keyof Colors;
  t18n: I18nKeys;
  path: APP_SCREEN | null;
  colorTheme: keyof Colors;
};

export const Utilities: Array<UtilitiesType> = [
  {
    icon: 'browser_fill',
    iconColorTheme: 'info600',
    t18n: 'home:research_booking',
    path: null,
    colorTheme: 'info50',
  },
  {
    icon: 'pantone_fill',
    iconColorTheme: 'info600',
    t18n: 'home:setting_service_fee',
    path: APP_SCREEN.POLICY,
    colorTheme: 'info50',
  },
  {
    icon: 'people_fill',
    iconColorTheme: 'info600',
    t18n: 'home:customer',
    path: APP_SCREEN.AGENTS,
    colorTheme: 'info50',
  },
  {
    icon: 'price_tag_fill',
    iconColorTheme: 'info600',
    t18n: 'home:issue_ticket',
    path: APP_SCREEN.FLIGHT_TICKET,
    colorTheme: 'info50',
  },
  // {
  //   icon: 'person_fill',
  //   iconColorTheme: 'primary500',
  //   t18n: 'home:account',
  //   path: APP_SCREEN.USER_ACCOUNT,
  //   colorTheme: 'info50',
  // },
];
