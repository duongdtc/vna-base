import { FlightReportState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ReportLst } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';
import Actions from '@redux-action-type';
import { GetFlightReportMode } from '@vna-base/utils';

const initialState: FlightReportState = {
  resultListFlightReport: {},
};

const flightReportSlice = createSlice({
  name: SLICE_NAME.FLIGHT_REPORT,
  initialState: initialState,
  reducers: {
    saveResultListFLReport: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          ReportLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.resultListFlightReport = payload;
    },
  },
});

const getListFlightReport = createAction(
  Actions.GET_LIST_FLIGHT_REPORT,
  (agentId: string, mode: GetFlightReportMode) => ({
    payload: { agentId, mode },
  }),
);

export const flightReportActions = {
  ...flightReportSlice.actions,
  getListFlightReport,
};

export const flightReportReducer = flightReportSlice.reducer;
