import Actions from '@vna-base/redux/action-type';
import { Office, OfficeState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';

const initialState: OfficeState = {
  allOffice: {},
};

const officeSlice = createSlice({
  name: SLICE_NAME.OFFICE,
  initialState: initialState,
  reducers: {
    saveAllOffices: (
      state,
      { payload }: PayloadAction<Record<string, Office>>,
    ) => {
      state.allOffice = payload;
    },
  },
});

const getAllOffice = createAction(Actions.GET_ALL_OFFICE, () => ({
  payload: undefined,
}));

export const officeActions = {
  ...officeSlice.actions,
  getAllOffice,
};

export const officeReducer = officeSlice.reducer;
