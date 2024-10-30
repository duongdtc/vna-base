/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { userGroupActions } from '@vna-base/redux/action-slice';
import { UserGroup } from '@redux/type';
import { Data } from '@services/axios';
import { UserGroupLst } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { PAGE_SIZE_USER_GROUP, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runUserGroupListener = () => {
  takeLatestListeners()({
    actionCreator: userGroupActions.getListUserGroup,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(userGroupActions.changeLoadingFilter(true));
      const params = action.payload;

      listenerApi.dispatch(userGroupActions.savedFilterForm(params));

      const response = await Data.userGroupUserGroupGetListCreate({
        PageSize: PAGE_SIZE_USER_GROUP,
        PageIndex: 1,
        OrderBy: params.OrderBy,
        SortType: params.SortType,
        Filter: params.Filter,
        GetAll: true,
      });

      let data: Omit<
        UserGroupLst,
        'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
      > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

      if (validResponse(response)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Expired, StatusCode, Success, Message, Language, ...rest } =
          response.data;

        data = rest;
      }

      listenerApi.dispatch(userGroupActions.saveListUserGroup(data));
      listenerApi.dispatch(userGroupActions.changeLoadingFilter(false));
    },
  });

  takeLatestListeners()({
    actionCreator: userGroupActions.getAllUserGroups,
    effect: async (_, listenerApi) => {
      // const response = await Data.userGroupUserGroupGetAllCreate({});
      const response = {
        data: {
          List: [
            {
              Id: '60EA3C72-AE8C-4D9E-88B5-A979506F1B5D',
              Index: 32,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
              Code: 'SP',
              Name: 'Đặc biệt',
              Description: null,
              Level: 0,
              Default: false,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
            },
            {
              Id: '5CFF5177-1796-495E-B723-7D18B2B21E91',
              Index: 2,
              AgentId: null,
              ParentId: null,
              Code: 'SA',
              Name: 'SuperAdmin',
              Description: 'Nhóm tài khoản dành cho quản trị viên cấp cao',
              Level: 1,
              Default: true,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
            },
            {
              Id: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
              Index: 1,
              AgentId: null,
              ParentId: '5CFF5177-1796-495E-B723-7D18B2B21E91',
              Code: 'AD',
              Name: 'Admin',
              Description: 'Nhóm tài khoản dành cho quản trị viên',
              Level: 2,
              Default: true,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
            },
            {
              Id: 'E08C57A5-4153-4068-96C0-CC7D13D3437E',
              Index: 13,
              AgentId: null,
              ParentId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
              Code: 'AC',
              Name: 'Accountant',
              Description: 'Nhóm tài khoản dành cho kế toán viên',
              Level: 3,
              Default: true,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
            },
            {
              Id: 'F6CE2195-6D15-458B-B829-4B33231A2D21',
              Index: 14,
              AgentId: null,
              ParentId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
              Code: 'TK',
              Name: 'Ticketing',
              Description: 'Nhóm tài khoản dành cho nhân viên ticketing',
              Level: 3,
              Default: true,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
            },
            {
              Id: '885E4684-84E2-4235-9E63-6EC3376AA1DD',
              Index: 3,
              AgentId: null,
              ParentId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
              Code: 'SL',
              Name: 'Sales',
              Description: 'Nhóm tài khoản dành cho nhân viên kinh doanh',
              Level: 3,
              Default: true,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
            },
            {
              Id: 'BD592C36-3C9E-4E6B-AD03-9AC00041B3CB',
              Index: 31,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: '885E4684-84E2-4235-9E63-6EC3376AA1DD',
              Code: 'MK',
              Name: 'Marketing',
              Description: 'Nhóm tài khoản nhân viên marketing tuỳ chỉnh',
              Level: 4,
              Default: false,
              Visible: true,
              Agent: null,
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
              UserPermissions: [],
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
        const obj: Record<string, UserGroup> = {};

        response.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Description ?? '',
            key: element.Id!,
            t18n: element.Name as I18nKeys,
          };
        });

        listenerApi.dispatch(userGroupActions.saveAllUserGroups(obj));
      }
    },
  });
};
