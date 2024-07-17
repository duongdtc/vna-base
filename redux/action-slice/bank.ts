import Actions from '@redux-action-type';
import { Account, BankState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionStatus } from '@vna-base/screens/pay/hooks/use-handle-topup-mqtt';
import { TopupForm } from '@vna-base/screens/topup/type';

import { SLICE_NAME } from './constant';

const initialState: BankState = {
  QR: { path: '', amount: 0, bank: '', randomCode: null },
  accounts: {},
  accountsOfParent: {},
  transactionStatus: null,
};

const bankSlice = createSlice({
  name: SLICE_NAME.BANK,
  initialState: initialState,
  reducers: {
    saveQR: (
      state,
      {
        payload,
      }: PayloadAction<{
        path: string;
        bank: string;
        amount: number;
        randomCode: string;
      }>,
    ) => {
      state.QR = payload;
    },
    saveAllAccount: (
      state,
      { payload }: PayloadAction<Record<string, Account>>,
    ) => {
      state.accounts = payload;
    },

    saveAccountsOfParent: (
      state,
      { payload }: PayloadAction<Record<string, Account>>,
    ) => {
      state.accountsOfParent = payload;
    },

    saveTransactionStatus: (
      state,
      { payload }: PayloadAction<TransactionStatus | null>,
    ) => {
      state.transactionStatus = payload;
    },
  },
});

const getQRCode = createAction(
  Actions.GET_QR_CODE,
  (form: TopupForm, cb: (isSuccess: boolean) => void) => ({
    payload: { form, cb },
  }),
);

const getAllBankAccounts = createAction(Actions.GET_ALL_BANK_ACCOUNT, () => ({
  payload: undefined,
}));

const getBankAccountsOfParent = createAction(
  Actions.GET_BANK_ACCOUNT_OF_PARENT,
  () => ({
    payload: undefined,
  }),
);

export const bankReducer = bankSlice.reducer;
export const bankActions = {
  ...bankSlice.actions,
  getQRCode,
  getAllBankAccounts,
  getBankAccountsOfParent,
};
