/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { dbsContentActions } from '@vna-base/redux/action-slice';
import { Email, SortType } from '@services/axios';
import { Content } from '@services/axios/axios-email';
import { PAGE_SIZE_DBS_CONTENT, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runDBSContentListener = () => {
  takeLatestListeners()({
    actionCreator: dbsContentActions.getListSpecializeNews,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(dbsContentActions.changeLoadingSpecializeNews(true));

      const { pageIndex } = action.payload;

      const response = await Email.contentHelperContentHelperGetListCreate({
        PageSize: PAGE_SIZE_DBS_CONTENT,
        PageIndex: pageIndex ?? 1,
        OrderBy: 'CreatedDate',
        SortType: SortType.Desc,
        Filter: [
          {
            Contain: false,
            Name: 'Highlight',
            Value: 'false',
          },
        ],
        GetAll: false,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(
          dbsContentActions.saveListSpecializeNews({
            List: response.data.List,
            PageIndex: response.data.PageIndex,
            TotalPage: response.data.TotalPage,
          }),
        );
      }

      listenerApi.dispatch(
        dbsContentActions.changeLoadingSpecializeNews(false),
      );
    },
  });

  takeLatestListeners()({
    actionCreator: dbsContentActions.getListOutStandingPolicy,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(dbsContentActions.changeLoadingPolicy(true));

      const { pageIndex } = action.payload;

      const response = await Email.contentHelperContentHelperGetListCreate({
        PageSize: PAGE_SIZE_DBS_CONTENT,
        PageIndex: pageIndex ?? 1,
        OrderBy: 'CreatedDate',
        SortType: SortType.Desc,
        Filter: [
          {
            Contain: false,
            Name: 'Highlight',
            Value: 'true',
          },
        ],
        GetAll: false,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(
          dbsContentActions.saveListOutStandingPolicy({
            List: response.data.List,
            PageIndex: response.data.PageIndex,
            TotalPage: response.data.TotalPage,
          }),
        );
      }

      listenerApi.dispatch(dbsContentActions.changeLoadingPolicy(false));
    },
  });

  takeLatestListeners(true)({
    actionCreator: dbsContentActions.getDetailDBSContent,
    effect: async (actions, listenerApi) => {
      const { id } = actions.payload;
      const res = await Email.contentHelperContentHelperGetByIdCreate({
        Id: id,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          dbsContentActions.saveDetailContent({
            [id]: res?.data?.Item as Content,
          }),
        );
      }
    },
  });
};
