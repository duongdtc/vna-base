/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { moduleActions } from '@redux-slice';
import { ModuleSideBar } from '@redux/type';
import { Data } from '@services/axios';
import { processSideBarModule, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import isEmpty from 'lodash.isempty';

takeLatestListeners(true)({
  actionCreator: moduleActions.getAll,
  effect: async (_, listenerApi) => {
    const response = await Data.userModuleUserModuleGetAllCreate({});

    if (validResponse(response)) {
      listenerApi.dispatch(moduleActions.saveAll(response.data.List!));
    }
  },
});

takeLatestListeners(true)({
  actionCreator: moduleActions.getSideBar,
  effect: async (_, listenerApi) => {
    const response = await Data.userModuleUserModuleGetSideBarCreate({});

    if (validResponse(response)) {
      const listUserModule = response.data.List!;

      //@ts-ignore
      const processedListModule: Array<ModuleSideBar> = listUserModule.filter(
        userModule => isEmpty(userModule.ParentId),
      );

      processSideBarModule(processedListModule, listUserModule);

      listenerApi.dispatch(moduleActions.saveSideBar(processedListModule));
    }
  },
});
