/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Actions from '@vna-base/redux/action-type';
import { BalanceInfo, CurrentAccountState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAccount } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { SLICE_NAME } from './constant';
import { System } from '@vna-base/utils';

const initialState: CurrentAccountState = {
  currentAccount: {},
  errorMsgResetPass: undefined,
  listSystem: [],
  isShowBalance: false,

  balanceInfo: {
    balance: 0,
    creditLimit: 0,
  },
};

const currentAccountSlice = createSlice({
  name: SLICE_NAME.CURRENT_ACCOUNT,
  initialState: initialState,
  reducers: {
    saveCurrentAccount: (state, { payload }: PayloadAction<UserAccount>) => {
      state.currentAccount = payload;
    },

    setErrorMsgResetPassword: (
      state,
      { payload }: PayloadAction<I18nKeys | undefined>,
    ) => {
      state.errorMsgResetPass = payload;
    },

    saveListSystem: (state, { payload }: PayloadAction<Array<System>>) => {
      state.listSystem = payload;
    },

    saveIsShowBalance: (state, { payload }: PayloadAction<boolean>) => {
      state.isShowBalance = payload;
    },

    saveBalanceInfo: (state, { payload }: PayloadAction<BalanceInfo>) => {
      state.balanceInfo = payload;
    },
  },
});

const getCurrentAccount = createAction(
  Actions.GET_CURRENT_ACCOUNT,
  (cb?: (userId: string) => void) => ({
    payload: { cb },
  }),
);

/**
 * Load full data of account
 */
const loadAccountData = createAction(Actions.LOAD_ACCOUNT_DATA, () => ({
  payload: undefined,
}));

const resetPassword = createAction(
  Actions.RESET_PASSWORD,
  (OldPassword: string, cb: (password: string) => void) => ({
    payload: { OldPassword, cb },
  }),
);

const addBalance = createAction(Actions.ADD_BALANCE, (amount: number) => ({
  payload: { amount },
}));

export const currentAccountActions = {
  ...currentAccountSlice.actions,
  getCurrentAccount,
  loadAccountData,
  resetPassword,
  addBalance,
};
export const currentAccountReducer = currentAccountSlice.reducer;
