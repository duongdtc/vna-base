/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { showToast } from '@vna-base/components';
import { agentActions } from '@vna-base/redux/action-slice';
import { Agent, AgentGroup, AgentType } from '@redux/type';
import { FormAgentDetail } from '@vna-base/screens/agent-detail/type';
import { FilterForm } from '@vna-base/screens/agent/type';
import { Data, SortType } from '@services/axios';
import { AgentLst, AgentTypeLst } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import {
  delay,
  getNameOfPhoto,
  PAGE_SIZE_AGENT,
  PathInServer,
  uploadFiles,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { Image } from 'react-native-image-crop-picker';
import { onProgressFile } from './file';
import { AxiosResponse } from 'axios';

const ObjFlags: Record<keyof Omit<FormAgentDetail, 'Logo'>, string> = {
  // Logo: 'agentAgentUpdateInfoCreate',
  GeneralTab: 'agentAgentUpdateInfoCreate',
  CompanyInfo: 'agentAgentUpdateCompanyCreate',
  ConfigTab: 'agentAgentUpdateConfigCreate',
};

const ObjFlagsRevert: Record<string, keyof FormAgentDetail> = {
  // agentAgentUpdateInfoCreate: 'Logo',
  agentAgentUpdateInfoCreate: 'GeneralTab',
  agentAgentUpdateCompanyCreate: 'CompanyInfo',
  agentAgentUpdateConfigCreate: 'ConfigTab',
};
export const runAgentListener = () => {
  takeLatestListeners()({
    actionCreator: agentActions.getListAgent,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(agentActions.changeLoadingFilter(true));

      const params = action.payload;

      listenerApi.dispatch(agentActions.savedFilterForm(params));

      const response = await Data.agentAgentGetListCreate({
        PageSize: PAGE_SIZE_AGENT,
        PageIndex: 1,
        OrderBy: params.OrderBy,
        SortType: params.SortType,
        Filter: params.Filter,
        GetAll: params.GetAll,
      });

      let data: Omit<
        AgentLst,
        'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
      > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

      if (validResponse(response)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Expired, StatusCode, Success, Message, Language, ...rest } =
          response.data;

        data = rest;
      }

      listenerApi.dispatch(agentActions.saveResultFilter(data));
      listenerApi.dispatch(agentActions.changeLoadingFilter(false));
    },
  });

  takeLatestListeners()({
    actionCreator: agentActions.loadMoreAgent,
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(agentActions.changeLoadingLoadMore(true));

      const { filterForm, resultFilter } = listenerApi.getState().agent;

      const form = {
        PageSize: PAGE_SIZE_AGENT,
        PageIndex: resultFilter!.PageIndex! + 1,
        OrderBy: filterForm!.OrderBy,
        SortType: filterForm!.SortType,
        GetAll: filterForm!.GetAll,
        Filter: filterForm!.Filter,
      };
      const response = await Data.agentAgentGetListCreate(form);

      if (validResponse(response)) {
        listenerApi.dispatch(agentActions.saveLoadMore(response.data));
      }

      listenerApi.dispatch(agentActions.changeLoadingLoadMore(false));
    },
  });

  takeLatestListeners()({
    actionCreator: agentActions.getListAgentType,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(agentActions.changeLoadingFilter(true));

      const params = action.payload;

      listenerApi.dispatch(agentActions.savedFilterForm(params));

      const response = await Data.agentTypeAgentTypeGetListCreate({
        PageSize: PAGE_SIZE_AGENT,
        PageIndex: 1,
        OrderBy: params.OrderBy,
        SortType: params.SortType ?? SortType.Desc,
        Filter: params.Filter,
      });

      let data: Omit<
        AgentTypeLst,
        'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
      > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

      if (validResponse(response)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Expired, StatusCode, Success, Message, Language, ...rest } =
          response.data;

        data = rest;
      }

      listenerApi.dispatch(agentActions.saveListAgentType(data));
      listenerApi.dispatch(agentActions.changeLoadingFilter(false));
    },
  });

  takeLatestListeners()({
    actionCreator: agentActions.getAllAgent,
    effect: async (_, listenerApi) => {
      // const res = await Data.agentAgentGetAllCreate({});
      const res = {
        data: {
          List: [
            {
              Id: '3C21376D-6948-49A7-86D2-13E1DE22FDB2',
              Index: 9578,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA9578',
              PrefixCode: null,
              CustomerID: 'GUESTS3',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Đỗ Duy',
              Password: null,
              Contact: null,
              Phone: '0123456789',
              Email: 'test@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-16T10:55:44.2',
              Status: 0,
              Active: false,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: '45CF7F8E-FAF4-48D2-BE8F-A1E4DE3ABA5A',
              Index: 9594,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: null,
              SISetId: null,
              AgentCode: 'VNA9594',
              PrefixCode: null,
              CustomerID: 'HNH123',
              AgentGroup: 'A94AFC14-01C9-4F04-88CB-0153FD4226A0',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Hoang Ngoc Ha',
              Password: null,
              Contact: 'Ha123',
              Phone: '0912456656',
              Email: 'Honghoang12@gmai.cin',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-27T16:03:21.01',
              Status: 0,
              Active: true,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: '4EE9438F-F763-4932-842B-E3BF2DCE4BFA',
              Index: 9586,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: 'C1844805-4B86-435D-B6AF-0AC538312BFE',
              AgentCode: 'VNA9586',
              PrefixCode: null,
              CustomerID: 'DC2828282',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'Tranh test',
              Password: null,
              Contact: 'Trang',
              Phone: '0916464644',
              Email: 'Thutrang602@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-27T15:18:24.59',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: true,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: '7E1FD0E1-B64E-4CA3-899C-5B5FD700B1C1',
              Index: 9576,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA9576',
              PrefixCode: null,
              CustomerID: 'GUEST2',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Duy Đỗ',
              Password: null,
              Contact: null,
              Phone: '0123456789',
              Email: 'test@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-16T10:43:24.49',
              Status: 0,
              Active: false,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: '7EF86E98-C24B-4BCC-A289-70A9FE701076',
              Index: 9579,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
              AgentCode: 'VNA9579',
              PrefixCode: null,
              CustomerID: 'TEST2',
              AgentGroup: '6295F3C0-71F5-42EA-AA26-26D0F0295906',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'tuandn2',
              Password: null,
              Contact: 'Tuấn',
              Phone: '0982412611',
              Email: 'tuandn@gmail.vn',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-19T14:29:01.17',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 10000000,
              Guarantee: 20000000,
              Deposit: 50000000,
              Balance: -2033000,
              UseAPI: false,
              UseB2B: true,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: true,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: '9781E84A-D9B4-482C-80C2-65AC0DB92659',
              Index: 9676,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: null,
              SISetId: null,
              AgentCode: 'VNA9676',
              PrefixCode: null,
              CustomerID: 'TRANGVNA',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Nguyen thu trang',
              Password: null,
              Contact: 'Trang',
              Phone: '0962893863',
              Email: 'Thutrang601@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-10-14T14:18:55.013',
              Status: 0,
              Active: true,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'A38A29EB-D987-4E11-B75C-9F15D8A91197',
              Index: 9580,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA9580',
              PrefixCode: null,
              CustomerID: 'TRANGTEST',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'nguyen thu trang',
              Password: null,
              Contact: null,
              Phone: '096546456',
              Email: 'thutrang601@gmail.com',
              Address: '37 Vinh Ho',
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-20T09:44:33.94',
              Status: 0,
              Active: false,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'A3B92327-0361-4243-912B-2115E1CEB2A7',
              Index: 4862,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
              AgentCode: 'VNA4862',
              PrefixCode: null,
              CustomerID: 'KH00001',
              AgentGroup: 'A94AFC14-01C9-4F04-88CB-0153FD4226A0',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'KHACH HANG TEST',
              Password: null,
              Contact: 'tester',
              Phone: '0312522362',
              Email: 'khach@khachhang.vn',
              Address: 'HN',
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: '/images/agent/uy2xeexr.jpeg',
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-03-20T08:38:29.653',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: 'TNHH',
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 1000000,
              Guarantee: 50000000,
              Deposit: 50000000,
              Balance: 482270400,
              UseAPI: false,
              UseB2B: true,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'CC36A0AD-459A-44DA-A9D2-8D8515416098',
              Index: 9568,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
              AgentCode: 'VNA9568',
              PrefixCode: null,
              CustomerID: 'DC11211',
              AgentGroup: '6295F3C0-71F5-42EA-AA26-26D0F0295906',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'Tuấn Test',
              Password: null,
              Contact: 'Tuấn',
              Phone: '0982412611',
              Email: 'tuandn@gmail.vn',
              Address: 'Số 2 Lê Văn Thiêm',
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-15T10:09:55.913',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 1000000,
              Guarantee: 5000000,
              Deposit: 50000000,
              Balance: 0,
              UseAPI: false,
              UseB2B: true,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: true,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'D0281CA8-1F0A-4666-89CE-E425D60FA908',
              Index: 4894,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA4894',
              PrefixCode: null,
              CustomerID: 'DC1710',
              AgentGroup: 'A94AFC14-01C9-4F04-88CB-0153FD4226A0',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'KH test',
              Password: null,
              Contact: 'naskfjf',
              Phone: '0123456798',
              Email: 'duy@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: '/images/agent/uffjkvyu.jpeg',
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-06-25T11:51:37.407',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 1000010000,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'DA4B5733-249B-43F4-AE0D-08DE30E0EFB3',
              Index: 4844,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA4844',
              PrefixCode: null,
              CustomerID: 'KH0098',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Mobile dev',
              Password: null,
              Contact: 'Info@mobile.com',
              Phone: '0395642250',
              Email: 'Mobile@gmail.com',
              Address: 'Ha Noi',
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-02-02T10:04:32.52',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: 'Movie company1',
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 1,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'DDAD07C3-069C-4D9B-9FC9-C41296C821D0',
              Index: 9585,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: null,
              SISetId: null,
              AgentCode: 'VNA9585',
              PrefixCode: null,
              CustomerID: 'DC5560',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Đỗ Đỗ',
              Password: null,
              Contact: 'HN',
              Phone: '0868245144',
              Email: 'duydn@gmail.com',
              Address: 'Hà nội',
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-27T09:36:13.103',
              Status: 0,
              Active: false,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'E46444BA-0274-41C5-AAD1-C6667929742E',
              Index: 4857,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA4857',
              PrefixCode: null,
              CustomerID: 'PHOENIX',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'Phoenix',
              Password: null,
              Contact: null,
              Phone: '0962893863',
              Email: 'thutrang601@gmail.com',
              Address: '105 lang ha',
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-02-28T17:01:26.837',
              Status: 0,
              Active: true,
              AllowSearch: true,
              AllowBook: true,
              AllowIssue: true,
              AllowVoid: true,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 300000000,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'E7B6A983-8C08-4C91-9E77-F11ACDD14384',
              Index: 9673,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: null,
              SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
              AgentCode: 'VNA9673',
              PrefixCode: null,
              CustomerID: 'NAMNC',
              AgentGroup: 'A94AFC14-01C9-4F04-88CB-0153FD4226A0',
              AgentType: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              AgentName: 'Nguyễn Cảnh Nam',
              Password: null,
              Contact: null,
              Phone: '0961284654',
              Email: 'canhnam@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-10-07T11:05:03.687',
              Status: 0,
              Active: true,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
            },
            {
              Id: 'F3C91443-ED5F-4C53-88BF-9EBF14C0ADFC',
              Index: 9575,
              ParentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
              SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
              AgentCode: 'VNA9575',
              PrefixCode: null,
              CustomerID: 'GUEST1',
              AgentGroup: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              AgentType: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              AgentName: 'Đỗ Duy',
              Password: null,
              Contact: null,
              Phone: '0132465798',
              Email: 'test@gmail.com',
              Address: null,
              Remark: null,
              Domain: null,
              Template: null,
              WebTmpl: null,
              WebVersion: null,
              Logo: null,
              ExpiryDate: '2030-01-01T00:00:00',
              CreatedDate: '2024-08-16T10:42:31.433',
              Status: 0,
              Active: false,
              AllowSearch: false,
              AllowBook: false,
              AllowIssue: false,
              AllowVoid: false,
              Company: null,
              TaxCode: null,
              BankNumb: null,
              BankName: null,
              StartupDate: null,
              ContractDate: null,
              Visible: true,
              CreditLimit: 0,
              Guarantee: 0,
              Deposit: 0,
              Balance: 0,
              UseAPI: false,
              UseB2B: false,
              UseB2C: false,
              UsePLG: false,
              UseWEB: false,
              EnableHotel: false,
              EnableCars: false,
              Insurances: false,
              ShowPolicy: false,
              SeparatePolicy: false,
              IBESet: null,
              Activities: [],
              Assignments: [],
              Contacts: [],
              Customers: [],
              Departments: [],
              Documents: [],
              Employees: [],
              InverseParent: [],
              Office: null,
              Offices: [],
              Parent: null,
              UserAccounts: [],
              UserActions: [],
              UserGroups: [],
              UserModules: [],
              WebConfigs: [],
              AdminUser: null,
              AdminPass: null,
              AgentLevel: null,
              RootAgent: null,
              GroupName: null,
              TypeName: null,
              OfficeName: null,
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
        const obj: Record<string, Agent> = {};
        res.data.List?.forEach(agent => {
          obj[agent.Id as string] = {
            ...agent,
            key: agent.Id!,
            t18n: agent.AgentName as I18nKeys,
          };
        });

        listenerApi.dispatch(agentActions.saveAllAgent(obj));
      }
    },
  });

  takeLatestListeners()({
    actionCreator: agentActions.getAllAgentType,
    effect: async (_, listenerApi) => {
      // const res = await Data.agentTypeAgentTypeGetAllCreate({});
      const res = {
        data: {
          List: [
            {
              Id: '16B434D0-CAFF-4B62-99C3-233C812B6563',
              Index: 1,
              ParentId: null,
              AgentId: null,
              Code: 'AGENCY',
              NameEn: 'Agency customers',
              NameVi: 'Đại lý bán vé',
              Default: true,
              Visible: true,
            },
            {
              Id: 'BFB625B8-6E82-478E-9DBC-72447711EEB7',
              Index: 2,
              ParentId: null,
              AgentId: null,
              Code: 'RETAIL',
              NameEn: 'Retail customers',
              NameVi: 'Khách hàng lẻ',
              Default: true,
              Visible: true,
            },
            {
              Id: 'D7C9CE97-C300-4EF6-B987-5FBA1AF157C3',
              Index: 4,
              ParentId: null,
              AgentId: null,
              Code: 'CORPORATE',
              NameEn: 'Corporate customers',
              NameVi: 'Khách doanh nghiệp',
              Default: true,
              Visible: true,
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

      const { language } = listenerApi.getState().app;

      if (validResponse(res)) {
        const obj: Record<string, AgentType> = {};
        res.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Code!,
            key: element.Id!,
            t18n: (language === 'vi'
              ? element.NameVi
              : element.NameEn) as I18nKeys,
          };
        });

        listenerApi.dispatch(agentActions.saveAllAgentType(obj));
      }
    },
  });

  takeLatestListeners()({
    actionCreator: agentActions.getAllAgentGroup,
    effect: async (_, listenerApi) => {
      // const res = await Data.agentGroupAgentGroupGetAllCreate({});
      const res = {
        data: {
          List: [
            {
              Id: 'A94AFC14-01C9-4F04-88CB-0153FD4226A0',
              Index: 1,
              ParentId: null,
              AgentId: null,
              Code: 'GENERAL',
              NameEn: 'General group',
              NameVi: 'Nhóm chung',
              Default: true,
              Visible: true,
            },
            {
              Id: '4B283A26-F3E6-4A07-81BB-1C496AC36FD7',
              Index: 4,
              ParentId: 'FDB06EEA-9A2A-43C2-8CD2-8508BCA21F13',
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'NORTHERN',
              NameEn: 'Northern agency group',
              NameVi: 'Nhóm đại lý miền Bắc',
              Default: false,
              Visible: true,
            },
            {
              Id: '7A3EB033-2220-44AC-98E2-F88F6AFC31EB',
              Index: 5,
              ParentId: 'A94AFC14-01C9-4F04-88CB-0153FD4226A0',
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'VIP',
              NameEn: 'VIP customers group',
              NameVi: 'Nhóm khách hàng VIP',
              Default: false,
              Visible: true,
            },
            {
              Id: '2206494C-9679-4954-8533-1E4D97C9B430',
              Index: 7,
              ParentId: null,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'DLMN',
              NameEn: null,
              NameVi: 'ĐẠI LÝ MIỀN NAM',
              Default: false,
              Visible: true,
            },
            {
              Id: '6A02C7E3-C608-4624-BA14-0D77015D6082',
              Index: 8,
              ParentId: null,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'HUNG',
              NameEn: "Hung's Group",
              NameVi: 'Nhóm Hưng',
              Default: false,
              Visible: true,
            },
            {
              Id: 'C3B2E2F5-614C-41FE-9B5E-145CE528ED85',
              Index: 9,
              ParentId: null,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'SOUTHERN',
              NameEn: null,
              NameVi: 'Nhóm đại lý miền Nam',
              Default: false,
              Visible: true,
            },
            {
              Id: 'D6C2EFF0-2DF9-46E1-8DEC-6F47DD6C5D2B',
              Index: 10,
              ParentId: null,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'WESTERN',
              NameEn: null,
              NameVi: 'Nhóm đại lý miền Tây',
              Default: false,
              Visible: true,
            },
            {
              Id: '65C762FF-E7D2-4EA9-B03C-A777510E86A6',
              Index: 11,
              ParentId: null,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'EASTERN',
              NameEn: null,
              NameVi: 'Nhóm đại lý miền Đông',
              Default: false,
              Visible: true,
            },
            {
              Id: '6295F3C0-71F5-42EA-AA26-26D0F0295906',
              Index: 1007,
              ParentId: null,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Code: 'TUANTEST',
              NameEn: 'TUANTEST',
              NameVi: 'Tuấn test',
              Default: false,
              Visible: true,
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

      const { language } = listenerApi.getState().app;

      if (validResponse(res)) {
        const obj: Record<string, AgentGroup> = {};
        res.data.List?.forEach(element => {
          obj[element.Id as string] = {
            ...element,
            description: element.Code!,
            key: element.Id!,
            t18n: (language === 'vi'
              ? element.NameVi
              : element.NameEn) as I18nKeys,
          };
        });

        listenerApi.dispatch(agentActions.saveAllAgentGroup(obj));
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: agentActions.getAgentDetailById,
    effect: async (actions, listenerApi) => {
      const { id } = actions.payload;
      const res = await Data.agentAgentGetByIdCreate({
        Id: id,
        Forced: true,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          agentActions.saveAgentDetailById(res.data.Item as Agent),
        );
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: agentActions.insertNewAgent,
    effect: async (actions, listenerApi) => {
      const { formNewAgent, cb } = actions.payload;
      const { filterForm } = listenerApi.getState().agent;

      const form = {
        PageSize: PAGE_SIZE_AGENT,
        PageIndex: 1,
        OrderBy: filterForm?.OrderBy,
        SortType: filterForm?.SortType,
        Filter: filterForm?.Filter,
        GetAll: filterForm?.GetAll,
      };

      if (!!formNewAgent?.Logo && typeof formNewAgent.Logo !== 'string') {
        const image = formNewAgent!.Logo as Image;
        let logo = '';
        const res = await uploadFiles(
          [
            {
              name: getNameOfPhoto(image, 'jpg'),
              size: image.size,
              type: image.mime,
              uri: image.path,
              fileCopyUri: image.path,
            },
          ],
          onProgressFile,
          PathInServer.AVATAR,
        );

        const success = res?.data?.reduce(
          (result, curr) => result || curr.status === 'fulfilled',
          false,
        );
        if (success && res!.data[0].status === 'fulfilled') {
          //@ts-ignore
          logo = JSON.parse(res!.data[0].value).FileUrl;
        } else {
          showToast({
            type: 'error',
            t18n: 'personal_info:update_avatar_failed',
          });
        }

        formNewAgent!.Logo = logo;
      }

      const res = await Data.agentAgentInsertCreate({
        //@ts-ignore
        Item: formNewAgent as Agent,
      });

      if (validResponse(res)) {
        showToast({
          type: 'success',
          t18n: 'common:done',
        });
        listenerApi.dispatch(agentActions.getListAgent(form as FilterForm));
      } else {
        showToast({
          type: 'error',
          t18n: 'common:failed',
        });
      }

      await delay(1000);
      cb();
    },
  });

  takeLatestListeners(true)({
    actionCreator: agentActions.deleteAgent,
    effect: async (actions, listenerApi) => {
      const { id, cb } = actions.payload;
      const { filterForm } = listenerApi.getState().agent;

      const form = {
        PageSize: PAGE_SIZE_AGENT,
        PageIndex: 1,
        OrderBy: filterForm?.OrderBy,
        SortType: filterForm?.SortType,
        Filter: filterForm?.Filter,
        GetAll: filterForm?.GetAll,
      };

      const res = await Data.agentAgentDeleteCreate({
        Id: id,
      });

      if (validResponse(res)) {
        showToast({
          type: 'success',
          t18n: 'common:done',
        });
        listenerApi.dispatch(agentActions.getListAgent(form as FilterForm));
      }

      await delay(1000);
      cb();
    },
  });

  takeLatestListeners(true)({
    actionCreator: agentActions.updateAgentDetail,
    effect: async (action, listenerApi) => {
      const { Id, form, dirtyFields, cb } = action.payload;

      const functionNames = {
        agentAgentUpdateInfoCreate: false,
        agentAgentUpdateCompanyCreate: false,
        agentAgentUpdateConfigCreate: false,
      };

      //check change iamge in server
      if (!!form.GeneralTab?.Logo && typeof form.GeneralTab.Logo !== 'string') {
        const image = form.GeneralTab!.Logo as Image;
        let logo = '';
        const res = await uploadFiles(
          [
            {
              name: getNameOfPhoto(image, 'jpg'),
              size: image.size,
              type: image.mime,
              uri: image.path,
              fileCopyUri: image.path,
            },
          ],
          onProgressFile,
          PathInServer.AVATAR,
        );

        const success = res?.data?.reduce(
          (result, curr) => result || curr.status === 'fulfilled',
          false,
        );
        if (success && res!.data[0].status === 'fulfilled') {
          //@ts-ignore
          logo = JSON.parse(res!.data[0].value).FileUrl;
        }

        form.GeneralTab!.Logo = logo;
      }

      Object.keys(dirtyFields).forEach(val => {
        //@ts-ignore
        functionNames[ObjFlags[val]] = true;
      });

      const { filterForm } = listenerApi.getState().agent;

      const responseAllSettled = await Promise.allSettled(
        Object.keys(functionNames)
          //@ts-ignore
          .filter(key => functionNames[key])
          .map(async key => {
            //@ts-ignore
            const response = await Data[key]({
              Item:
                typeof form[ObjFlagsRevert[key]] === 'object'
                  ? {
                      Id: Id,
                      //@ts-ignore
                      ...form[ObjFlagsRevert[key]],
                    }
                  : {
                      Id: Id,
                      [ObjFlagsRevert[key]]: form[ObjFlagsRevert[key]],
                    },
            });

            return response.data;
          }),
      );

      const isSuccess = responseAllSettled.reduce(
        (total, currRes) => total || currRes.status === 'fulfilled',
        true,
      );

      if (isSuccess) {
        listenerApi.dispatch(agentActions.getAgentDetailById(Id));
        listenerApi.dispatch(
          agentActions.getListAgent(
            filterForm ?? {
              OrderBy: 'CustomerID',
              SortType: SortType.Desc,
              Filter: [
                {
                  Contain: true,
                  Name: 'AgentCode',
                  Value: '',
                },
              ],
              GetAll: false,
            },
          ),
        );
        cb();
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: agentActions.restoreAgent,
    effect: async (actions, listenerApi) => {
      const { id, cb } = actions.payload;
      const { filterForm } = listenerApi.getState().agent;

      const form = {
        PageSize: PAGE_SIZE_AGENT,
        PageIndex: 1,
        OrderBy: filterForm?.OrderBy,
        SortType: filterForm?.SortType,
        Filter: filterForm?.Filter,
        GetAll: filterForm?.GetAll,
      };

      const res = await Data.agentAgentRestoreCreate({
        Id: id,
        Forced: true,
      });

      if (validResponse(res)) {
        showToast({
          type: 'success',
          t18n: 'common:done',
        });
        listenerApi.dispatch(agentActions.getListAgent(form as FilterForm));
      }

      await delay(1000);
      cb();
    },
  });

  takeLatestListeners(true)({
    actionCreator: agentActions.updateBalanceAgent,
    effect: async (actions, listenerApi) => {
      const { params, cb } = actions.payload;

      const res = await Data.agentAgentUpdateBalanceCreate({
        //@ts-ignore
        Item: params as Agent,
      });

      if (validResponse(res)) {
        showToast({
          type: 'success',
          t18n: 'common:done',
        });
        //@ts-ignore
        listenerApi.dispatch(agentActions.getAgentDetailById(params.Id));
      }

      await delay(1000);
      cb();
    },
  });
};
