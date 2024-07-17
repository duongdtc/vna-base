import Actions from '@redux-action-type';
import { ContentState } from '@redux/type';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { Content } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: ContentState = {
  contents: [],
};

const contentSlice = createSlice({
  name: SLICE_NAME.CONTENT,
  initialState: initialState,
  reducers: {},
});

const updateOrInsert = createAction(
  Actions.CONTENT_INSERT_OR_UPDATE,
  (contents: Array<Content>, cb?: (isSuccess: boolean) => void) => ({
    payload: { contents, cb },
  }),
);

const deleteContent = createAction(
  Actions.DELETE_CONTENT,
  (contentIds: Array<string>, cb?: (isSuccess: boolean) => void) => ({
    payload: { contentIds, cb },
  }),
);

export const contentActions = {
  ...contentSlice.actions,
  updateOrInsert,
  deleteContent,
};

export const contentReducer = contentSlice.reducer;
