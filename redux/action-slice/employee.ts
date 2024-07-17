import Actions from '@redux-action-type';
import { EmployeeState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Employee } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: EmployeeState = {
  AllEmployeeOfCurrentAccount: [],
  AllEmployeeOfAgent: [],
};

const employeeSlice = createSlice({
  name: SLICE_NAME.EMPLOYEE,
  initialState: initialState,
  reducers: {
    saveListEmployeeByAgent: (
      state,
      { payload }: PayloadAction<Array<Employee>>,
    ) => {
      state.AllEmployeeOfAgent = payload;
    },
    saveAllEmployee: (state, { payload }: PayloadAction<Array<Employee>>) => {
      state.AllEmployeeOfCurrentAccount = payload;
    },
  },
});

const getAllEmployeeOfAgent = createAction(
  Actions.GET_LIST_EMPLOYEE_BY_AGENT,
  (agtId: string) => ({
    payload: agtId,
  }),
);

const getAllEmployeeOfCurrentAccount = createAction(
  Actions.GET_ALL_EMPLOYEE_OF_CURRENT_ACCOUNT,
  () => ({
    payload: undefined,
  }),
);

export const employeeActions = {
  ...employeeSlice.actions,
  getAllEmployeeOfAgent,
  getAllEmployeeOfCurrentAccount,
};

export const employeeReducer = employeeSlice.reducer;
