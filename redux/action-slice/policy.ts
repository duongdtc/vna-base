/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Actions from '@redux-action-type';
import { PolicyState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { FilterForm } from '@vna-base/screens/policy/type';
import { Policy } from '@services/axios/axios-data';
import { PAGE_SIZE_BOOKING } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';
import { SLICE_NAME } from './constant';
import { PolicyDetailForm } from '@vna-base/screens/policy-detail/type';

const initialState: PolicyState = {
  resultFilter: { list: [], pageIndex: 1, totalPage: 1, totalItem: 0 },
  isLoadingFilter: true,
  filterForm: null,
  policyDetail: {},
};

const policySlice = createSlice({
  name: SLICE_NAME.POLICY,
  initialState: initialState,
  reducers: {
    saveResultFilter: (
      state,
      {
        payload,
      }: PayloadAction<{
        list: Array<Policy>;
        pageIndex: number;
        totalPage: number;
        totalItem: number;
      }>,
    ) => {
      state.resultFilter.pageIndex = payload.pageIndex;

      const newResult = cloneDeep(state.resultFilter.list);
      const idx = PAGE_SIZE_BOOKING * (payload.pageIndex - 1);

      newResult.splice(idx, newResult.length - idx, ...(payload.list ?? []));
      state.resultFilter.list = newResult;
      state.resultFilter.totalPage = payload.totalPage;
      state.resultFilter.totalItem = payload.totalItem;
    },
    changeIsLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingFilter = payload;
    },
    saveFilterForm: (state, { payload }: PayloadAction<FilterForm>) => {
      state.filterForm = payload;
    },
    savePolicyDetail: (state, { payload }: PayloadAction<Policy>) => {
      state.policyDetail = payload;
    },
  },
});

const getListPolicy = createAction(
  Actions.GET_LIST_POLICY,
  (payload: { form?: FilterForm; pageIndex?: number }) => ({
    payload,
  }),
);

const getPolicyDetail = createAction(Actions.POLICY_DETAIL, (id: string) => ({
  payload: { id },
}));

const deletePolicy = createAction(
  Actions.DELETE_POLICY,
  (id: string, cb: (isSuccess: boolean) => void) => ({
    payload: { id, cb },
  }),
);

const updatePolicy = createAction(
  Actions.UPDATE_POLICY,
  (form: PolicyDetailForm, cb: (isSuccess: boolean) => void) => ({
    payload: { form, cb },
  }),
);

const createPolicy = createAction(
  Actions.CREATE_POLICY,
  (form: PolicyDetailForm, cb: (isSuccess: boolean) => void) => ({
    payload: { form, cb },
  }),
);

const restorePolicy = createAction(
  Actions.RESTORE_POLICY,
  (id: string, cb: (isSuccess: boolean) => void) => ({
    payload: { id, cb },
  }),
);

export const policyActions = {
  ...policySlice.actions,
  getListPolicy,
  getPolicyDetail,
  deletePolicy,
  updatePolicy,
  createPolicy,
  restorePolicy,
};

export const policyReducer = policySlice.reducer;
