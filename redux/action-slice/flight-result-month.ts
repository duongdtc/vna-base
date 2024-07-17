/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FlightMonthState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';
import { StorageKey, load } from '@vna-base/utils';
import { MinPrice } from '@services/axios/axios-ibe';
import Actions from '@redux-action-type';
import { ResultMonthFilterForm } from '@vna-base/screens/flight/type';

const initialState: FlightMonthState = {
  viewChart: !!load(StorageKey.VIEW_CHART),
  stage0: [],
  stage1: [],
  stage2: [],
  stage3: [],
  filterForm: { Airline: null },
  airlines: [],
};

const flightResultMonthSlice = createSlice({
  name: SLICE_NAME.FLIGHT_RESULT_MONTH,
  initialState: initialState,
  reducers: {
    saveStage: (
      state,
      {
        payload,
      }: PayloadAction<{
        idx: number;
        data: Array<MinPrice>;
      }>,
    ) => {
      //@ts-ignore
      state[`stage${payload.idx}`] = payload.data;
    },
    saveViewChart: (state, { payload }: PayloadAction<boolean>) => {
      state.viewChart = payload;
    },

    saveFilterForm: (
      state,
      { payload }: PayloadAction<ResultMonthFilterForm>,
    ) => {
      state.filterForm = payload;
    },

    saveAirlines: (state, { payload }: PayloadAction<Array<string>>) => {
      state.airlines = payload;
    },
  },
});

const changeViewChart = createAction(Actions.CHANGE_VIEW_CHART, () => ({
  payload: undefined,
}));

const changeFilterForm = createAction(
  Actions.CHANGE_FILTER_FORM,
  (form: ResultMonthFilterForm) => ({
    payload: form,
  }),
);

export const flightResultMonthActions = {
  ...flightResultMonthSlice.actions,
  changeViewChart,
  changeFilterForm,
};

export const flightResultMonthReducer = flightResultMonthSlice.reducer;
