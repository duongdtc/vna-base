import Actions from '@redux-action-type';
import { DBSContentState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Content, ContentLst } from '@services/axios/axios-email';
import { SLICE_NAME } from './constant';
import { PAGE_SIZE_DBS_CONTENT } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';

const initState: DBSContentState = {
  SpecializedNews: {},
  OutStandingPolicy: {},
  loadingSpecializeNews: true,
  loadingPolicy: true,
  detailContent: {},
};

const dbsContentSlide = createSlice({
  name: SLICE_NAME.DBS_CONTENT,
  initialState: initState,
  reducers: {
    saveListSpecializeNews: (
      state,
      {
        payload,
      }: PayloadAction<Pick<ContentLst, 'List' | 'PageIndex' | 'TotalPage'>>,
    ) => {
      state.SpecializedNews.PageIndex = payload.PageIndex;

      const newResult = cloneDeep(state.SpecializedNews.List) ?? [];
      const idx = PAGE_SIZE_DBS_CONTENT * (payload.PageIndex! - 1);

      newResult.splice(idx, newResult.length - idx, ...(payload.List ?? []));
      state.SpecializedNews.List = newResult;
    },
    saveListOutStandingPolicy: (
      state,
      {
        payload,
      }: PayloadAction<Pick<ContentLst, 'List' | 'PageIndex' | 'TotalPage'>>,
    ) => {
      state.OutStandingPolicy.PageIndex = payload.PageIndex;

      const newResult = cloneDeep(state.OutStandingPolicy.List) ?? [];
      const idx = PAGE_SIZE_DBS_CONTENT * (payload.PageIndex! - 1);

      newResult.splice(idx, newResult.length - idx, ...(payload.List ?? []));
      state.OutStandingPolicy.List = newResult;
    },

    changeLoadingSpecializeNews: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.loadingSpecializeNews = payload;
    },
    changeLoadingPolicy: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingPolicy = payload;
    },

    saveDetailContent: (
      state,
      { payload }: PayloadAction<Record<string, Content>>,
    ) => {
      state.detailContent = { ...state.detailContent, ...payload };
    },
  },
});

const getListSpecializeNews = createAction(
  Actions.GET_LIST_SPECIALIZE_NEWS,
  (pageIndex?: number) => ({
    payload: { pageIndex },
  }),
);

const getListOutStandingPolicy = createAction(
  Actions.GET_LIST_OUTSTANDING_POLICY,
  (pageIndex?: number) => ({
    payload: { pageIndex },
  }),
);

const getDetailDBSContent = createAction(
  Actions.GET_DETAIL_DBS_CONTENT,
  (id: string) => ({
    payload: { id },
  }),
);

export const dbsContentReducer = dbsContentSlide.reducer;
export const dbsContentActions = {
  ...dbsContentSlide.actions,
  getListSpecializeNews,
  getListOutStandingPolicy,
  getDetailDBSContent,
};
