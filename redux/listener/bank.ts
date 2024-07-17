/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { bankActions } from '@redux-slice';
import { Account } from '@redux/type';
import { Data } from '@services/axios';
import { I18nKeys } from '@translations/locales';
import { convertStringToNumber, TopupMethod, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import ReactNativeBlobUtil from 'react-native-blob-util';

takeLatestListeners(true)({
  actionCreator: bankActions.getQRCode,
  effect: async (action, listenerApi) => {
    const { form, cb } = action.payload;

    const { accountsOfParent } = listenerApi.getState().bank;

    const bank = accountsOfParent[form.bankId];

    // gent random 10 số để dùng mqtt
    const randomCode = Math.random().toString().substring(2, 12);

    const res = await Data.bankingBankingGenQrCreate({
      Item: {
        Amount: convertStringToNumber(form.amount).toString(),
        ServiceId: bank.Code,
        BankBrand: bank.BankBrand,
        Code: randomCode,
      },
    });

    if (!res.data.Item?.Base64Image) {
      throw Error('không lấy được QR code');
    }

    const filePath =
      ReactNativeBlobUtil.fs.dirs.CacheDir +
      `/QR_${dayjs().format('YYYYMMDD_HHmm')}.png`;

    await ReactNativeBlobUtil.fs.writeFile(
      filePath,
      res.data.Item?.Base64Image,
      'base64',
    );

    listenerApi.dispatch(
      bankActions.saveQR({
        path: filePath ?? '',
        bank: form.bankId,
        amount: convertStringToNumber(form.amount),
        randomCode,
      }),
    );

    cb(!!filePath);
  },
});

takeLatestListeners()({
  actionCreator: bankActions.getAllBankAccounts,
  effect: async (_, listenerApi) => {
    const res = await Data.accountAccountGetAllCreate({});

    if (validResponse(res)) {
      const obj: Record<string, Account> = {};

      res.data.List?.forEach(account => {
        obj[account.Id as string] = {
          ...account,
          description: account.Description ?? account.Name ?? '',
          key: account.Id!,
          t18n: account.AccountName as I18nKeys,
        };
      });

      listenerApi.dispatch(bankActions.saveAllAccount(obj));
    }
  },
});

takeLatestListeners()({
  actionCreator: bankActions.getBankAccountsOfParent,
  effect: async (_, listenerApi) => {
    const res = await Data.accountAccountGetListByParentIdCreate({
      PageSize: 1000,
      Filter: [{ Contain: true, Name: 'Type', Value: TopupMethod.BANK }],
    });

    if (validResponse(res)) {
      const obj: Record<string, Account> = {};

      res.data.List?.forEach(account => {
        obj[account.Id as string] = {
          ...account,
          description: account.Description ?? account.Name ?? '',
          key: account.Id!,
          t18n: account.AccountName as I18nKeys,
        };
      });

      listenerApi.dispatch(bankActions.saveAccountsOfParent(obj));
    }
  },
});
