import { showModalConfirm } from '@vna-base/components';
import { documentActions } from '@redux-slice';
import { Data } from '@services/axios';
import { Document } from '@services/axios/axios-data';
import { delay, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: documentActions.getListDocumentByAgentId,
  effect: async (actions, listenerApi) => {
    const { agentId, cb } = actions.payload;

    const res = await Data.documentDocumentGetAllByAgentIdCreate({
      Id: agentId,
      Forced: true,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        documentActions.saveListDocumentByAgentId(
          res.data.List as Array<Document>,
        ),
      );
    }

    cb?.();
  },
});

takeLatestListeners()({
  actionCreator: documentActions.getDocument,
  effect: async (actions, listenerApi) => {
    const { id } = actions.payload;
    const res = await Data.documentDocumentGetByIdCreate({
      Id: id,
      Forced: true,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        documentActions.saveDocument(res.data.Item as Document),
      );
    }
  },
});

takeLatestListeners(true)({
  actionCreator: documentActions.deleteDocument,
  effect: async (actions, listenerApi) => {
    const {
      id,
      agentId,
      // , fileName
    } = actions.payload;

    showModalConfirm({
      t18nTitle: 'agent_detail:delete_emp',
      // txtFirstTitle: (translate('agent:document') + ':') as I18nKeys,
      // txtFirstData: fileName.slice(0, 30),
      t18nCancel: 'common:cancel',
      themeColorCancel: 'neutral50',
      themeColorTextCancel: 'neutral900',
      t18nOk: 'common:delete',
      themeColorOK: 'error500',
      themeColorTextOK: 'classicWhite',
      onOk: async () => {
        const res = await Data.documentDocumentDeleteCreate({
          Id: id,
        });

        if (validResponse(res)) {
          listenerApi.dispatch(
            documentActions.getListDocumentByAgentId(agentId),
          );
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
      flexDirection: 'row',
    });
  },
});
