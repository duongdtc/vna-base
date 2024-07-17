import { ModuleSideBar, ModuleState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';
import Actions from '@redux-action-type';
import { UserModule } from '@services/axios/axios-data';

const initialState: ModuleState = {
  all: [],
  sideBar: [],
};

const moduleSlice = createSlice({
  name: SLICE_NAME.MODULE,
  initialState: initialState,
  reducers: {
    saveAll: (state, { payload }: PayloadAction<Array<UserModule>>) => {
      state.all = payload;
    },
    saveSideBar: (state, { payload }: PayloadAction<Array<ModuleSideBar>>) => {
      state.sideBar = payload;
    },
  },
});

const getAll = createAction(Actions.GET_ALL, () => ({
  payload: null,
}));

const getSideBar = createAction(Actions.GET_SIDE_BAR, () => ({
  payload: null,
}));

export const moduleActions = {
  ...moduleSlice.actions,
  getAll,
  getSideBar,
};
export const moduleReducer = moduleSlice.reducer;
