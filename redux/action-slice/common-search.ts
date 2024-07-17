import Actions from '@redux-action-type';
import { CommonSearch } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';
import { Booking, Order, Ticket } from '@services/axios/axios-data';

const initialState: CommonSearch = {
  resultSearch: {
    Booking: [],
    Order: [],
    Ticket: [],
  },
  loadingSearch: false,
};

const commonSearchSlice = createSlice({
  name: SLICE_NAME.COMMON_SEARCH,
  initialState,
  reducers: {
    saveResultSearch: (
      state,
      {
        payload,
      }: PayloadAction<{
        Booking: Array<Booking>;
        Order: Array<Order>;
        Ticket: Array<Ticket>;
      }>,
    ) => {
      state.resultSearch = payload;
    },

    saveLoadingSearch: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingSearch = payload;
    },
  },
});

const search = createAction(Actions.COMMON_SEARCH, (keyword: string) => ({
  payload: keyword,
}));

export const commonSearchReducer = commonSearchSlice.reducer;
export const commonSearchActions = {
  ...commonSearchSlice.actions,
  search,
};
