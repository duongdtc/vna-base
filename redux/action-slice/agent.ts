/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Actions from '@redux-action-type';
import { Agent, AgentGroup, AgentState, AgentType } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { FormNewAgentType } from '@vna-base/screens/add-new-agent/type';
import { FormAgentDetail } from '@vna-base/screens/agent-detail/type';
import { FilterForm } from '@vna-base/screens/agent/type';
import { CreditInfoForm } from '@vna-base/screens/credit-info/type';
import {
  AgentLst,
  AgentTypeLst,
  Agent as AgentAxios,
} from '@services/axios/axios-data';
import { FieldNamesMarkedBoolean } from 'react-hook-form';
import { SLICE_NAME } from './constant';

const initialState: AgentState = {
  resultFilter: {},
  loadingFilter: true,
  loadingLoadMore: false,
  filterForm: null,
  listAgentType: {},
  allAgentType: {},
  allAgentGroup: {},
  resultAgentDetail: {},
  allAgent: {},
};

const agentSlice = createSlice({
  name: SLICE_NAME.AGENT,
  initialState: initialState,
  reducers: {
    saveResultFilter: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          AgentLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.resultFilter = payload;
    },
    saveLoadMore: (state, { payload }: PayloadAction<AgentLst>) => {
      state.resultFilter.PageIndex = payload.PageIndex;
      state.resultFilter.List = state.resultFilter.List?.concat(payload.List!);
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },
    changeLoadingLoadMore: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingLoadMore = payload;
    },
    savedFilterForm: (state, { payload }: PayloadAction<FilterForm | null>) => {
      state.filterForm = payload;
    },
    saveListAgentType: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          AgentTypeLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.listAgentType = payload;
    },
    saveAllAgentType: (
      state,
      { payload }: PayloadAction<Record<string, AgentType>>,
    ) => {
      state.allAgentType = payload;
    },
    saveAllAgentGroup: (
      state,
      { payload }: PayloadAction<Record<string, AgentGroup>>,
    ) => {
      state.allAgentGroup = payload;
    },
    saveAgentDetailById: (state, { payload }: PayloadAction<AgentAxios>) => {
      state.resultAgentDetail = payload;
    },
    saveAllAgent: (
      state,
      { payload }: PayloadAction<Record<string, Agent>>,
    ) => {
      state.allAgent = payload;
    },
  },
});

const getListAgent = createAction(
  Actions.GET_LIST_AGENT,
  (params: FilterForm) => ({
    payload: params,
  }),
);

const loadMoreAgent = createAction(Actions.LOAD_MORE_AGENT, () => ({
  payload: undefined,
}));

const getAllAgent = createAction(Actions.GET_ALL_AGENT, () => ({
  payload: undefined,
}));

const getListAgentType = createAction(
  Actions.GET_LIST_AGENT_TYPE,
  (params: FilterForm) => ({
    payload: params,
  }),
);

const getAllAgentType = createAction(Actions.GET_ALL_AGENT_TYPE, () => ({
  payload: undefined,
}));

const getAllAgentGroup = createAction(Actions.GET_ALL_AGENT_GROUP, () => ({
  payload: undefined,
}));

const getAgentDetailById = createAction(
  Actions.GET_AGENT_DETAIL_BY_ID,
  (id: string) => ({
    payload: { id },
  }),
);

const insertNewAgent = createAction(
  Actions.INSERT_NEW_AGENT,
  (formNewAgent: FormNewAgentType, cb: () => void) => ({
    payload: { formNewAgent, cb },
  }),
);

const deleteAgent = createAction(
  Actions.DELETE_AGENT,
  (id: string, cb: () => void) => ({
    payload: { id, cb },
  }),
);

const updateAgentDetail = createAction(
  Actions.UPDATE_AGENT_DETAIL,
  (
    Id: string,
    form: FormAgentDetail,
    dirtyFields: FieldNamesMarkedBoolean<FormAgentDetail>,
    cb: () => void,
  ) => ({
    payload: { Id, form, dirtyFields, cb },
  }),
);

const restoreAgent = createAction(
  Actions.RESTORE_AGENT,
  (id: string, cb: () => void) => ({
    payload: { id, cb },
  }),
);

const updateBalanceAgent = createAction(
  Actions.UPDATE_BALANCE,
  (params: CreditInfoForm, cb: () => void) => ({
    payload: { params, cb },
  }),
);

export const agentActions = {
  ...agentSlice.actions,
  getListAgent,
  getAllAgent,
  getListAgentType,
  getAllAgentType,
  getAllAgentGroup,
  getAgentDetailById,
  loadMoreAgent,
  insertNewAgent,
  deleteAgent,
  updateAgentDetail,
  restoreAgent,
  updateBalanceAgent,
};

export const agentReducer = agentSlice.reducer;
