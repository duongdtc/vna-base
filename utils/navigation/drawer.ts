import { IconTypes } from '@assets/icon';
import { Action, StringSubject } from '@services/casl/type';
import { I18nKeys } from '@vna-base/translations/locales';
import { APP_SCREEN } from './screen-types';

export type DrawerModuleType = {
  icon: IconTypes;
  t18n: I18nKeys;
  path: APP_SCREEN | null;
  module?: StringSubject;
  action?: Action;
};

export const DrawerModules: Array<DrawerModuleType> = [
  {
    icon: 'navigation_2_fill',
    t18n: 'drawer_content:booking',
    path: APP_SCREEN.SEARCH_FLIGHT,
    module: 'flight',
    action: 'view',
  },
  {
    icon: 'file_text_fill',
    t18n: 'drawer_content:management_order',
    path: APP_SCREEN.ORDER,
    module: 'order',
    action: 'view',
  },
  {
    icon: 'pie_chart_fill',
    t18n: 'drawer_content:management_booking',
    path: APP_SCREEN.BOOKING,
    module: 'booking',
    action: 'view',
  },
  {
    icon: 'pricetag_fill',
    t18n: 'drawer_content:management_issue_ticket',
    path: APP_SCREEN.FLIGHT_TICKET,
    module: 'ticket',
    action: 'view',
  },
  // {
  //   icon: 'pie_chart_fill',
  //   t18n: 'drawer_content:revenue_report',
  //   path: APP_SCREEN.REPORT,
  //   module: 'SALES',
  //   action: 'VIEW',
  // },
  {
    icon: 'person_fill',
    t18n: 'drawer_content:account',
    path: APP_SCREEN.USER_ACCOUNT,
    module: 'useraccount',
    action: 'view',
  },
  {
    icon: 'people_fill',
    t18n: 'drawer_content:customer',
    path: APP_SCREEN.AGENTS,
    module: 'agent',
    action: 'view',
  },
  // {
  //   icon: 'cash_stack_fill',
  //   t18n: 'drawer_content:transaction_history',
  //   path: APP_SCREEN.TRANSACTION_HISTORY,
  //   module: 'Payment',
  //   action: 'VIEW',
  // },
  {
    icon: 'pantone_fill',
    t18n: 'drawer_content:service_fee',
    path: APP_SCREEN.POLICY,
    module: 'policy',
    action: 'view',
  },
  {
    icon: 'printer_fill',
    t18n: 'drawer_content:ticket_face',
    path: APP_SCREEN.CONFIG_TICKET,
    module: 'configticket',
    action: 'view',
  },
  {
    icon: 'email_fill',
    t18n: 'drawer_content:email',
    path: APP_SCREEN.CONFIG_EMAIL,
    module: 'configemail',
    action: 'view',
  },
];
