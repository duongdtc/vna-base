import Actions from '@redux-action-type';
import { AirGroup, AirGroupState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';

const initialState: AirGroupState = {
  allAirGroups: {},
};

const airGroupSlice = createSlice({
  name: SLICE_NAME.AIR_GROUP,
  initialState: initialState,
  reducers: {
    saveAllAirGroups: (
      state,
      { payload }: PayloadAction<Record<string, AirGroup>>,
    ) => {
      state.allAirGroups = payload;
    },
  },
});

const getAllAirGroup = createAction(Actions.GET_ALL_AIR_GROUP, () => ({
  payload: undefined,
}));

export const airGroupActions = {
  ...airGroupSlice.actions,
  getAllAirGroup,
};

export const airGroupReducer = airGroupSlice.reducer;
