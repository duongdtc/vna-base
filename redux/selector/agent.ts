import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';
import { getState } from '@vna-base/utils';

export const selectResultFilterAgent = createSelector(
  (state: RootState) => state.agent,
  agent => agent.resultFilter,
);

export const selectLoadingFilterAgent = createSelector(
  (state: RootState) => state.agent,
  agent => agent.loadingFilter,
);

export const selectLoadingLoadMoreAgent = createSelector(
  (state: RootState) => state.agent,
  agent => agent.loadingLoadMore,
);

export const selectAllAgent = createSelector(
  (state: RootState) => state.agent,
  agent => agent.allAgent,
);

export const selectListAgentType = createSelector(
  (state: RootState) => state.agent,
  agent => agent.listAgentType,
);

export const selectAllAgentType = createSelector(
  (state: RootState) => state.agent,
  agent => agent.allAgentType,
);

export const selectAgentType = (id?: string | null) =>
  id ? getState('agent').allAgentType[id] : undefined;

export const selectAllAgentGroup = createSelector(
  (state: RootState) => state.agent,
  agent => agent.allAgentGroup,
);

export const selectAgentGroup = (id?: string | null) =>
  id ? getState('agent').allAgentGroup[id] : undefined;

export const selectAgentDetailById = createSelector(
  (state: RootState) => state.agent,
  agent => agent.resultAgentDetail,
);
