import Actions from '@redux-action-type';
import { UserSubAgentState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAccount } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';
import { PersonalInfoForm } from '@vna-base/screens/personal-info/type';

const initState: UserSubAgentState = {
  List: [],
  userSubAgents: {},
};

const getListUserSubAgent = createAction(
  Actions.GET_LIST_USER_SUB_AGET,
  (agentId?: string, cb?: () => void) => ({
    payload: { agentId, cb },
  }),
);

const getUserSubAgentById = createAction(
  Actions.GET_USER_SUB_AGT,
  (id?: string) => ({
    payload: { id },
  }),
);

const insertUserSubAgt = createAction(
  Actions.INSERT_NEW_USER_SUB_AGT,
  (
    form: PersonalInfoForm,
    cb: (data: Pick<UserAccount, 'Username' | 'Password'>) => void,
  ) => ({
    payload: { form, cb },
  }),
);

const updateUserSubAgt = createAction(
  Actions.UPDATE_USER_SUB_AGT,
  (form: PersonalInfoForm, cbSuccess: () => void) => ({
    payload: { form, cbSuccess },
  }),
);

const resetUserSubAgt = createAction(
  Actions.RESET_PASS_USER_SUB_AGT,
  (
    id: string,
    cb: (data: Pick<UserAccount, 'Username' | 'Password'>) => void,
  ) => ({
    payload: { id, cb },
  }),
);

const deleteUserSubAgt = createAction(
  Actions.DELETE_USER_SUB_AGT,
  (id: string, agentId: string) => ({
    payload: { id, agentId },
  }),
);

const restoreUserSubAgt = createAction(
  Actions.RESTORE_USER_SUB_AGT,
  (id: string, agentId: string, cb: () => void) => ({
    payload: { id, agentId, cb },
  }),
);

const userSubAgentSlide = createSlice({
  name: SLICE_NAME.USER_SUB_AGENT,
  initialState: initState,
  reducers: {
    saveListUserSubAgentAccount: (
      state,
      { payload }: PayloadAction<Array<UserAccount>>,
    ) => {
      state.List = payload;
    },
    saveUserSubAgent: (state, { payload }: PayloadAction<UserAccount>) => {
      state.userSubAgents = payload;
    },
  },
});

export const userSubAgentReducer = userSubAgentSlide.reducer;
export const userSubAgentActions = {
  ...userSubAgentSlide.actions,
  getListUserSubAgent,
  getUserSubAgentById,
  insertUserSubAgt,
  updateUserSubAgt,
  resetUserSubAgt,
  deleteUserSubAgt,
  restoreUserSubAgt,
};
