import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectContents = createSelector(
  (state: RootState) => state.content,
  content => content.contents,
);
