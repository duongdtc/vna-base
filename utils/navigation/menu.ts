import { IconTypes } from '@assets/icon';
import { Action, StringSubject } from '@services/casl/type';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN } from './screen-types';

export type MenuModuleType = {
  icon: IconTypes;
  t18n: I18nKeys;
  path: APP_SCREEN | null;
  module?: StringSubject;
  action?: Action;
};

export const MenuModules: Array<MenuModuleType> = [
  {
    icon: 'archive_fill',
    t18n: 'menu:booking',
    path: APP_SCREEN.SEARCH_FLIGHT,
    module: 'flight',
    action: 'view',
  },
  {
    icon: 'npm_fill',
    t18n: 'menu:booking_seri',
    path: APP_SCREEN.ORDER,
    module: 'order',
    action: 'view',
  },
  {
    icon: 'shopping_bag_fill',
    t18n: 'menu:booking_adhoc',
    path: APP_SCREEN.FLIGHT_TICKET,
    module: 'ticket',
    action: 'view',
  },
  {
    icon: 'pricetag_fill',
    t18n: 'menu:ticketed',
    path: APP_SCREEN.REPORT,
    module: 'reportticket',
    action: 'view',
  },
  {
    icon: 'person_fill',
    t18n: 'menu:account_list',
    path: APP_SCREEN.USER_ACCOUNT,
    module: 'useraccount',
    action: 'view',
  },
  {
    icon: 'pantone_fill',
    t18n: 'menu:account_group',
    path: APP_SCREEN.USER_ACCOUNT,
    module: 'useraccount',
    action: 'view',
  },
  {
    icon: 'keypad_fill',
    t18n: 'menu:permissions',
    path: APP_SCREEN.AGENTS,
    module: 'agent',
    action: 'view',
  },
  {
    icon: 'people_fill',
    t18n: 'menu:customer',
    path: APP_SCREEN.PAYMENT_HISTORY,
  },
  {
    icon: 'cash_stack_fill',
    t18n: 'menu:transaction_history',
    path: APP_SCREEN.POLICY,
    module: 'policy',
    action: 'view',
  },
  {
    icon: 'layout_fill',
    t18n: 'menu:agent',
    path: APP_SCREEN.CONFIG_TICKET,
    module: 'configticket',
    action: 'view',
  },
  {
    icon: 'layers_fill',
    t18n: 'menu:sub_agent',
    path: APP_SCREEN.CONFIG_EMAIL,
    module: 'configemail',
    action: 'view',
  },
  {
    icon: 'map_fill',
    t18n: 'menu:ca',
    path: APP_SCREEN.CONFIG_EMAIL,
    module: 'configemail',
    action: 'view',
  },
  {
    icon: 'monitor_fill',
    t18n: 'menu:agent_user',
    path: APP_SCREEN.CONFIG_EMAIL,
    module: 'configemail',
    action: 'view',
  },
];
