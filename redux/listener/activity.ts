import { showModalConfirm, showToast } from '@vna-base/components';
import { activityActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { Activity, ActivityLst } from '@services/axios/axios-data';
import { delay, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runActivityListener = () => {
  takeLatestListeners()({
    actionCreator: activityActions.getListActivityByAgent,
    effect: async (action, listenerApi) => {
      const { agtId, cb } = action.payload;
      const res = await Data.activityActivityGetAllByAgentIdCreate({
        Id: agtId,
        Forced: true,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          activityActions.saveListActivityByAgent(
            res.data.List as Array<Activity>,
          ),
        );
      }

      cb?.();
    },
  });

  takeLatestListeners()({
    actionCreator: activityActions.getListActivity,
    effect: async (action, listenerApi) => {
      const params = action.payload;
      const res = await Data.activityActivityGetListCreate({
        PageSize: 15,
        PageIndex: 1,
        OrderBy: params.OrderBy,
        SortType: params.SortType,
        Filter: params.Filter,
      });

      let data: Omit<
        ActivityLst,
        'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
      > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

      if (validResponse(res)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Expired, StatusCode, Success, Message, Language, ...rest } =
          res.data;

        data = rest;
      }

      listenerApi.dispatch(activityActions.saveListActivity(data));
    },
  });

  takeLatestListeners()({
    actionCreator: activityActions.insertNewActivity,
    effect: async (action, listenerApi) => {
      const { form, agentId } = action.payload;

      const res = await Data.activityActivityInsertCreate({
        Item: { ...form, AgentId: agentId },
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          activityActions.getListActivityByAgent(agentId, () => {
            showToast({
              type: 'success',
              t18n: 'common:done',
            });
          }),
        );
      }
    },
  });

  takeLatestListeners()({
    actionCreator: activityActions.deleteActivity,
    effect: async (actions, listenerApi) => {
      const { id, agentId } = actions.payload;

      const res = await Data.activityActivityDeleteCreate({
        Id: id,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(activityActions.getListActivityByAgent(agentId));
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
