/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Office } from '@redux/type';
import { I18nKeys } from '@translations/locales';
import { officeActions } from '@vna-base/redux/action-slice';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runOfficeListener = () => {
  takeLatestListeners()({
    actionCreator: officeActions.getAllOffice,
    effect: async (_, listenerApi) => {
      // const response = await Data.officeOfficeGetAllCreate({});
      const response = {
        data: {
          List: [
            {
              Id: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              Index: 5,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: 'F12E7D4E-DA4B-423A-AA00-5A3AECEAA6A7',
              Code: 'DAD',
              Type: 'hdq',
              Name: 'Chi nhánh Đà Nẵng',
              Phone: '0123456798',
              Email: 'test@gmail.com',
              Address: null,
              Manager: 'Nguyễn Quang Minh',
              Description: null,
              Image: null,
              Grade: 1,
              Order: 4,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
              Index: 1,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: null,
              Code: 'HDQ',
              Type: 'hdq',
              Name: 'Trụ sở chính',
              Phone: '0975750088',
              Email: 'admin@gmail.vn',
              Address: null,
              Manager: 'Nguyễn Quang Minh',
              Description: 'Trụ sở chính',
              Image: null,
              Grade: 0,
              Order: 1,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: '486EBF3C-6327-4DBB-AB2D-CA13D47A4D72',
              Index: 11,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: null,
              Code: 'VDO',
              Type: 'brd',
              Name: 'Chi nhánh Quảng Ninh',
              Phone: '66773508',
              Email: 'vdo@quangninh.com.vn',
              Address: null,
              Manager: 'Nguyen van A',
              Description: null,
              Image: '/images/other/DC10899/1egjney4.jpg',
              Grade: 0,
              Order: 20,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: '7427C1E6-4EAE-4D6B-90B3-247CEE36B47E',
              Index: 6,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
              Code: 'PQC',
              Type: 'hdq',
              Name: 'Chi nhánh Phú Quốc',
              Phone: '0123456789',
              Email: 'test@gmail.com',
              Address: null,
              Manager: 'Nguyễn Quang Minh',
              Description: null,
              Image: null,
              Grade: 1,
              Order: 5,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: '75216383-5CD2-4A5B-8215-BD61823A3307',
              Index: 8,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
              Code: 'BMW',
              Type: 'brd',
              Name: 'Chi nhánh Buôn Mê Thuột',
              Phone: '0123456789',
              Email: 'test@gmail.com',
              Address: null,
              Manager: null,
              Description: null,
              Image:
                'https://resources.datacom.vn/data/images/avatar/mpdolrcf.png',
              Grade: 1,
              Order: 7,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: '9FA9E354-2B78-4D02-9190-6C82AE43440E',
              Index: 4,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: '75216383-5CD2-4A5B-8215-BD61823A3307',
              Code: 'HAN',
              Type: 'brd',
              Name: 'Chi nhánh Hà nội',
              Phone: '0123456789',
              Email: 'test@gmail.com',
              Address: null,
              Manager: 'Nguyễn Quang Minh',
              Description: null,
              Image: null,
              Grade: 2,
              Order: 3,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: 'A59734BA-8743-46F6-91E5-16CAB3A7C222',
              Index: 9,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              Code: 'VCL',
              Type: 'brd',
              Name: 'Chi nhánh Quảng Nam',
              Phone: '0123456789',
              Email: 'test@gmail.com',
              Address: null,
              Manager: 'Nguyễn Quang Minh',
              Description: null,
              Image: '/images/logo/5ghvzi1v.jpg',
              Grade: 0,
              Order: 8,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
              Parent: null,
              UserAccounts: [],
            },
            {
              Id: 'F12E7D4E-DA4B-423A-AA00-5A3AECEAA6A7',
              Index: 3,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              ParentId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
              Code: 'SGN',
              Type: 'brd',
              Name: 'Chi nhánh Sài Gòn',
              Phone: '098765432',
              Email: 'sgn@gmail.vn',
              Address: '123 Nam Kỳ Khởi Nghĩa, Tp. Hồ Chí Minh',
              Manager: 'Nguyễn Quang Thành',
              Description: 'Chi nhánh miền nam',
              Image: null,
              Grade: 2,
              Order: 2,
              Visible: true,
              Agent: null,
              Agents: [],
              Departments: [],
              Employees: [],
              InverseParent: [],
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

      if (validResponse(response)) {
        const obj: Record<string, Office> = {};
        response.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Description ?? '',
            key: element.Id!,
            t18n: element.Name as I18nKeys,
          };
        });

        listenerApi.dispatch(officeActions.saveAllOffices(obj));
      }
    },
  });
};
