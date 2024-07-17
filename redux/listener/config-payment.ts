import { configPaymentActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { PayMethod } from '@services/axios/axios-data';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runConfigPayment = () => {
  takeLatestListeners()({
    actionCreator: configPaymentActions.getAllPayMethod,
    effect: async (_, listenerApi) => {
      const response = await Data.payMethodPayMethodGetAllCreate({});

      const data: Record<string, PayMethod> = {};

      if (validResponse(response)) {
        response.data.List?.forEach(cp => {
          data[cp.Id as string] = cp;
        });
      }

      listenerApi.dispatch(configPaymentActions.saveAllPayMethod(data));
    },
  });
};
