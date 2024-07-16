import { I18nKeys } from '@translations/locales';

export const arrFees: {
  key: number;
  t18n: I18nKeys;
  code: string;
}[] = [
  {
    key: 1,
    t18n: 'input_info_passenger:price_ticket',
    code: 'TICKET_FARE',
  },
  {
    key: 2,
    t18n: 'input_info_passenger:tax_fee',
    code: 'TICKET_TAX',
  },
  {
    key: 3,
    t18n: 'input_info_passenger:vat',
    code: 'TICKET_VAT',
  },
  {
    key: 4,
    t18n: 'input_info_passenger:service_fee',
    code: 'SERVICE_FEE',
  },
  {
    key: 5,
    t18n: 'flight:discount',
    code: 'DISCOUNT',
  },
  {
    key: 6,
    t18n: 'flight:custom_fee',
    code: 'CUSTOM_FEE',
  },
];
