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

export const runUserAccountListener = () => {
  takeLatestListeners()({
    actionCreator: userAccountActions.getListUserAccount,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(userAccountActions.changeLoadingFilter(true));

      const params = action.payload;

      listenerApi.dispatch(userAccountActions.savedFilterForm(params));

      const response = await Data.userAccountUserAccountGetListCreate({
        PageSize: PAGE_SIZE_USER_ACCOUNT,
        PageIndex: 1,
        OrderBy: params.OrderBy,
        SortType: params.SortType,
        Filter: params.Filter,
        GetAll: params.GetAll,
      });

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

  takeLatestListeners()({
    actionCreator: userAccountActions.getUserAccount,
    effect: async (action, listenerApi) => {
      const { id } = action.payload;

      const response = await Data.userAccountUserAccountGetByIdCreate({
        Id: id,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(
          userAccountActions.saveUserAccount(response.data.Item!),
        );
      }
    },
  });

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
