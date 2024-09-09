import { images } from '@assets/image';
import { I18nKeys } from '@translations/locales';

export enum Bank {
  BIDV,
  VietinBank,
  OCB,
}
export type BankTypeDetail = {
  key: Bank;
  t18n: I18nKeys;
  logo: string;
};

export const bankAccountsOfParent: Record<Bank, BankTypeDetail> = {
  [Bank.BIDV]: {
    key: Bank.BIDV,
    t18n: 'Ngân hàng BIDV' as I18nKeys,
    logo: images.bidv_logo,
  },
  [Bank.VietinBank]: {
    key: Bank.VietinBank,
    t18n: 'Ngân hàng VietinBank' as I18nKeys,
    logo: images.vietinbank_logo,
  },
  [Bank.OCB]: {
    key: Bank.OCB,
    t18n: 'Ngân hàng OCB' as I18nKeys,
    logo: images.ocbbank_logo,
  },
};

export type TopupForm = {
  amount: string;
  bankId: Bank;
};
