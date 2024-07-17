import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListContactByAgentId = createSelector(
  (state: RootState) => state.contact,
  contact => contact.List,
);

export const selectContact = createSelector(
  (state: RootState) => state.contact,
  contact => contact.Contact,
);
