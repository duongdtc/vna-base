import Actions from '@redux-action-type';
import { PermissionsState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { UserPermission } from '@services/axios/axios-data';
import { Rule } from '@services/casl/type';
import { SLICE_NAME } from './constant';

const initialState: PermissionsState = {
  isLoadedPermission: false,
  /**
   * use for CASL authentication
   */
  permission: null,
  /**
   *  use for UI
   */
  listPermissionAccount: [],

  allPermissions: [],
};

const permissionSlice = createSlice({
  name: SLICE_NAME.PERMISSIONS,
  initialState: initialState,
  reducers: {
    savePermission: (state, { payload }: PayloadAction<Array<Rule>>) => {
      state.permission = payload;
    },
    saveListPermissionAccount: (
      state,
      { payload }: PayloadAction<UserPermission[]>,
    ) => {
      state.listPermissionAccount = payload;
    },
    saveAllPermission: (
      state,
      { payload }: PayloadAction<UserPermission[]>,
    ) => {
      state.allPermissions = payload;
    },
    changeIsLoadedPermission: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadedPermission = payload;
    },
  },
});

const getListPermissionAccount = createAction(
  Actions.GET_ACCOUNT_PERMISSION,
  (cb?: () => void) => ({
    payload: { cb },
  }),
);

const getAllPermission = createAction(Actions.GET_ALL_PERMISSION, () => ({
  payload: null,
}));

export const permissionActions = {
  ...permissionSlice.actions,
  getAllPermission,
  getListPermissionAccount,
};
export const permissionReducer = permissionSlice.reducer;
