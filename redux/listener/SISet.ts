/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { sisetActions } from '@vna-base/redux/action-slice';
import { SISetType } from '@redux/type';
import { Data } from '@services/axios';
import { SISet } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { PAGE_SIZE_AGENT, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runSISetListener = () => {
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
      // const res = await Data.siSetSiSetGetAllCreate({});
      const res = {
        data: {
          List: [
            {
              Id: '15248905-CC05-4AB7-8B96-DC98882A028D',
              Index: 9,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'CERT',
              Name: 'Bộ tài khoản test api các hãng',
              Description: 'Bộ tài khoản test api các hãng',
              Default: false,
              Sandbox: false,
              Visible: true,
              SIMaps: [],
            },
            {
              Id: '502E2325-FAB1-47B6-8D1E-BE075B6F02DE',
              Index: 10,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'HUNG',
              Name: 'Hưng tê ka',
              Description: 'Hưng tê ka',
              Default: false,
              Sandbox: false,
              Visible: true,
              SIMaps: [],
            },
            {
              Id: '620FC274-1782-4A64-BC62-7963F2D43A26',
              Index: 1,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'DEFAULT',
              Name: 'Bộ tài khoản mặc định',
              Description: 'Nhóm SI mặc định',
              Default: true,
              Sandbox: true,
              Visible: true,
              SIMaps: [],
            },
            {
              Id: '9D6313A6-F480-48E3-A480-58C92382AA12',
              Index: 7,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'MINH',
              Name: 'Minh',
              Description: 'Dành riêng cho anh Minh',
              Default: false,
              Sandbox: false,
              Visible: true,
              SIMaps: [],
            },
            {
              Id: 'C1844805-4B86-435D-B6AF-0AC538312BFE',
              Index: 8,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'PRODUCTION',
              Name: 'Bộ tài khoản production dùng để test',
              Description: 'Bộ tài khoản production dùng để test',
              Default: false,
              Sandbox: false,
              Visible: true,
              SIMaps: [],
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
};
