import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListPaymentExpense = createSelector(
  (state: RootState) => state.payment,
  payment => payment.ListPaymentExpense,
);

export const selectListPaymentReceive = createSelector(
  (state: RootState) => state.payment,
  payment => payment.ListPaymentReceive,
);

export const selectResultFilterPaymentHistory = createSelector(
  (state: RootState) => state.payment,
  payment => payment.resultFilter,
);

export const selectLoadingFilterPaymentHistory = createSelector(
  (state: RootState) => state.payment,
  payment => payment.loadingFilter,
);
