/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { bankActions } from '@vna-base/redux/action-slice';
import { Account } from '@redux/type';
import { Data } from '@services/axios';
import { I18nKeys } from '@translations/locales';
import {
  convertStringToNumber,
  TopupMethod,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import ReactNativeBlobUtil from 'react-native-blob-util';

export const runBankListener = () => {
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
      // const res = await Data.accountAccountGetAllCreate({});
      const res = {
        data: {
          List: [
            {
              Id: '7044E5D5-C28B-4DF3-A2EA-B9839BE56237',
              Index: 8,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              Code: '32452452563245',
              Type: 'CASH',
              Name: 'DSGS',
              Description: null,
              AccountName: null,
              AccountNumb: null,
              BankBrand: null,
              BankBranch: null,
              Image: null,
              ServiceId: null,
              PrefixCode: null,
              AutoBank: false,
              Visible: true,
              EntryItems: [],
              Transactions: [],
            },
            {
              Id: '95373D95-2086-4E5C-8E0A-7FE3CA5084F4',
              Index: 1006,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              Code: '5345345345345',
              Type: 'BANK',
              Name: 'techcombank',
              Description: null,
              AccountName: 'Công ty Hồng Ngọc Hà',
              AccountNumb: '5345345345345',
              BankBrand: 'techcombank',
              BankBranch: 'láng hạ',
              Image: null,
              ServiceId: null,
              PrefixCode: null,
              AutoBank: false,
              Visible: true,
              EntryItems: [],
              Transactions: [],
            },
          ],
          TotalItem: 0,
          TotalPage: 0,
          PageIndex: 0,
          PageSize: 0,
          HasPreviousPage: false,
          HasNextPage: false,
          OrderBy: null,
          SortType: null,
          GetAll: false,
          Filter: null,
          StatusCode: '000',
          Success: true,
          Expired: false,
          Message: null,
          Language: 'vi',
          CustomProperties: null,
        },
      };

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
      // const res = await Data.accountAccountGetListByParentIdCreate({
      //   PageSize: 1000,
      //   Filter: [{ Contain: true, Name: 'Type', Value: TopupMethod.BANK }],
      // });

      const res = {
        data: {
          List: [],
          TotalItem: 0,
          TotalPage: 0,
          PageIndex: 1,
          PageSize: 1000,
          HasPreviousPage: true,
          HasNextPage: false,
          OrderBy: 'Index',
          SortType: 'desc',
          GetAll: false,
          Filter: [{ Name: 'Type', Value: 'BANK', Contain: true }],
          StatusCode: '000',
          Success: true,
          Expired: false,
          Message: null,
          Language: 'vi',
          CustomProperties: null,
        },
      };

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
};
