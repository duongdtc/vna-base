import { flightReportActions } from '@redux-slice';
import { Data } from '@services/axios';
import { ReportLst } from '@services/axios/axios-data';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: flightReportActions.getListFlightReport,
  effect: async (action, listenerApi) => {
    const { agentId, mode } = action.payload;

    const response = await Data.reportReportGetFlightReportCreate({
      AgentId: agentId,
      Mode: mode,
    });

    let data: Omit<
      ReportLst,
      'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
    > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

    if (validResponse(response)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Expired, StatusCode, Success, Message, Language, ...rest } =
        response.data;

      data = rest;
    }

    listenerApi.dispatch(flightReportActions.saveResultListFLReport(data));
  },
});
