import Actions from '@vna-base/redux/action-type';
import { SISetState, SISetType } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { SISetForm } from '@vna-base/screens/agent/type';
import { SISet } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: SISetState = {
  listSISet: [],
  allSISet: {},
};

const sisetSlice = createSlice({
  name: SLICE_NAME.SISET,
  initialState: initialState,
  reducers: {
    saveListSISet: (state, { payload }: PayloadAction<Array<SISet>>) => {
      state.listSISet = payload;
    },

    saveAllSISet: (
      state,
      { payload }: PayloadAction<Record<string, SISetType>>,
    ) => {
      state.allSISet = payload;
    },
  },
});

const getListSISet = createAction(
  Actions.GET_LIST_SISET,
  (params: SISetForm) => ({
    payload: params,
  }),
);

const getAllSISet = createAction(Actions.GET_ALL_SISET, () => ({
  payload: undefined,
}));

export const sisetActions = {
  ...sisetSlice.actions,
  getListSISet,
  getAllSISet,
};

export const sisetReducer = sisetSlice.reducer;
