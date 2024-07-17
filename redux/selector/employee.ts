import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListEmployeeByAgent = createSelector(
  (state: RootState) => state.employee,
  employee => employee.AllEmployeeOfAgent,
);

export const selectAllEmployee = createSelector(
  (state: RootState) => state.employee,
  employee => employee.AllEmployeeOfCurrentAccount,
);
