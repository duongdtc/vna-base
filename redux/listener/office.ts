/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { officeActions } from '@redux-slice';
import { Office } from '@redux/type';
import { Data } from '@services/axios';
import { I18nKeys } from '@translations/locales';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: officeActions.getAllOffice,
  effect: async (_, listenerApi) => {
    const response = await Data.officeOfficeGetAllCreate({});

    if (validResponse(response)) {
      const obj: Record<string, Office> = {};
      response.data.List?.forEach(element => {
        obj[element.Id as string] = {
          ...element,
          description: element.Description ?? '',
          key: element.Id!,
          t18n: element.Name as I18nKeys,
        };
      });

      listenerApi.dispatch(officeActions.saveAllOffices(obj));
    }
  },
});
