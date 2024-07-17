import Actions from '@vna-base/redux/action-type';
import { UserAccountState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { UserAccount, UserAccountLst } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';
import { PersonalInfoForm } from '@vna-base/screens/personal-info/type';
import { FilterForm } from '@vna-base/screens/user-account/type';

const initialState: UserAccountState = {
  userAccounts: {},
  resultFilter: {},
  filterForm: null,
  loadingFilter: true,
  loadingLoadMore: false,
};

const userAccountSlice = createSlice({
  name: SLICE_NAME.USER_ACCOUNT,
  initialState: initialState,
  reducers: {
    saveUserAccount: (state, { payload }: PayloadAction<UserAccount>) => {
      state.userAccounts[payload.Id as string] = payload;
    },
    saveResultFilter: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          UserAccountLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.resultFilter = payload;
    },
    savedFilterForm: (state, { payload }: PayloadAction<FilterForm | null>) => {
      state.filterForm = payload;
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },
    changeLoadingLoadMore: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingLoadMore = payload;
    },
    saveLoadMore: (state, { payload }: PayloadAction<UserAccountLst>) => {
      state.resultFilter.PageIndex = payload.PageIndex;
      state.resultFilter.List = state.resultFilter.List?.concat(payload.List!);
    },
  },
});

const getUserAccount = createAction(Actions.GET_USER_ACCOUNT, (id: string) => ({
  payload: { id },
}));

const updateUserAccount = createAction(
  Actions.UPDATE_USER_ACCOUNT,
  (form: PersonalInfoForm, cb: () => void) => ({
    payload: { form, cb },
  }),
);

const getListUserAccount = createAction(
  Actions.GET_LIST_USER_ACCOUNT,
  (params: FilterForm) => ({
    payload: params,
  }),
);

const loadMoreUserAccount = createAction(
  Actions.LOAD_MORE_USER_ACCOUNT,
  () => ({
    payload: undefined,
  }),
);

const addNewUserAccount = createAction(
  Actions.ADD_NEW_USER_ACCOUNT,
  (form: PersonalInfoForm, cbSuccess: () => void) => ({
    payload: { form, cbSuccess },
  }),
);

const deleteUserAccount = createAction(
  Actions.DELETE_USER_ACCOUNT,
  (id: string) => ({
    payload: { id },
  }),
);

const resetPassUserAccount = createAction(
  Actions.RESET_PASS_USER_ACCOUNT,
  (
    id: string,
    cb: (data: Pick<UserAccount, 'Username' | 'Password'>) => void,
  ) => ({
    payload: { id, cb },
  }),
);

const restoreUserAccount = createAction(
  Actions.RESTORE_USER_ACCOUNT,
  (id: string, cb: () => void) => ({
    payload: { id, cb },
  }),
);

export const userAccountActions = {
  ...userAccountSlice.actions,
  getUserAccount,
  updateUserAccount,
  getListUserAccount,
  loadMoreUserAccount,
  addNewUserAccount,
  deleteUserAccount,
  resetPassUserAccount,
  restoreUserAccount,
};

export const userAccountReducer = userAccountSlice.reducer;
