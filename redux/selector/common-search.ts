import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultSearch = createSelector(
  (state: RootState) => state.commonSearch,
  commonSearch => commonSearch.resultSearch,
);

export const selectLoadingCommonSearch = createSelector(
  (state: RootState) => state.commonSearch,
  commonSearch => commonSearch.loadingSearch,
);
