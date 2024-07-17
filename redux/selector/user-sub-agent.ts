import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListUserSubAgentAccount = createSelector(
  (state: RootState) => state.userSubAgent,
  userSubAgent => userSubAgent.List,
);

export const selectUserSubAgent = createSelector(
  (state: RootState) => state.userSubAgent,
  userSubAgent => userSubAgent.userSubAgents,
);
