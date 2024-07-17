import { historyActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import {
  HistoryLst,
  History as HistoryAxios,
  HistoryDetail,
} from '@services/axios/axios-data';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runHistoryListener = () => {

  takeLatestListeners()({
    actionCreator: historyActions.getListHistory,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(historyActions.changeIsLoadingListHistory(true));
      const { ObjectId, ObjectType } = action.payload;

      const response = await Data.historyHistoryGetActionCreate({
        Item: {
          ObjectId: ObjectId,
          ObjectType: ObjectType,
        } as HistoryAxios,
      });

      let data: Omit<
        HistoryLst,
        'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
      > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

      if (validResponse(response)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Expired, StatusCode, Success, Message, Language, ...rest } =
          response.data;

        data = rest;
      }

      listenerApi.dispatch(historyActions.saveListHistory(data));

      listenerApi.dispatch(historyActions.changeIsLoadingListHistory(false));
    },
  });

  takeLatestListeners()({
    actionCreator: historyActions.getDetailHistory,
    effect: async (action, listenerApi) => {
      const id = action.payload;

      const response = await Data.historyHistoryGetDetailCreate({
        Id: id,
      });

      // if (validResponse(response)) {
      listenerApi.dispatch(
        historyActions.saveDetailHistory({
          [id]: response?.data?.Item as HistoryDetail,
        }),
      );
      // }
    },
  });
}