import { employeeActions } from '@redux-slice';
import { Data } from '@services/axios';
import { Employee } from '@services/axios/axios-data';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: employeeActions.getAllEmployeeOfAgent,
  effect: async (action, listenerApi) => {
    const agtId = action.payload;
    const res = await Data.employeeEmployeeGetByAgentCreate({
      Id: agtId,
      Forced: true,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        employeeActions.saveListEmployeeByAgent(
          res.data.List as Array<Employee>,
        ),
      );
    }
  },
});

takeLatestListeners()({
  actionCreator: employeeActions.getAllEmployeeOfCurrentAccount,
  effect: async (action, listenerApi) => {
    const res = await Data.employeeEmployeeGetAllCreate({});

    if (validResponse(res)) {
      listenerApi.dispatch(
        employeeActions.saveAllEmployee(res.data.List as Array<Employee>),
      );
    }
  },
});
