import {
  fakeGetListOutStandingPolicy,
  fakeGetListSpecializeNews,
} from '@redux/listener/dbs-content';
import { Email } from '@services/axios';
import { ContentLst } from '@services/axios/axios-data';
import { Content } from '@services/axios/axios-email';
import { dbsContentActions } from '@vna-base/redux/action-slice';
import { delay, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { AxiosResponse } from 'axios';

export const runDBSContentListener = () => {
  takeLatestListeners()({
    actionCreator: dbsContentActions.getListSpecializeNews,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(dbsContentActions.changeLoadingSpecializeNews(true));

      const { pageIndex } = action.payload;

      // const response = await Email.contentHelperContentHelperGetListCreate({
      //   PageSize: PAGE_SIZE_DBS_CONTENT,
      //   PageIndex: pageIndex ?? 1,
      //   OrderBy: 'CreatedDate',
      //   SortType: SortType.Desc,
      //   Filter: [
      //     {
      //       Contain: false,
      //       Name: 'Highlight',
      //       Value: 'false',
      //     },
      //   ],
      //   GetAll: false,
      // });

      const response = await fakeGetListSpecializeNews();

      if (validResponse(response)) {
        listenerApi.dispatch(
          dbsContentActions.saveListSpecializeNews({
            List: response.data.List,
            PageIndex: response.data.PageIndex,
            TotalPage: response.data.TotalPage,
          }),
        );

        response.data.List?.forEach(item => {
          listenerApi.dispatch(
            dbsContentActions.saveDetailContent({
              [item.Id]: item as Content,
            }),
          );
        });
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

      // const response = await Email.contentHelperContentHelperGetListCreate({
      //   PageSize: PAGE_SIZE_DBS_CONTENT,
      //   PageIndex: pageIndex ?? 1,
      //   OrderBy: 'CreatedDate',
      //   SortType: SortType.Desc,
      //   Filter: [
      //     {
      //       Contain: false,
      //       Name: 'Highlight',
      //       Value: 'true',
      //     },
      //   ],
      //   GetAll: false,
      // });

      const response = await fakeGetListOutStandingPolicy();

      if (validResponse(response)) {
        listenerApi.dispatch(
          dbsContentActions.saveListOutStandingPolicy({
            List: response.data.List,
            PageIndex: response.data.PageIndex,
            TotalPage: response.data.TotalPage,
          }),
        );

        response.data.List?.forEach(item => {
          listenerApi.dispatch(
            dbsContentActions.saveDetailContent({
              [item.Id]: item as Content,
            }),
          );
        });
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
