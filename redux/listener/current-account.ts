import { Data } from '@services/axios';
import { UserAccount } from '@services/axios/axios-data';
import { AccountRealm } from '@services/realm/models/account';
import { AgentRealm } from '@services/realm/models/agent';
import { realmRef } from '@services/realm/provider';
import {
  currentAccountActions,
  permissionActions,
} from '@vna-base/redux/action-slice';
import {
  generatePassword,
  load,
  logout,
  save,
  StorageKey,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import isEmpty from 'lodash.isempty';
import isNil from 'lodash.isnil';

export const runCurrentAccountListener = () => {
  takeLatestListeners()({
    actionCreator: currentAccountActions.getCurrentAccount,
    effect: async (action, listenerApi) => {
      const { cb } = action.payload;

      const res = await Data.userAccountUserAccountGetByTokenCreate({
        Id: listenerApi.getState().authentication.token,
        Forced: true,
      });

      if (validResponse(res)) {
        save(StorageKey.SUB_AGENT_ID, '');
        save(StorageKey.USER_AGENT_ID, res.data.Item?.Id);

        const id = load(StorageKey.CURRENT_ACCOUNT_ID);
        if (isNil(id)) {
          logout();
        }

        const userAccount = realmRef.current?.objectForPrimaryKey<AccountRealm>(
          AccountRealm.schema.name,
          id,
        );

        listenerApi.dispatch(
          currentAccountActions.saveCurrentAccount(
            userAccount?.toJSON() as UserAccount,
          ),
        );

        const agent = realmRef.current?.objectForPrimaryKey<AgentRealm>(
          AgentRealm.schema.name,
          userAccount?.AgentId,
        );

        listenerApi.dispatch(
          currentAccountActions.saveBalanceInfo({
            balance: agent?.Balance ?? 0,
            creditLimit: agent?.CreditLimit ?? 0,
          }),
        );

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cb?.(res.data.Item!.Id!);
      } else {
        // thử lại 1 lần, cần 1 biến flag để đánh dấu số lần gọi, nếu flag =1 thì logout và in modal,
        // nếu không thì call lại api này lần nữa xem có được không
        logout();
        // thêm modal thông báo lấy thông tin không thành công
      }
    },
  });

  takeLatestListeners()({
    actionCreator: currentAccountActions.loadAccountData,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(
        currentAccountActions.getCurrentAccount(() => {
          listenerApi.dispatch(permissionActions.getListPermissionAccount());
          // listenerApi.dispatch(userAccountActions.getUserAccount(userId));
        }),
      );
    },
  });

  takeLatestListeners()({
    actionCreator: currentAccountActions.addBalance,
    effect: async action => {
      const { amount } = action.payload;

      const id = load(StorageKey.CURRENT_AGENT_ID);

      const agent = realmRef.current?.objectForPrimaryKey<AgentRealm>(
        AgentRealm.schema.name,
        id,
      );

      if (!isEmpty(agent)) {
        realmRef.current?.write(() => {
          if (!isEmpty(agent)) {
            agent.Balance = (agent.Balance ?? 0) + amount;
          }
        });
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: currentAccountActions.resetPassword,
    effect: async (actions, listenerApi) => {
      const { OldPassword, cb } = actions.payload;

      const { Id } = listenerApi.getState().currentAccount.currentAccount;

      const NewPassword = generatePassword(true, true, true, true, 10);

      const res = await Data.userAccountUserAccountChangePasswordCreate({
        UserId: Id,
        OldPassword: OldPassword,
        NewPassword: NewPassword,
      });

      if (validResponse(res)) {
        cb(NewPassword);
      } else {
        listenerApi.dispatch(
          currentAccountActions.setErrorMsgResetPassword(
            'reset_password:wrong_pass',
          ),
        );
      }
    },
  });
};
