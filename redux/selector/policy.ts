import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultFilterPolicy = createSelector(
  (state: RootState) => state.policy,
  policy => policy.resultFilter,
);

export const selectIsLoadingFilterPolicy = createSelector(
  (state: RootState) => state.policy,
  policy => policy.isLoadingFilter,
);

export const selectPolicyDetail = createSelector(
  (state: RootState) => state.policy,
  policy => policy.policyDetail,
);
