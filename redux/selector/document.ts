import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListDocumentByAgentId = createSelector(
  (state: RootState) => state.document,
  document => document.List,
);

export const selectDocument = createSelector(
  (state: RootState) => state.document,
  document => document.Document,
);
