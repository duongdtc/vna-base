import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';
import { getState } from '@vna-base/utils';

export const selectAllAccounts = createSelector(
  (state: RootState) => state.accounts,
  accounts => accounts.All,
);

export const selectListAccounts = createSelector(
  (state: RootState) => state.accounts,
  accounts => accounts.List,
);

export const selectAccount = (id: string) =>
  createSelector(
    (state: RootState) => state.accounts,
    accounts => accounts.All[id],
  );

export const getAccount = (id?: string | null) =>
  id ? getState('accounts').All[id] : undefined;
