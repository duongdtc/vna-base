import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectCurrentAccount = createSelector(
  (state: RootState) => state.currentAccount,
  currentAccount => currentAccount.currentAccount,
);

export const selectErrorMsgResetPassword = createSelector(
  (state: RootState) => state.currentAccount,
  currentAccount => currentAccount.errorMsgResetPass,
);

export const selectListAgentRootSystem = createSelector(
  (state: RootState) => state.currentAccount,
  currentAccount => currentAccount.listSystem,
);

export const selectIsShowBalance = createSelector(
  (state: RootState) => state.currentAccount,
  currentAccount => currentAccount.isShowBalance,
);

export const selectBalanceInfo = createSelector(
  (state: RootState) => state.currentAccount,
  currentAccount => currentAccount.balanceInfo,
);
