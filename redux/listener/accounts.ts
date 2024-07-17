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
      const res = await Data.userAccountUserAccountGetAllCreate({});

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
