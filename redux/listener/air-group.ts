/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { airGroupActions } from '@vna-base/redux/action-slice';
import { AirGroup } from '@redux/type';
import { Data } from '@services/axios';
import { I18nKeys } from '@translations/locales';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runAirGroupListener = () => {
  takeLatestListeners()({
    actionCreator: airGroupActions.getAllAirGroup,
    effect: async (_, listenerApi) => {
      const response = await Data.airGroupAirGroupGetAllCreate({});

      if (validResponse(response)) {
        const obj: Record<string, AirGroup> = {};

        response.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Description ?? '',
            key: element.Id!,
            t18n: element.Name as I18nKeys,
          };
        });

        listenerApi.dispatch(airGroupActions.saveAllAirGroups(obj));
      }
    },
  });
};
