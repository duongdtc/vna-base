/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showModalConfirm } from '@vna-base/components';
import { contactActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { Contact } from '@services/axios/axios-data';
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

export const runContactListener = () => {
  takeLatestListeners()({
    actionCreator: contactActions.getListContactByAgentId,
    effect: async (actions, listenerApi) => {
      const { agentId, cb } = actions.payload;

      const res = await Data.contactContactGetAllByAgentIdCreate({
        Id: agentId,
        Forced: true,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          contactActions.saveListContactByAgentId(
            res.data.List as Array<Contact>,
          ),
        );
      }

      cb?.();
    },
  });

  takeLatestListeners()({
    actionCreator: contactActions.getContact,
    effect: async (actions, listenerApi) => {
      const { id } = actions.payload;
      const res = await Data.contactContactGetByIdCreate({
        Id: id,
        Forced: true,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          contactActions.saveContact(res.data.Item as Contact),
        );
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: contactActions.insertContact,
    effect: async (actions, listenerApi) => {
      const { form } = actions.payload;

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
        }

        form.Photo = photo;
      }

      const res = await Data.contactContactInsertCreate({
        Item: form as Contact,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          contactActions.getListContactByAgentId(form.AgentId!),
        );
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: contactActions.deleteContact,
    effect: async (actions, listenerApi) => {
      const { id, agentId } = actions.payload;

      const res = await Data.contactContactDeleteCreate({
        Id: id,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(contactActions.getListContactByAgentId(agentId));
        await delay(700);
        showModalConfirm({
          t18nTitle: 'agent_detail:deleted',
          t18nSubtitle: 'order_detail:sub_modal_confirm',
          t18nCancel: 'modal_confirm:close',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
        });
      }
    },
  });
};
