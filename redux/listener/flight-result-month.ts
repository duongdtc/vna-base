import { flightResultMonthActions } from '@vna-base/redux/action-slice';
import { StorageKey, delay, save } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

export const runFlightResultMonthListener = () => {

  takeLatestListeners(true)({
    actionCreator: flightResultMonthActions.changeViewChart,
    effect: async (_, listenerApi) => {
      await delay(100);

      const { viewChart } = listenerApi.getState().flightResultMonth;
      listenerApi.dispatch(flightResultMonthActions.saveViewChart(!viewChart));

      save(StorageKey.VIEW_CHART, !viewChart);
      await delay(200);
    },
  });

  takeLatestListeners(true)({
    actionCreator: flightResultMonthActions.changeFilterForm,
    effect: async (action, listenerApi) => {
      await delay(100);

      listenerApi.dispatch(
        flightResultMonthActions.saveFilterForm(action.payload),
      );
    },
  });
}