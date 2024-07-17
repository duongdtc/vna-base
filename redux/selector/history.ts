import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListHistory = createSelector(
  (state: RootState) => state.history,
  history => history.listHistory,
);

export const selectDetailHistory = (id: string) =>
  createSelector(
    (state: RootState) => state.history.historyDetails,
    historyDetails => historyDetails[id],
  );

export const selectIsLoadingListHistory = createSelector(
  (state: RootState) => state.history,
  history => history.isLoadingListHistory,
);
