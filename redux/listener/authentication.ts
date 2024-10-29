/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AccountRealm } from '@services/realm/models/account';
import { AgentRealm } from '@services/realm/models/agent';
import { realmRef } from '@services/realm/provider';
import { currentAccountActions } from '@vna-base/redux/action-slice';
import { remove, save, validResponse } from '@vna-base/utils';
import CustomKeyChain from '@vna-base/utils/keychain';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { StorageKey } from '@vna-base/utils/storage/constants';
import { authenticationActions } from '../action-slice/authentication';

export const runAuthenticationListener = () => {
  takeLatestListeners(true)({
    actionCreator: authenticationActions.login,
    effect: async (action, listenerApi) => {
      const { body, onFailure, isRemember } = action.payload;

      // const response = await Data.userAccountUserAccountLoginCreate({
      //   AgentCode: 'DC10899',
      //   Username: 'hungtk',
      //   Password: '123456',
      //   Remember: true,
      // });

      const response = {
        data: {
          Message: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          Language: 'vi',
          CustomProperties: null,
          StatusCode: '000',
          Expired: false,
          TokenLogin:
            'pZCI6IjY2OTYzNUVBLTc2ODgtNEE4Ri1COTk1LTJCMkEzNzVDOURBMyIsIm5iZiI6MTczMDIxNTYxMiwiZXhwIjoxNzYxNzUxNjEyLCJpYXQiOjE3MzAyMTU2MTJ9.LaEtFZ8q2Efig4hd-JWRbAsqAkN-azbYsOzE1xyQV1M',
          Success: true,
        },
      };

      const agents = realmRef.current
        ?.objects<AgentRealm>(AgentRealm.schema.name)
        //@
        .filtered('AgentCode == $0', body.AgentCode.toUpperCase());

      if (!agents || agents?.length === 0) {
        onFailure('Sai thông tin đăng nhập');

        return;
      }

      const accountRealms = realmRef.current
        ?.objects<AccountRealm>(AccountRealm.schema.name)
        .filtered(
          'Username == $0 && Password == $1 && AgentId CONTAINS[c] $2',
          body.Username.toLowerCase(),
          body.Password.toLowerCase(),
          agents[0].Id,
        );

      if (
        !response ||
        !validResponse(response) ||
        accountRealms?.length === 0
      ) {
        onFailure('Sai thông tin đăng nhập');
        return;
      }

      // @ts-ignore
      save(StorageKey.CURRENT_ACCOUNT_ID, accountRealms[0].Id);
      // @ts-ignore
      save(StorageKey.CURRENT_AGENT_ID, accountRealms[0].AgentId);

      if (!isRemember) {
        remove(StorageKey.AGENT_CODE);
        remove(StorageKey.USERNAME);
        await CustomKeyChain.resetInternetCredentials();
      } else {
        save(StorageKey.AGENT_CODE, body.AgentCode.toUpperCase());
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
    },
  });
};
