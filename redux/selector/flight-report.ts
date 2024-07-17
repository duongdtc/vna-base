import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultListFLReport = createSelector(
  (state: RootState) => state.flightReport,
  flightReport => flightReport.resultListFlightReport,
);
