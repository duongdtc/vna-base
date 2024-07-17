import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectIsMountedSplash = createSelector(
  (state: RootState) => state.splash,
  splash => splash.isMounted,
);
