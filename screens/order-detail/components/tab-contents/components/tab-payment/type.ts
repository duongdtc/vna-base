import { ItemCustom } from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { I18nKeys } from '@translations/locales';

export type FormPaymentType = {
  PaymentStatus?: string;
  PaymentExpiry?: Date | null;
  PaidAmt?: string;
  PaidCur?: string | null;
  PaymentMethod?: string | null;
  PaymentGateway?: string | null;
  PaymentDate?: Date | null;
};

export const listCurrency: Array<ItemCustom> = [
  {
    key: 'VND',
    t18n: 'VND' as I18nKeys,
  },
  {
    key: 'USD',
    t18n: 'USD' as I18nKeys,
  },
  {
    key: 'JPY',
    t18n: 'JPY' as I18nKeys,
  },
  {
    key: 'EUR',
    t18n: 'EUR' as I18nKeys,
  },
];
