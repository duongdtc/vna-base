import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';
import { getState } from '@vna-base/utils';

export const selectResultListUserGroup = createSelector(
  (state: RootState) => state.userGroup,
  userGroup => userGroup.resultListUserGroup,
);

export const selectLoadingFilterUserGroup = createSelector(
  (state: RootState) => state.userGroup,
  userGroup => userGroup.loadingFilter,
);

export const selectUserGroup = createSelector(
  (state: RootState) => state.userGroup,
  userGroup => userGroup.UserGroup,
);

export const selectAllUserGroups = createSelector(
  (state: RootState) => state.userGroup,
  userGroup => userGroup.allUserGroups,
);

export const selectUserGroupById = (id?: string | null) =>
  id ? getState('userGroup').allUserGroups[id] : undefined;
