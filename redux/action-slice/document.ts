import Actions from '@redux-action-type';
import { DocumentState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initState: DocumentState = {
  List: [],
  Document: {},
};

const getListDocumentByAgentId = createAction(
  Actions.GET_LIST_DOCUMENT_BY_AGENT_ID,
  (agentId?: string, cb?: () => void) => ({
    payload: { agentId, cb },
  }),
);

const getDocument = createAction(Actions.GET_DOCUMENT, (id?: string) => ({
  payload: { id },
}));

const deleteDocument = createAction(
  Actions.DELETE_DOCUMENT,
  (id: string, agentId: string, fileName: string) => ({
    payload: { id, agentId, fileName },
  }),
);

const documentSlide = createSlice({
  name: SLICE_NAME.DOCUMENT,
  initialState: initState,
  reducers: {
    saveListDocumentByAgentId: (
      state,
      { payload }: PayloadAction<Array<Document>>,
    ) => {
      state.List = payload;
    },
    saveDocument: (state, { payload }: PayloadAction<Document>) => {
      state.Document = payload;
    },
  },
});

export const documentReducer = documentSlide.reducer;
export const documentActions = {
  ...documentSlide.actions,
  getListDocumentByAgentId,
  getDocument,
  deleteDocument,
};
