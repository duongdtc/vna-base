import { Data } from '@services/axios';
import { UserAccount } from '@services/axios/axios-data';
import { AccountRealm } from '@services/realm/models/account';
import { AgentRealm } from '@services/realm/models/agent';
import { realmRef } from '@services/realm/provider';
import { images } from '@vna-base/assets/image';
import {
  currentAccountActions,
  permissionActions,
} from '@vna-base/redux/action-slice';
import {
  generatePassword,
  load,
  logout,
  save,
  StorageKey,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import isEmpty from 'lodash.isempty';
import isNil from 'lodash.isnil';

export const runCurrentAccountListener = () => {
  takeLatestListeners()({
    actionCreator: currentAccountActions.getCurrentAccount,
    effect: async (action, listenerApi) => {
      const { cb } = action.payload;

      // const res = await Data.userAccountUserAccountGetByTokenCreate({
      //   Id: listenerApi.getState().authentication.token,
      //   Forced: true,
      // });

      const res = {
        data: {
          Message: null,
          Language: 'vi',
          CustomProperties: null,
          StatusCode: '000',
          Expired: false,
          Item: {
            ViewAllOffice: false,
            Photo: images.nvzudhoh,
            SISetId: '502E2325-FAB1-47B6-8D1E-BE075B6F02DE',
            ViewAllAccount: false,
            EmployeeId: null,
            Password: 'C5vv2gUexStpioibNIDrVA==',
            Index: 1172,
            UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
            Email: 'thongvt@gmail.com',
            AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
            LastLoginIP: '192.168.5.130',
            SuperAdmin: false,
            TokenExpiry: '2024-05-09T03:09:28.433',
            ViewCredit: true,
            AllowApprove: true,
            OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
            Office: null,
            Minify: false,
            LastLoginDate: '2024-10-29T22:26:52.523',
            Status: true,
            BookerCode: 'BKVN00001',
            TokenLogin: null,
            Visible: true,
            Phone: '0988777564',
            Employee: null,
            AllowVoid: true,
            AllowIssue: true,
            UserGroup: {
              Description: 'Nhóm tài khoản dành cho quản trị viên',
              InverseParent: [],
              Id: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
              AgentId: null,
              Name: 'Admin',
              Index: 1,
              Default: true,
              Parent: null,
              UserPermissions: [],
              Visible: true,
              UserAccounts: [null],
              ParentId: '5CFF5177-1796-495E-B723-7D18B2B21E91',
              Code: 'AD',
              Level: 2,
              Agent: null,
            },
            AllowSearch: true,
            FullName: 'Vu Trung Thong',
            Username: 'hungtk',
            AllowBook: true,
            Id: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
            Agent: {
              AgentLevel: 'F1',
              CustomerID: '',
              Guarantee: 0,
              Email: 'quangminh_1203@yahoo.com',
              ShowPolicy: false,
              Offices: [],
              WebVersion: '1.0',
              Office: null,
              AgentCode: 'DC10899',
              PrefixCode: 'VNA',
              AgentType: null,
              OfficeId: null,
              CreditLimit: 0,
              Balance: 0,
              Active: true,
              UseB2C: true,
              Id: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Parent: null,
              UserAccounts: [null],
              GroupName: null,
              Index: 2795,
              Contact: null,
              OfficeName: null,
              TypeName: null,
              Phone: '034345454953',
              InverseParent: [],
              AgentGroup: null,
              StartupDate: null,
              CreatedDate: '2019-12-11T00:00:00',
              Status: 1,
              Logo: '/images/agent/rvy54jp1.jpg',
              ContractDate: null,
              BankName: null,
              WebConfigs: [],
              Departments: [],
              AllowIssue: true,
              Visible: true,
              AllowSearch: true,
              Contacts: [],
              SeparatePolicy: true,
              AllowBook: true,
              Password: 'Hello kitty!',
              TaxCode: null,
              BankNumb: null,
              UseWEB: true,
              Template: null,
              EnableHotel: true,
              Activities: [],
              UsePLG: true,
              Customers: [],
              ExpiryDate: '2030-01-01T00:00:00',
              UserGroups: [],
              UseB2B: true,
              Assignments: [],
              UserActions: [],
              UserModules: [],
              UseAPI: true,
              Deposit: 0,
              RootAgent: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              Remark: null,
              AdminUser: null,
              AdminPass: null,
              Insurances: true,
              AllowVoid: true,
              IBESet: null,
              Domain: 'localhost:7136',
              WebTmpl: 'TEMP2',
              ParentId: null,
              Company: 'VNA',
              Employees: [],
              Address: '58 To Huu, Nam Tu Liem, Hanoi',
              SISetId: null,
              EnableCars: true,
              AgentName: 'Demo agent',
              Documents: [],
            },
            Remark: 'undefined',
          },
          Success: true,
        },
      };

      if (validResponse(res)) {
        save(StorageKey.SUB_AGENT_ID, '');
        save(StorageKey.USER_AGENT_ID, res.data.Item?.Id);

        const id = load(StorageKey.CURRENT_ACCOUNT_ID);

        if (isNil(id)) {
          logout();
        }

        const userAccount = realmRef.current?.objectForPrimaryKey<AccountRealm>(
          AccountRealm.schema.name,
          id,
        );

        listenerApi.dispatch(
          currentAccountActions.saveCurrentAccount(
            userAccount?.toJSON() as UserAccount,
          ),
        );

        const agent = realmRef.current?.objectForPrimaryKey<AgentRealm>(
          AgentRealm.schema.name,
          userAccount?.AgentId,
        );

        listenerApi.dispatch(
          currentAccountActions.saveBalanceInfo({
            balance: agent?.Balance ?? 0,
            creditLimit: agent?.CreditLimit ?? 0,
          }),
        );

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cb?.(res.data.Item!.Id!);
      } else {
        // thử lại 1 lần, cần 1 biến flag để đánh dấu số lần gọi, nếu flag =1 thì logout và in modal,
        // nếu không thì call lại api này lần nữa xem có được không
        logout();
        // thêm modal thông báo lấy thông tin không thành công
      }
    },
  });

  takeLatestListeners()({
    actionCreator: currentAccountActions.loadAccountData,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(
        currentAccountActions.getCurrentAccount(() => {
          listenerApi.dispatch(permissionActions.getListPermissionAccount());
          // listenerApi.dispatch(userAccountActions.getUserAccount(userId));
        }),
      );
    },
  });

  takeLatestListeners()({
    actionCreator: currentAccountActions.addBalance,
    effect: async action => {
      const { amount } = action.payload;

      const id = load(StorageKey.CURRENT_AGENT_ID);

      const agent = realmRef.current?.objectForPrimaryKey<AgentRealm>(
        AgentRealm.schema.name,
        id,
      );

      if (!isEmpty(agent)) {
        realmRef.current?.write(() => {
          if (!isEmpty(agent)) {
            agent.Balance = (agent.Balance ?? 0) + amount;
          }
        });
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: currentAccountActions.resetPassword,
    effect: async (actions, listenerApi) => {
      const { OldPassword, cb } = actions.payload;

      const { Id } = listenerApi.getState().currentAccount.currentAccount;

      const NewPassword = generatePassword(true, true, true, true, 10);

      const res = await Data.userAccountUserAccountChangePasswordCreate({
        UserId: Id,
        OldPassword: OldPassword,
        NewPassword: NewPassword,
      });

      if (validResponse(res)) {
        cb(NewPassword);
      } else {
        listenerApi.dispatch(
          currentAccountActions.setErrorMsgResetPassword(
            'reset_password:wrong_pass',
          ),
        );
      }
    },
  });
};
