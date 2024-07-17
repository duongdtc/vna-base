import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectUserAccount = (id: string) =>
  createSelector(
    (state: RootState) => state.userAccount.userAccounts,
    userAccounts => userAccounts[id],
  );

export const selectResultFilterUserAccount = createSelector(
  (state: RootState) => state.userAccount,
  userAccount => userAccount.resultFilter,
);

export const selectLoadingFilterUserAccount = createSelector(
  (state: RootState) => state.userAccount,
  userAccount => userAccount.loadingFilter,
);

export const selectLoadingLoadMoreUserAccount = createSelector(
  (state: RootState) => state.userAccount,
  userAccount => userAccount.loadingLoadMore,
);
