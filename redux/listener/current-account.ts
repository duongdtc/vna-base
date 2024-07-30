import { Data } from '@services/axios';
import {
  currentAccountActions,
  permissionActions,
  userAccountActions,
} from '@vna-base/redux/action-slice';
import { generatePassword, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runCurrentAccountListener = () => {
  // takeLatestListeners()({
  //   actionCreator: currentAccountActions.getCurrentAccount,
  //   effect: async (action, listenerApi) => {
  //     const { cb } = action.payload;
  //     const res = await Data.userAccountUserAccountGetByTokenCreate({
  //       Id: listenerApi.getState().authentication.token,
  //       Forced: true,
  //     });

  //     if (validResponse(res)) {
  //       save(StorageKey.SUB_AGENT_ID, '');
  //       save(StorageKey.USER_AGENT_ID, res.data.Item?.Id);

  //       listenerApi.dispatch(
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         currentAccountActions.saveCurrentAccount({
  //           ...(res.data.Item ?? {}),

  //           Agent: {
  //             ...(res.data.Item?.Agent ?? {}),
  //             CreditLimit: 40_000_000,
  //             Balance: 10_000_000,
  //           },
  //         }),
  //       );

  //       listenerApi.dispatch(
  //         currentAccountActions.saveBalanceInfo({
  //           balance: res.data.Item?.Agent?.Balance ?? 0,
  //           creditLimit: res.data.Item?.Agent?.CreditLimit ?? 0,
  //         }),
  //       );

  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       cb?.(res.data.Item!.Id!);
  //     } else {
  //       // thử lại 1 lần, cần 1 biến flag để đánh dấu số lần gọi, nếu flag =1 thì logout và in modal,
  //       // nếu không thì call lại api này lần nữa xem có được không
  //       logout();
  //       // thêm modal thông báo lấy thông tin không thành công
  //     }
  //   },
  // });

  takeLatestListeners()({
    actionCreator: currentAccountActions.loadAccountData,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(
        currentAccountActions.getCurrentAccount((userId: string) => {
          listenerApi.dispatch(permissionActions.getListPermissionAccount());
          listenerApi.dispatch(userAccountActions.getUserAccount(userId));
        }),
      );
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
