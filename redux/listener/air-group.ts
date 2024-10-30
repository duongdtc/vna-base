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
      // const response = await Data.airGroupAirGroupGetAllCreate({});
      const response = {
        data: {
          List: [
            {
              Id: '8D20B277-CE5D-40DC-AC8C-89E585B283F4',
              Index: 14,
              AgentId: null,
              Code: 'BSP',
              Name: 'Nhóm xuất vé BSP',
              Description: 'Nhóm mặc định',
              Default: true,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: '1E8EFD45-3F88-41C4-A181-AFD65DDF9A85',
              Index: 11,
              AgentId: null,
              Code: 'QHA',
              Name: 'Bamboo Airways',
              Description: 'Nhóm mặc định',
              Default: true,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: 'D285AC26-C6E5-4145-8F03-044F19A1E729',
              Index: 10,
              AgentId: null,
              Code: 'VJA',
              Name: 'Vietjet Air',
              Description: 'Nhóm mặc định',
              Default: true,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: '91936C98-A72A-4C26-BF51-335DB5930845',
              Index: 9,
              AgentId: null,
              Code: 'VNA',
              Name: 'Vietnam Airlines',
              Description: 'Nhóm mặc định',
              Default: true,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: 'CAB5CB74-C705-443E-8017-4657BBE8755B',
              Index: 13,
              AgentId: null,
              Code: 'VUA',
              Name: 'Vietravel Airlines',
              Description: 'Nhóm mặc định',
              Default: true,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: '549C22ED-9DC8-4407-AC30-4527C1FBB7DB',
              Index: 24,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: '127',
              Name: 'TEST',
              Description: 'TEST',
              Default: false,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: 'A5E45ED0-7B71-4979-87A1-4884708A5558',
              Index: 2,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'LCC',
              Name: 'Hãng giá rẻ',
              Description: 'Các hãng giá rẻ nội địa',
              Default: false,
              Visible: true,
              AirMaps: [],
            },
            {
              Id: 'B049023F-EE6B-4123-9AC1-165ABCB2618F',
              Index: 8,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'TEST2',
              Name: 'test',
              Description: 'test',
              Default: false,
              Visible: true,
              AirMaps: [],
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
