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
      const response = await Data.userGroupUserGroupGetAllCreate({});

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
}