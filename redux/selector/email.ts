import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectEmail = createSelector(
  (state: RootState) => state.email,
  email => email.email,
);

export const selectETickets = createSelector(
  (state: RootState) => state.email,
  email => email.eTickets,
);

export const selectIsLoadingEmail = createSelector(
  (state: RootState) => state.email,
  email => email.isLoadingEmail,
);

export const selectIsLoadingETicket = createSelector(
  (state: RootState) => state.email,
  email => email.isLoadingETicket,
);
