import Actions from '@vna-base/redux/action-type';
import { UserGroup, UserGroupState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { FilterFormUserGroup } from '@vna-base/screens/agent-detail/type';
import {
  UserGroup as UserGroupAxios,
  UserGroupLst,
} from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: UserGroupState = {
  resultListUserGroup: {},
  UserGroup: {},
  loadingFilter: true,
  filterForm: null,
  allUserGroups: {},
};

const userGroupSlice = createSlice({
  name: SLICE_NAME.USER_GROUP,
  initialState: initialState,
  reducers: {
    saveListUserGroup: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          UserGroupLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.resultListUserGroup = payload;
    },
    saveUserGroup: (state, { payload }: PayloadAction<UserGroupAxios>) => {
      state.UserGroup = payload;
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },
    savedFilterForm: (
      state,
      { payload }: PayloadAction<FilterFormUserGroup | null>,
    ) => {
      state.filterForm = payload;
    },
    saveAllUserGroups: (
      state,
      { payload }: PayloadAction<Record<string, UserGroup>>,
    ) => {
      state.allUserGroups = payload;
    },
  },
});

const getListUserGroup = createAction(
  Actions.GET_LIST_USER_GROUP,
  (params: FilterFormUserGroup) => ({
    payload: params,
  }),
);

const getUserGroupDetailById = createAction(
  Actions.GET_USER_GROUP_DETAIL_BY_ID,
  (id: string) => ({
    payload: { id },
  }),
);

const getAllUserGroups = createAction(Actions.GET_ALL_USER_GROUP, () => ({
  payload: undefined,
}));

export const userGroupActions = {
  ...userGroupSlice.actions,
  getListUserGroup,
  getUserGroupDetailById,
  getAllUserGroups,
};

export const userGroupReducer = userGroupSlice.reducer;
