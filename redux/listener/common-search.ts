import { takeLatestListeners } from '@vna-base/utils/redux/listener';

import { commonSearchActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { Booking, Order, Ticket } from '@services/axios/axios-data';

export const runCommonSearchListener = () => {
  takeLatestListeners()({
    actionCreator: commonSearchActions.search,
    effect: async (action, listenerApi) => {
      const keyword = action.payload;

      if (keyword.length <= 1) {
        listenerApi.dispatch(
          commonSearchActions.saveResultSearch({
            Booking: [],
            Order: [],
            Ticket: [],
          }),
        );
        return;
      }

      listenerApi.dispatch(commonSearchActions.saveLoadingSearch(true));

      const res = await Data.commonCommonSearchCreate({
        Id: keyword,
      });

      const {
        Booking: booking,
        Order: order,
        Ticket: ticket,
      } = res.data.CustomProperties as {
        Booking: Array<Booking> | [];
        Order: Array<Order> | [];
        Ticket: Array<Ticket> | [];
      };

      listenerApi.dispatch(
        commonSearchActions.saveResultSearch({
          Booking: booking ?? [],
          Order: order ?? [],
          Ticket: ticket ?? [],
        }),
      );

      listenerApi.dispatch(commonSearchActions.saveLoadingSearch(false));
    },
  });
};
