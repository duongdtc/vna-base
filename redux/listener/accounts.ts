import { accountActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { UserAccount } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

const PAGE_SIZE = 20;
export const runAccountListener = () => {
  takeLatestListeners()({
    actionCreator: accountActions.getListAccount,
    effect: async (_, listenerApi) => {
      const res = await Data.userAccountUserAccountGetListCreate({
        PageSize: PAGE_SIZE,
        PageIndex: 1,
        GetAll: true,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          accountActions.saveListAccounts(res.data.List as Array<UserAccount>),
        );
      }
    },
  });

  takeLatestListeners()({
    actionCreator: accountActions.getAllAccount,
    effect: async (_, listenerApi) => {
      // const res = await Data.userAccountUserAccountGetAllCreate({});
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
        const obj: Record<
          string,
          UserAccount & {
            description: string;
            key: string;
            t18n: I18nKeys;
          }
        > = {};
        res.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Username!,
            key: element.Id!,
            t18n: element.FullName as I18nKeys,
          };
        });

        listenerApi.dispatch(accountActions.saveAllAccounts(obj));
      }
    },
  });
};
