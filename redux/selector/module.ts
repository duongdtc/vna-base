import { RootState } from '@store/all-reducers';
import { createSelector } from '@reduxjs/toolkit';

export const selectAllModule = createSelector(
  (state: RootState) => state.module,
  module => module.all,
);
export const selectSideBarModule = createSelector(
  (state: RootState) => state.module,
  module => module.sideBar,
);
