import { employeeActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { Employee } from '@services/axios/axios-data';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runEmployeeListener = () => {
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
      // const res = await Data.employeeEmployeeGetAllCreate({});
      const res = {
        data: {
          List: [
            {
              Id: '4B2B411C-4017-4BA7-BB28-4B3E6B3AA23A',
              Index: 10,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: null,
              OfficeId: null,
              DepartmentId: null,
              FullName: null,
              Gender: 0,
              Email: null,
              Phone: null,
              Address: null,
              HomeTown: null,
              Remark: null,
              Photo: null,
              Background: null,
              DateOfBirth: null,
              Position: null,
              Title: null,
              Grade: 0,
              ZaloId: null,
              ViberId: null,
              SkypeId: null,
              TelegramId: null,
              Website: null,
              Visible: true,
              Activities: [],
              Agent: null,
              Assignments: [],
              Department: null,
              InverseParent: [],
              Office: null,
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: 'CB8F788B-237D-475D-BA43-9305FFA79F78',
              Index: 9,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: null,
              OfficeId: null,
              DepartmentId: null,
              FullName: null,
              Gender: 0,
              Email: null,
              Phone: null,
              Address: null,
              HomeTown: null,
              Remark: null,
              Photo: null,
              Background: null,
              DateOfBirth: null,
              Position: null,
              Title: null,
              Grade: 0,
              ZaloId: null,
              ViberId: null,
              SkypeId: null,
              TelegramId: null,
              Website: null,
              Visible: true,
              Activities: [],
              Agent: null,
              Assignments: [],
              Department: null,
              InverseParent: [],
              Office: null,
              Parent: null,
              UserAccounts: [],
            },
          ],
          TotalItem: 0,
          TotalPage: 0,
          PageIndex: 0,
          PageSize: 0,
          HasPreviousPage: false,
          HasNextPage: false,
          OrderBy: null,
          SortType: null,
          GetAll: false,
          Filter: null,
          StatusCode: '000',
          Success: true,
          Expired: false,
          Message: null,
          Language: 'vi',
          CustomProperties: null,
        },
      };

      if (validResponse(res)) {
        listenerApi.dispatch(
          employeeActions.saveAllEmployee(res.data.List as Array<Employee>),
        );
      }
    },
  });
};
