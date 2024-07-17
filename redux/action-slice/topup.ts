import Actions from '@vna-base/redux/action-type';
import { EntryType, ListData, TopupState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopupFilterForm } from '@vna-base/screens/topup-history/type';

import { SLICE_NAME } from './constant';

const initialState: TopupState = {
  resultFilter: { list: [], pageIndex: 1, totalPage: 1 },
  loadingFilter: true,
  filterForm: null,
  allType: {},
};

const topupSlice = createSlice({
  name: SLICE_NAME.TOPUP,
  initialState: initialState,
  reducers: {
    saveResultFilter: (state, { payload }: PayloadAction<ListData>) => {
      state.resultFilter = payload;
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },
    savedFilterForm: (
      state,
      { payload }: PayloadAction<TopupFilterForm | null>,
    ) => {
      state.filterForm = payload;
    },
    saveAllType: (
      state,
      { payload }: PayloadAction<Record<string, EntryType>>,
    ) => {
      state.allType = payload;
    },
  },
});

const getListTopupHistory = createAction(
  Actions.GET_LIST_TOPUP_HISTORY,
  (payload: { filterForm?: TopupFilterForm; pageIndex?: number }) => ({
    payload,
  }),
);

const getTopupDetailByIdAndParentId = createAction(
  Actions.GET_TOPUP_DETAIL_BY_ID_AND_PARENT_ID,
  (id: string) => ({
    payload: { id },
  }),
);

const getAllType = createAction(Actions.GET_ALL_TYPE, () => ({
  payload: undefined,
}));

const exportExcel = createAction(
  Actions.EXPORT_EXCEL_TOP_UP_HISTORY,
  (form: TopupFilterForm) => ({
    payload: form,
  }),
);

export const topupActions = {
  ...topupSlice.actions,
  getListTopupHistory,
  getAllType,
  exportExcel,
  getTopupDetailByIdAndParentId,
};

export const topupReducer = topupSlice.reducer;
