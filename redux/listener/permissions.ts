/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { permissionActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { Rule } from '@services/casl/type';
import { validResponse } from '@vna-base/utils';
import { genRulesFromBE } from '@vna-base/utils/casl';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runPermissionsListener = () => {
  takeLatestListeners()({
    actionCreator: permissionActions.getListPermissionAccount,
    effect: async (_, listenerApi) => {
      const { UserGroupId, Agent, SuperAdmin } =
        listenerApi.getState().currentAccount.currentAccount;

      const res = await Data.userPermissionUserPermissionGetListByUserGroupCreate(
        {
          Id: UserGroupId,
          Forced: true,
        },
      );

      if (validResponse(res)) {
        listenerApi.dispatch(
          permissionActions.saveListPermissionAccount(res.data.List!),
        );

        const rules: Array<Rule> = genRulesFromBE(res.data.List!, {
          agentLevel: Agent?.AgentLevel ?? 'F1',
          isSuperAdmin: !!SuperAdmin,
        });

        listenerApi.dispatch(permissionActions.savePermission(rules));
      } else {
        listenerApi.dispatch(permissionActions.savePermission([]));
      }
    },
  });

  takeLatestListeners()({
    actionCreator: permissionActions.getAllPermission,
    effect: async (_, listenerApi) => {
      const res = await Data.userPermissionUserPermissionGetAllCreate({});

      if (validResponse(res)) {
        listenerApi.dispatch(permissionActions.saveAllPermission(res.data.List!));
      }
    },
  });
}