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
      const res = await Data.agentAgentGetAllCreate({});

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
      const res = await Data.agentTypeAgentTypeGetAllCreate({});

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
      const res = await Data.agentGroupAgentGroupGetAllCreate({});

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
