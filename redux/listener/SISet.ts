/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { sisetActions } from '@redux-slice';
import { SISetType } from '@redux/type';
import { Data } from '@services/axios';
import { SISet } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { PAGE_SIZE_AGENT, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: sisetActions.getListSISet,
  effect: async (action, listenerApi) => {
    const params = action.payload;

    const response = await Data.siSetSiSetGetListCreate({
      PageSize: PAGE_SIZE_AGENT,
      PageIndex: 1,
      OrderBy: params.OrderBy,
      SortType: params.SortType,
      Filter: params.Filter,
      GetAll: params.GetAll,
    });

    if (validResponse(response)) {
      listenerApi.dispatch(
        sisetActions.saveListSISet(response.data.List as SISet[]),
      );
    }
  },
});

takeLatestListeners()({
  actionCreator: sisetActions.getAllSISet,
  effect: async (_, listenerApi) => {
    const res = await Data.siSetSiSetGetAllCreate({});

    if (validResponse(res)) {
      if (validResponse(res)) {
        const obj: Record<string, SISetType> = {};
        res.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Code!,
            key: element.Id!,
            t18n: element.Name as I18nKeys,
          };
        });
        listenerApi.dispatch(sisetActions.saveAllSISet(obj));
      }
    }
  },
});
