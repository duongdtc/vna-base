import { ItemCustom } from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { Charge } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';

export type ModalFeeRef = {
  show: (content?: Charge) => void;
};

export type ModalFeeType = {
  Id: number;
  OrderId: string;
  StartPoint: string | null;
  EndPoint: string | null;
  ChargeType: string | null;
  PassengerId: string | null;
  PaxName: string | null;
  Route: string | null;
  ChargeValue: string;
  Remark: string;
  Amount: number;
  Currency: string | null;
  BookingId: string | null;
};

export const listChargeType: Array<ItemCustom> = [
  // {
  //   key: null,
  //   t18n: 'order_detail:type_costs',
  // },
  {
    key: 'SERVICE_FEE',
    t18n: 'input_info_passenger:service_fee',
    description: 'SERVICE_FEE',
  },
  {
    key: 'DISCOUNT',
    t18n: 'order_detail:discount',
    description: 'DISCOUNT',
  },
];

export const listOptionPassengers: Array<ItemCustom> = [
  {
    key: null,
    t18n: 'order_detail:all',
    description: 'ALL',
  },
  {
    key: 'ALL',
    t18n: 'order_detail:apply_per_passenger',
    description: 'PAX',
  },
];

export const listOptionRoutes: Array<ItemCustom> = [
  {
    key: null,
    t18n: 'order_detail:all',
  },
];

export const listCurrencies: Array<ItemCustom> = [
  {
    key: 'VND',
    t18n: 'VND' as I18nKeys,
  },
  {
    key: 'USD',
    t18n: 'USD' as I18nKeys,
  },
];
