import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultFilterFlightTicket = createSelector(
  (state: RootState) => state.flightTicket,
  flightTicket => flightTicket.resultFilter,
);

export const selectIsLoadingFilterFlightTicket = createSelector(
  (state: RootState) => state.flightTicket,
  flightTicket => flightTicket.isLoadingFilter,
);
