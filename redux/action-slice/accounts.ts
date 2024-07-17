import Actions from '@vna-base/redux/action-type';
import { AccountsState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';
import { UserAccount } from '@services/axios/axios-data';

const initState: AccountsState = {
  List: [],
  All: {},
};

const getListAccount = createAction(
  Actions.GET_LIST_ACCOUNT,
  (accountId?: string) => ({
    payload: { accountId },
  }),
);

const getAllAccount = createAction(
  Actions.GET_ALL_ACCOUNT,
  (accountId?: string) => ({
    payload: { accountId },
  }),
);

const accountSlide = createSlice({
  name: SLICE_NAME.LIST_ACCOUNTS,
  initialState: initState,
  reducers: {
    saveListAccounts: (
      state,
      { payload }: PayloadAction<Array<UserAccount>>,
    ) => {
      state.List = payload;
    },
    saveAllAccounts: (
      state,
      { payload }: PayloadAction<Record<string, UserAccount>>,
    ) => {
      state.All = payload;
    },
  },
});

export const accountReducer = accountSlide.reducer;
export const accountActions = {
  ...accountSlide.actions,
  getListAccount,
  getAllAccount,
};
