import Actions from '@vna-base/redux/action-type';
import { AuthenticationState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormLoginType } from '@screens/login/type';
import { SLICE_NAME } from './constant';

const initialState: AuthenticationState = {
  token: undefined,
};

const authenticationSlice = createSlice({
  name: SLICE_NAME.AUTHENTICATION,
  initialState: initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
  },
});

const login = createAction(
  Actions.LOGIN,
  /**
   * @param body data đăng nhập, thường là username và password
   * @param onFailure callback khi đăng nhập thất bại
   * @param onSucceeded callback khi đăng nhập thành công
   * @param isRemember có ghi nhớ tài khoản hay k
   */
  (
    body: FormLoginType,
    onFailure: (msg: string) => void,
    onSucceeded?: () => void,
    isRemember?: boolean,
  ) => ({
    payload: {
      body,
      onFailure,
      onSucceeded,
      isRemember,
    },
  }),
);

export const authenticationActions = {
  ...authenticationSlice.actions,
  login,
};
export const authenticationReducer = authenticationSlice.reducer;
