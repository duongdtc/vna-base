/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showModalConfirm, showToast } from '@vna-base/components';
import {
  currentAccountActions,
  userAccountActions,
} from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { UserAccountLst } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import {
  delay,
  getNameOfPhoto,
  PAGE_SIZE_USER_ACCOUNT,
  PathInServer,
  uploadFiles,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { onProgressFile } from './file';
import { AxiosResponse } from 'axios';
import { FilterForm } from '@vna-base/screens/user-account/type';

export const runUserAccountListener = () => {
  takeLatestListeners()({
    actionCreator: userAccountActions.getListUserAccount,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(userAccountActions.changeLoadingFilter(true));

      const params = action.payload;

      listenerApi.dispatch(userAccountActions.savedFilterForm(params));

      const response = await fakeGetListUserAccount();
      // const response = await Data.userAccountUserAccountGetListCreate({
      //   PageSize: PAGE_SIZE_USER_ACCOUNT,
      //   PageIndex: 1,
      //   OrderBy: params.OrderBy,
      //   SortType: params.SortType,
      //   Filter: params.Filter,
      //   GetAll: params.GetAll,
      // });

      let data: Omit<
        UserAccountLst,
        'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
      > = { List: [], PageIndex: 1, PageSize: 1, TotalPage: 1, TotalItem: 0 };

      if (validResponse(response)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Expired, StatusCode, Success, Message, Language, ...rest } =
          response.data;

        data = rest;
      }

      listenerApi.dispatch(userAccountActions.saveResultFilter(data));
      listenerApi.dispatch(userAccountActions.changeLoadingFilter(false));
    },
  });

  // takeLatestListeners()({
  //   actionCreator: userAccountActions.getUserAccount,
  //   effect: async (action, listenerApi) => {
  //     const { id } = action.payload;

  //     const response = await Data.userAccountUserAccountGetByIdCreate({
  //       Id: id,
  //     });

  //     if (validResponse(response)) {
  //       listenerApi.dispatch(
  //         userAccountActions.saveUserAccount(response.data.Item!),
  //       );
  //     }
  //   },
  // });

  takeLatestListeners(true)({
    actionCreator: userAccountActions.updateUserAccount,
    effect: async (action, listenerApi) => {
      const {
        Id,
        Email,
        Photo,
        Phone,
        UserGroupId,
        FullName,
        Status,
        Remark,
        AllowBook,
        AllowIssue,
        AllowSearch,
        AllowVoid,
        SISetId,
      } = action.payload.form;
      const { cb } = action.payload;

      const { Photo: oldPhoto } =
        listenerApi.getState().userAccount.userAccounts[Id];

      const currId = listenerApi.getState().currentAccount.currentAccount.Id;

      let photo = oldPhoto;

      if (typeof Photo !== 'string' && !!Photo) {
        const resPhoto = await uploadFiles(
          [
            {
              name: getNameOfPhoto(Photo, 'jpg'),
              size: Photo.size,
              type: Photo.mime,
              uri: Photo.path,
              fileCopyUri: Photo.path,
            },
          ],
          onProgressFile,
          PathInServer.AVATAR,
        );

        const success = resPhoto?.data?.reduce(
          (result, curr) => result || curr.status === 'fulfilled',
          false,
        );
        if (success && resPhoto!.data[0].status === 'fulfilled') {
          //@ts-ignore
          photo = JSON.parse(resPhoto!.data[0].value).FileUrl;
        } else {
          showToast({
            type: 'error',
            t18n: 'personal_info:update_avatar_failed',
          });
        }
      }

      const response = await Data.userAccountUserAccountUpdateCreate({
        Item: {
          Id,
          Photo: photo,
          SISetId,
          Email,
          Phone,
          UserGroupId,
          FullName,
          Status,
          Remark,
          AllowBook,
          AllowIssue,
          AllowSearch,
          AllowVoid,
        },
      });

      if (validResponse(response)) {
        // load lại data mới
        listenerApi.dispatch(userAccountActions.getUserAccount(Id));

        // gọi callback nếu update user account không phải current account
        if (Id !== currId) {
          cb();
        }

        // nếu là tài khoản đang login thì call cả api để lấy lại current account
        if (Id === currId) {
          listenerApi.dispatch(currentAccountActions.getCurrentAccount());
        }

        showToast({
          type: 'success',
          t18n: 'common:update_done',
        });
      } else {
        showToast({
          type: 'error',
          t18n: 'common:update_failed',
        });
      }
    },
  });

  takeLatestListeners()({
    actionCreator: userAccountActions.loadMoreUserAccount,
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(userAccountActions.changeLoadingLoadMore(true));

      const { filterForm, resultFilter } = listenerApi.getState().userAccount;

      const form = {
        PageSize: PAGE_SIZE_USER_ACCOUNT,
        PageIndex: resultFilter!.PageIndex! + 1,
        OrderBy: filterForm!.OrderBy,
        SortType: filterForm!.SortType,
        GetAll: filterForm!.GetAll,
      };
      const response = await Data.userAccountUserAccountGetListCreate(form);

      if (validResponse(response)) {
        listenerApi.dispatch(userAccountActions.saveLoadMore(response.data));
      }

      listenerApi.dispatch(userAccountActions.changeLoadingLoadMore(false));
    },
  });

  takeLatestListeners(true)({
    actionCreator: userAccountActions.addNewUserAccount,
    effect: async (action, listenerApi) => {
      const { form, cbSuccess } = action.payload;

      let photo = '';

      if (typeof form.Photo !== 'string' && !!form.Photo) {
        const resPhoto = await uploadFiles(
          [
            {
              name: getNameOfPhoto(form.Photo, 'jpg'),
              size: form.Photo.size,
              type: form.Photo.mime,
              uri: form.Photo.path,
              fileCopyUri: form.Photo.path,
            },
          ],
          onProgressFile,
          PathInServer.AVATAR,
        );

        const success = resPhoto?.data?.reduce(
          (result, curr) => result || curr.status === 'fulfilled',
          false,
        );
        if (success && resPhoto!.data[0].status === 'fulfilled') {
          //@ts-ignore
          photo = JSON.parse(resPhoto!.data[0].value).FileUrl;
        } else {
          showToast({
            type: 'error',
            t18n: 'personal_info:update_avatar_failed',
          });
        }
      }

      const response = await Data.userAccountUserAccountInsertCreate({
        Item: {
          Id: form.Id,
          Photo: photo,
          SISetId: form.SISetId,
          Email: form.Email,
          Phone: form.Phone,
          UserGroupId: form.UserGroupId,
          FullName: form.FullName,
          Status: form.Status,
          Remark: form.Remark,
          AllowBook: form.AllowBook,
          AllowIssue: form.AllowIssue,
          AllowSearch: form.AllowSearch,
          AllowVoid: form.AllowVoid,
          AllowApprove: form.AllowApprove,
          Username: form.Username,
        },
      });

      const { filterForm } = listenerApi.getState().userAccount;

      if (validResponse(response)) {
        // load lại data mới
        listenerApi.dispatch(
          userAccountActions.getListUserAccount(filterForm!),
        );

        // // nếu là tài khoản đang login thì call cả api để lấy lại current account
        // if (Id === currId) {
        //   listenerApi.dispatch(authenticationActions.getCurrentAccount());
        // }

        showToast({
          type: 'success',
          t18n: 'common:success',
        });
        cbSuccess();
      } else {
        showToast({
          type: 'error',
          t18n: response.data.Message as I18nKeys,
        });
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: userAccountActions.deleteUserAccount,
    effect: async (actions, listenerApi) => {
      const { id } = actions.payload;

      const { filterForm } = listenerApi.getState().userAccount;

      const res = await Data.userAccountUserAccountDeleteCreate({
        Id: id,
      });

      if (validResponse(res)) {
        await delay(700);
        showModalConfirm({
          t18nTitle: 'agent_detail:deleted',
          t18nSubtitle: 'order_detail:sub_modal_confirm',
          t18nCancel: 'modal_confirm:close',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
        });
        listenerApi.dispatch(
          userAccountActions.getListUserAccount(filterForm!),
        );
      } else {
        showToast({
          type: 'error',
          t18n: 'common:failed',
        });
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: userAccountActions.resetPassUserAccount,
    effect: async (actions, _listenerApi) => {
      const { id, cb } = actions.payload;

      const res = await Data.userAccountUserAccountResetCreate({
        Id: id,
      });

      if (validResponse(res)) {
        cb({
          Username: res.data.Item?.Username,
          Password: res.data.Item?.Password,
        });
      } else {
        showToast({
          type: 'error',
          t18n: 'common:failed',
        });
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: userAccountActions.restoreUserAccount,
    effect: async (actions, listenerApi) => {
      const { id, cb } = actions.payload;

      const { filterForm } = listenerApi.getState().userAccount;

      const res = await Data.userAccountUserAccountRestoreCreate({
        Id: id,
      });

      if (validResponse(res)) {
        cb();
        listenerApi.dispatch(
          userAccountActions.getListUserAccount(filterForm!),
        );
      }
    },
  });
};

async function fakeGetListUserAccount(): Promise<
  AxiosResponse<UserAccountLst, any>
> {
  await delay(1000);

  return {
    data: {
      List: [
        {
          Id: '8BD60446-DD84-4DBF-8585-10FC28FD51F0',
          Index: 1225,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: '2633263D-86DF-4BEC-9398-706C0F61F04B',
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: false,
          Username: 'dinhnk',
          Password: '',
          Email: 'dinhnk@gmail.com',
          Phone: '0987624324',
          Remark: null,
          FullName: 'Nguyen Khac Dinh',
          Photo: null,
          LastLoginDate: '2024-07-09T13:48:00.683',
          LastLoginIP: '171.244.23.117',
          TokenLogin: null,
          TokenExpiry: '2024-07-05T09:07:08.917',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: true,
          ViewAllOffice: true,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '16/08/1992',
        },
        {
          Id: '46685558-2838-4967-8A75-FDFFCAF6EA7A',
          Index: 1115,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: null,
          SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
          SuperAdmin: false,
          Username: 'duydn',
          Password: '',
          Email: 'duydn@gmail.com',
          Phone: '0123456789',
          Remark: 'Đỗ Ngọc Duy',
          FullName: 'Đỗ Duy',
          Photo: null,
          LastLoginDate: '2024-07-08T15:43:33.507',
          LastLoginIP: '127.0.0.1',
          TokenLogin: null,
          TokenExpiry: '2024-06-21T09:11:16.053',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: false,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '13/12/1999',
        },
        {
          Id: '2BD1FEAF-044C-4DA2-8317-5BAF9D6E6524',
          Index: 1024,
          OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: null,
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: false,
          Username: 'namnc',
          Password: '',
          Email: 'canhnam@gmail.com',
          Phone: '0977656473',
          Remark: 'Test',
          FullName: 'Cảnh Nam',
          Photo: '/images/avatar/DC10899/we1tuleu.jpg',
          LastLoginDate: '2024-07-01T10:28:07.56',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: '2024-06-19T04:05:28.887',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: false,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '16/08/2000',
        },
        {
          Id: '7C4CE518-8C3F-4FF7-85B4-18995A6069B2',
          Index: 1251,
          OfficeId: '7427C1E6-4EAE-4D6B-90B3-247CEE36B47E',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: null,
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: false,
          Username: 'trangnt1',
          Password: '',
          Email: 'thutrang601@gmail.com',
          Phone: '0984625336',
          Remark: null,
          FullName: 'trangnt1',
          Photo: '/images/avatar/DC10899/slvbpniv.jpg',
          LastLoginDate: '2024-06-27T13:41:31.3',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: '2024-06-27T04:14:22.623',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: true,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nữ',
          Dob: '11/11/1996',
        },
        {
          Id: 'B7C4C3F2-729A-47BC-BD56-556897FAEADD',
          Index: 1169,
          OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: null,
          SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
          SuperAdmin: false,
          Username: 'thanhnq',
          Password: '',
          Email: 'nqthanh@gmail.com',
          Phone: '0903377456',
          Remark: null,
          FullName: 'Nguyễn Thành Lam',
          Photo: null,
          LastLoginDate: '2024-06-26T11:59:24.35',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: '2024-06-26T02:24:55.733',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: false,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '25/06/1998',
        },
        {
          Id: 'AEB6504F-9CD9-48D0-92F0-91AC04E525C6',
          Index: 1224,
          OfficeId: '486EBF3C-6327-4DBB-AB2D-CA13D47A4D72',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: null,
          SISetId: '15248905-CC05-4AB7-8B96-DC98882A028D',
          SuperAdmin: false,
          Username: 'vantrung113',
          Password: '',
          Email: 'vantrung113@gmail.com',
          Phone: '0912345678',
          Remark: 'Tờ Rung - Hồng Ngọc Hà',
          FullName: 'Nguyễn Trung Ngọc',
          Photo: null,
          LastLoginDate: '2024-06-26T10:08:52.44',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: '2024-06-26T03:08:23.853',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: true,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '16/08/1999',
        },
        {
          Id: '4EA55996-F652-4A32-8332-B1127A4939E4',
          Index: 4,
          OfficeId: '21301132-DE26-436B-8BC8-F4B02CF14BEA',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'C36B342A-378F-4488-A85D-8DDDAEA2C8FC',
          EmployeeId: null,
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: false,
          Username: 'minhnq',
          Password: '',
          Email: 'minhnq@gmail.com',
          Phone: '097698875',
          Remark: null,
          FullName: 'Nguyễn Minh Nam',
          Photo: '/images/avatar/DC10899/dbb4egkk.jpg',
          LastLoginDate: '2024-06-19T17:29:19.78',
          LastLoginIP: '127.0.0.1',
          TokenLogin: null,
          TokenExpiry: '2023-09-02T16:07:38.87',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: true,
          ViewAllOffice: true,
          ViewAllAccount: true,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '04/03/1988',
        },
        {
          Id: '0964911D-C606-4BF7-BEE4-8C8C04D8A947',
          Index: 1228,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: 'BD592C36-3C9E-4E6B-AD03-9AC00041B3CB',
          EmployeeId: null,
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: false,
          Username: 'duongnv',
          Password: '',
          Email: 'duongthptnt@gmail.com',
          Phone: '0396678842',
          Remark: null,
          FullName: 'Nguyen Van Duong',
          Photo: '/images/avatar/DC10899/wbehlabg.png',
          LastLoginDate: '2024-06-17T11:31:48.553',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: null,
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: false,
          AllowVoid: true,
          AllowApprove: false,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nam',
          Dob: '03/11/2001',
        },
        {
          Id: '2147049F-4930-465F-955E-DE4147D29B6D',
          Index: 1025,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: '5CFF5177-1796-495E-B723-7D18B2B21E91',
          EmployeeId: null,
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: true,
          Username: 'lybt',
          Password: '',
          Email: 'lybt@gmail.com',
          Phone: '0356789423',
          Remark: 'Tài khoản hệ Cert 1',
          FullName: 'Bùi Thảo Ly',
          Photo: null,
          LastLoginDate: '2024-06-13T09:34:58.357',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: '2024-05-28T07:17:15.033',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: true,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nữ',
          Dob: '11/03/1995',
        },
        {
          Id: '18752066-36AC-44BD-8182-232A007A68B9',
          Index: 1027,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          UserGroupId: '5CFF5177-1796-495E-B723-7D18B2B21E91',
          EmployeeId: null,
          SISetId: '620FC274-1782-4A64-BC62-7963F2D43A26',
          SuperAdmin: true,
          Username: 'Maimtn',
          Password: '',
          Email: 'maimtn@gmail.com',
          Phone: '0900385734',
          Remark: null,
          FullName: 'Mai Thị Ngọc Mai',
          Photo: null,
          LastLoginDate: '2024-06-07T10:00:44.403',
          LastLoginIP: '115.146.122.52',
          TokenLogin: null,
          TokenExpiry: '2024-05-06T06:53:54.753',
          Status: true,
          Visible: true,
          AllowSearch: true,
          AllowBook: true,
          AllowIssue: true,
          AllowVoid: true,
          AllowApprove: true,
          ViewAllOffice: false,
          ViewAllAccount: false,
          Minify: false,
          Agent: null,
          Employee: null,
          Office: null,
          UserGroup: null,
          Gender: 'Nữ',
          Dob: '16/08/1996',
        },
      ],
      TotalItem: 29,
      TotalPage: 3,
      PageIndex: 2,
      PageSize: 10,
      HasPreviousPage: true,
      HasNextPage: false,
      OrderBy: 'LastLoginDate',
      SortType: 'Desc',
      GetAll: false,
      Filter: null,
      StatusCode: '000',
      Success: true,
      Expired: false,
      Message: null,
      Language: 'vi',
      CustomProperties: undefined,
    },
  };
}
