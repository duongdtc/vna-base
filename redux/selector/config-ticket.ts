import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectConfigTicket = createSelector(
  (state: RootState) => state.configTicket,
  configTicket => configTicket.configTicket,
);

export const selectTicketTemplates = createSelector(
  (state: RootState) => state.configTicket,
  configTicket => configTicket.templates,
);

export const selectConfigTicketLanguages = createSelector(
  (state: RootState) => state.configTicket,
  configTicket => configTicket.languages,
);
