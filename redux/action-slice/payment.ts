import Actions from '@redux-action-type';
import { ListData, PaymentState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentHistoryFilterForm } from '@vna-base/screens/payment-history/type';

import { Payment } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: PaymentState = {
  ListPaymentExpense: [],
  ListPaymentReceive: [],
  resultFilter: { list: [], pageIndex: 1, totalPage: 1 },
  loadingFilter: true,
  filterForm: null,
};

const paymentSlice = createSlice({
  name: SLICE_NAME.PAYMENT,
  initialState: initialState,
  reducers: {
    saveListPaymentExpense: (
      state,
      { payload }: PayloadAction<Array<Payment>>,
    ) => {
      state.ListPaymentExpense = payload;
    },
    saveListPaymentReceive: (
      state,
      { payload }: PayloadAction<Array<Payment>>,
    ) => {
      state.ListPaymentReceive = payload;
    },
    saveResultFilter: (state, { payload }: PayloadAction<ListData>) => {
      state.resultFilter = payload;
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },
    savedFilterForm: (
      state,
      { payload }: PayloadAction<PaymentHistoryFilterForm | null>,
    ) => {
      state.filterForm = payload;
    },
  },
});

const getListPaymentExpense = createAction(
  Actions.GET_LIST_PAYMENT_EXPENSE,
  (id: string) => ({
    payload: { id },
  }),
);

const getListPaymentReceive = createAction(
  Actions.GET_LIST_PAYMENT_RECEIVE,
  (id: string) => ({
    payload: { id },
  }),
);

const getListPaymentHistory = createAction(
  Actions.GET_LIST_PAYMENT_HISTORY,
  (payload: { filterForm?: PaymentHistoryFilterForm; pageIndex?: number }) => ({
    payload,
  }),
);

const exportExcel = createAction(
  Actions.EXPORT_EXCEL_PAYMENT_HISTORY,
  (form: PaymentHistoryFilterForm) => ({
    payload: form,
  }),
);

export const paymentActions = {
  ...paymentSlice.actions,
  getListPaymentExpense,
  getListPaymentReceive,
  getListPaymentHistory,
  exportExcel,
};

export const paymentReducer = paymentSlice.reducer;
