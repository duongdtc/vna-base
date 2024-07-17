import { currentAccountActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { handleErrorApi, remove, save, validResponse } from '@vna-base/utils';
import CustomKeyChain from '@vna-base/utils/keychain';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { StorageKey } from '@vna-base/utils/storage/constants';
import { authenticationActions } from '../action-slice/authentication';

export const runAuthenticationListener = () => {
  takeLatestListeners(true)({
    actionCreator: authenticationActions.login,
    effect: async (action, listenerApi) => {
      const { body, onFailure, isRemember } = action.payload;

      const response = await Data.userAccountUserAccountLoginCreate({
        ...body,
        AgentCode: 'DC10899',
        Remember: true,
      });

      if (!response) {
        onFailure('Lỗi mạng rồi kìa');
        return;
      }

      if (validResponse(response)) {
        if (!isRemember) {
          remove(StorageKey.USERNAME);
          await CustomKeyChain.resetInternetCredentials();
        } else {
          save(StorageKey.USERNAME, body.Username);
          await CustomKeyChain.setInternetCredentials(
            body.Username,
            body.Password,
          );
        }

        save(StorageKey.TOKEN, response.data.TokenLogin);

        listenerApi.dispatch(
          authenticationActions.setToken(response.data.TokenLogin as string),
        );

        listenerApi.dispatch(currentAccountActions.loadAccountData());
      } else {
        onFailure(handleErrorApi(response.data.StatusCode as string).msg);
      }
    },
  });
};
