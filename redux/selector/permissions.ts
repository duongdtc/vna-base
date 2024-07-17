import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

/**
 * use for CASL authentication
 */
export const selectPermission = createSelector(
  (state: RootState) => state.permissions,
  permissions => permissions.permission,
);

export const selectIsLoadedPermission = createSelector(
  (state: RootState) => state.permissions,
  permissions => permissions.isLoadedPermission,
);

/**
 * use for UI
 */
export const selectListPermission = createSelector(
  (state: RootState) => state.permissions,
  permissions => permissions.listPermissionAccount,
);

export const selectAllPermission = createSelector(
  (state: RootState) => state.permissions,
  permissions => permissions.allPermissions,
);
