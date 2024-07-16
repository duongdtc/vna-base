import { IconTypes } from '@assets/icon';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { FormContact } from './components/tab-contents/components/tab-contact/type';
import { FormNote } from './components/tab-contents/components/tab-note/type';
import { FormOrder } from './components/tab-contents/components/tab-order/type';
import { FormPaymentType } from './components/tab-contents/components/tab-payment/type';

export type FormOrderDetailType = {
  MonitorBy: string | null;
  OrderStatus: string | null;
  FormOrder: FormOrder | null;
  FormContact: FormContact | null;
  FormPaymentTab: FormPaymentType | null;
  FormNote: FormNote | null;
};

export type FormOrderBooking = {
  bookingCode?: string;
  statusOrderBooking?: string;
};

export const listOption: Array<OptionData> = [
  {
    t18n: 'order_detail:view_history',
    key: 'VIEW_HISTORY',
    icon: 'history_outline',
  },
  // {
  //   t18n: 'order:delete_order',
  //   key: 'DELETE_ORDER',
  //   icon: 'trash_2_fill',
  // },
];

export type StatusOrder = {
  t18n: I18nKeys;
  key: string;
  icon: IconTypes;
  iconTheme: keyof Colors;
};
