import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectNotification = createSelector(
  (state: RootState) => state.flightSearch,
  flightSearch => flightSearch.notification,
);

export const selectCACodes = createSelector(
  (state: RootState) => state.flightSearch,
  flightSearch => flightSearch.CACodes,
);

export const selectSearchForm = createSelector(
  (state: RootState) => state.flightSearch,
  flightSearch => flightSearch.searchForm,
);

export const selectListRoute = createSelector(
  (state: RootState) => state.flightSearch,
  flightSearch => flightSearch.routes,
);
