import Actions from '@redux-action-type';
import { HistoryState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import {
  History as HistoryAxios,
  HistoryDetail,
  HistoryLst,
} from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: HistoryState = {
  isLoadingListHistory: false,
  listHistory: {},
  historyDetails: {},
};

const historySlice = createSlice({
  name: SLICE_NAME.HISTORY,
  initialState: initialState,
  reducers: {
    saveListHistory: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          HistoryLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.listHistory = payload;
    },
    saveDetailHistory: (
      state,
      { payload }: PayloadAction<Record<string, HistoryDetail>>,
    ) => {
      state.historyDetails = { ...state.historyDetails, ...payload };
    },
    changeIsLoadingListHistory: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isLoadingListHistory = payload;
    },
  },
});

const getListHistory = createAction(
  Actions.GET_LIST_HISTORY,
  (payload: Pick<HistoryAxios, 'ObjectId' | 'ObjectType'>) => ({
    payload,
  }),
);

const getDetailHistory = createAction(
  Actions.GET_DETAIL_HISTORY,
  (id: string) => ({
    payload: id,
  }),
);

export const historyActions = {
  ...historySlice.actions,
  getListHistory,
  getDetailHistory,
};

export const historyReducer = historySlice.reducer;
