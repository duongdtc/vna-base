import { IconTypes } from '@assets/icon';
import { SortType } from '@services/axios';
import { Order } from '@services/axios/axios-data';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { OrderStatus } from '@vna-base/utils';

export type FilterName = keyof Pick<
  Order,
  | 'Index'
  | 'OrderStatus'
  | 'FlightBooking'
  // | 'FlightInfo'
  // | 'FlightSystem'
  | 'PaxName'
  // | 'PaxSumm'
  // | 'NetPrice'
  // | 'TotalPrice'
  // | 'Profit'
  // | 'PaidAmt'
  // | 'Currency'
  // | 'SubAgName'
  | 'AgentName'
  // | 'ContactName'
  | 'ContactPhone'
  // | 'ContactEmail'
  // | 'CreatedUser'
  | 'MonitorUser'
  // | 'PaymentMethod'
  // | 'PaymentStatus'
>;

export type OrderName = keyof Pick<Order, 'CreatedDate' | 'PaymentExpiry'>;

export type Filter = {
  Name: FilterName;
  Value: string;
  Contain: boolean;
};

export type FilterFormInBottomSheet = {
  // GetAll: boolean;
  // OrderBy: FilterAndOrderName;
  // SortType: SortType;
  Filter: Record<FilterName, string | null>;
};

export type FilterForm = {
  GetAll: boolean;
  OrderBy: OrderName;
  SortType: SortType;
  Filter: Array<Filter>;
  Range: {
    from: Date;
    to: Date;
  };
};

export type OrderStatusDetail = {
  t18n: I18nKeys;
  key: OrderStatus;
  icon: IconTypes;
  iconColorTheme: keyof Colors;
  colorTheme: keyof Colors;
};
