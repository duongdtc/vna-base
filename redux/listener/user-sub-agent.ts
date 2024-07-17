/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showModalConfirm, showToast } from '@vna-base/components';
import { userSubAgentActions } from '@redux-slice';
import { Data } from '@services/axios';
import { UserAccount } from '@services/axios/axios-data';
import {
  PathInServer,
  delay,
  uploadFiles,
  validResponse,
  getNameOfPhoto,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { Image } from 'react-native-image-crop-picker';
import { onProgressFile } from './file';

takeLatestListeners()({
  actionCreator: userSubAgentActions.getListUserSubAgent,
  effect: async (actions, listenerApi) => {
    const { agentId, cb } = actions.payload;

    const res = await Data.userSubAgentUserSubAgentGetListCreate({
      Id: agentId,
      Forced: true,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        userSubAgentActions.saveListUserSubAgentAccount(
          res.data.List as Array<UserAccount>,
        ),
      );
    }

    cb?.();
  },
});

takeLatestListeners()({
  actionCreator: userSubAgentActions.getUserSubAgentById,
  effect: async (actions, listenerApi) => {
    const { id } = actions.payload;
    const res = await Data.userSubAgentUserSubAgentGetByIdCreate({
      Id: id,
      Forced: true,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        userSubAgentActions.saveUserSubAgent(res.data.Item!),
      );
    }
  },
});

takeLatestListeners(true)({
  actionCreator: userSubAgentActions.insertUserSubAgt,
  effect: async (actions, listenerApi) => {
    const { form, cb } = actions.payload;

    //check change iamge in server
    if (!!form?.Photo && typeof form.Photo !== 'string') {
      const image = form.Photo as Image;
      let photo = '';
      const res = await uploadFiles(
        [
          {
            name: getNameOfPhoto(image, 'jpg'),
            size: image.size,
            type: image.mime,
            uri: image.path,
            fileCopyUri: image.path,
          },
        ],
        onProgressFile,
        PathInServer.AVATAR,
      );

      const success = res?.data?.reduce(
        (result, curr) => result || curr.status === 'fulfilled',
        false,
      );
      if (success && res!.data[0].status === 'fulfilled') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        photo = JSON.parse(res.data[0].value).FileUrl;
      } else {
        showToast({
          type: 'error',
          t18n: 'personal_info:update_avatar_failed',
        });
      }

      form.Photo = photo;
    }

    const res = await Data.userSubAgentUserSubAgentInsertCreate({
      Item: form as UserAccount,
      // Item: { ...form, Status: form.Status ? 1 : 0 } as UserAccount,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        userSubAgentActions.saveUserSubAgent(res.data.Item!),
      );
      listenerApi.dispatch(
        userSubAgentActions.getListUserSubAgent(form.AgentId!),
      );
      await delay(1000);
      cb({
        Username: res.data.Item?.Username,
        Password: res.data.Item?.Password,
      });
    }
  },
});

takeLatestListeners(true)({
  actionCreator: userSubAgentActions.updateUserSubAgt,
  effect: async (actions, listenerApi) => {
    const { form, cbSuccess } = actions.payload;

    //check change iamge in server
    if (!!form?.Photo && typeof form.Photo !== 'string') {
      const image = form.Photo as Image;
      let photo = '';
      const res = await uploadFiles(
        [
          {
            name: getNameOfPhoto(image, 'jpg'),
            size: image.size,
            type: image.mime,
            uri: image.path,
            fileCopyUri: image.path,
          },
        ],
        onProgressFile,
        PathInServer.AVATAR,
      );

      const success = res?.data?.reduce(
        (result, curr) => result || curr.status === 'fulfilled',
        false,
      );
      if (success && res!.data[0].status === 'fulfilled') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        photo = JSON.parse(res.data[0].value).FileUrl;
      } else {
        showToast({
          type: 'error',
          t18n: 'personal_info:update_avatar_failed',
        });
      }

      form.Photo = photo;
    }

    const res = await Data.userSubAgentUserSubAgentUpdateCreate({
      Item: form as UserAccount,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        userSubAgentActions.getListUserSubAgent(form.AgentId!),
      );
      showToast({
        type: 'success',
        t18n: 'common:done',
      });
      cbSuccess();
    }
  },
});

takeLatestListeners(true)({
  actionCreator: userSubAgentActions.resetUserSubAgt,
  effect: async (actions, _listenerApi) => {
    const { id, cb } = actions.payload;

    const res = await Data.userSubAgentUserSubAgentResetCreate({
      Id: id,
    });

    if (validResponse(res)) {
      cb({
        Username: res.data.Item?.Username,
        Password: res.data.Item?.Password,
      });
    } else {
      showToast({
        type: 'error',
        t18n: 'common:failed',
      });
    }
  },
});

takeLatestListeners(true)({
  actionCreator: userSubAgentActions.deleteUserSubAgt,
  effect: async (actions, listenerApi) => {
    const { id, agentId } = actions.payload;

    const res = await Data.userSubAgentUserSubAgentDeleteCreate({
      Id: id,
    });

    if (validResponse(res)) {
      await delay(700);
      showModalConfirm({
        t18nTitle: 'agent_detail:deleted',
        t18nSubtitle: 'order_detail:sub_modal_confirm',
        t18nCancel: 'modal_confirm:close',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
      });
      listenerApi.dispatch(userSubAgentActions.getListUserSubAgent(agentId));
    } else {
      showToast({
        type: 'error',
        t18n: 'common:failed',
      });
    }
  },
});

takeLatestListeners(true)({
  actionCreator: userSubAgentActions.restoreUserSubAgt,
  effect: async (actions, listenerApi) => {
    const { id, agentId, cb } = actions.payload;

    const res = await Data.userSubAgentUserSubAgentRestoreCreate({
      Id: id,
    });

    if (validResponse(res)) {
      cb();
      listenerApi.dispatch(userSubAgentActions.getListUserSubAgent(agentId));
    }
  },
});
