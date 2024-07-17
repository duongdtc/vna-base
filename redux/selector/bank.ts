import { RootState } from '@store/all-reducers';
import { createSelector } from '@reduxjs/toolkit';

export const selectQR = createSelector(
  (state: RootState) => state.bank,
  bank => bank.QR,
);

export const selectAllBankAccounts = createSelector(
  (state: RootState) => state.bank,
  bank => bank.accounts,
);

export const selectAllBankAccountsOfParent = createSelector(
  (state: RootState) => state.bank,
  bank => bank.accountsOfParent,
);

export const selectTransactionStatus = createSelector(
  (state: RootState) => state.bank,
  bank => bank.transactionStatus,
);
