/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Actions from '@vna-base/redux/action-type';
import { ConfigPaymentState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { PayMethod } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: ConfigPaymentState = {
  payMethods: {},
};

const configPaymentSlice = createSlice({
  name: SLICE_NAME.CONFIG_PAYMENT,
  initialState: initialState,
  reducers: {
    saveAllPayMethod: (
      state,
      { payload }: PayloadAction<Record<string, PayMethod>>,
    ) => {
      state.payMethods = payload;
    },
  },
});

const getAllPayMethod = createAction(Actions.GET_ALL_PAY_METHOD, () => ({
  payload: undefined,
}));

export const configPaymentActions = {
  ...configPaymentSlice.actions,
  getAllPayMethod,
};

export const configPaymentReducer = configPaymentSlice.reducer;
