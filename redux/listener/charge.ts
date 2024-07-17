/* eslint-disable @typescript-eslint/ban-ts-comment */
import { showModalConfirm } from '@vna-base/components';
import { chargeActions } from '@redux-slice';
import { Data } from '@services/axios';
import { Charge } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { delay, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';

takeLatestListeners()({
  actionCreator: chargeActions.getChargesByOrderId,
  effect: async (action, listenerApi) => {
    const { orderId, force } = action.payload;
    listenerApi.dispatch(chargeActions.saveIsLoadingCharges(true));

    const history = listenerApi.getState().charge.historyGetChargesByOrderId;

    if (force || !history[orderId] || dayjs().unix() - history[orderId] > 30) {
      const response = await Data.chargeChargeGetByOrderCreate({
        Id: orderId,
        Forced: true,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(
          chargeActions.saveCharges(response.data.List as Charge[]),
        );
      } else {
        listenerApi.dispatch(chargeActions.saveCharges([]));
      }

      listenerApi.dispatch(
        chargeActions.saveHistoryGetCharges({
          ...history,
          [orderId]: dayjs().unix(),
        }),
      );
    }

    listenerApi.dispatch(chargeActions.saveIsLoadingCharges(false));
  },
});

takeLatestListeners(true)({
  actionCreator: chargeActions.updateFlightCharge,
  effect: async (action, listenerApi) => {
    const { form, cb } = action.payload;
    const Item: Charge = {
      Id: form.Id,
      OrderId: form.OrderId,
      ChargeType: form.ChargeType,
      PassengerId: form.PassengerId,
      PaxName: translate(form.PaxName as I18nKeys),
      //@ts-ignore
      Route: form.Route,
      StartPoint: form.StartPoint,
      EndPoint: form.EndPoint,
      ChargeValue: form.ChargeValue,
      Remark: form.Remark,
      Amount: form.Amount,
      Currency: form.Currency,
      BookingId: form.BookingId,
    };

    await Data.chargeChargeUpdateCreate({
      Item,
    });

    listenerApi.dispatch(chargeActions.getChargesByOrderId(form.OrderId));
    // listenerApi.dispatch(orderActions.getOrderDetail(form.OrderId));
    cb();
  },
});

takeLatestListeners()({
  actionCreator: chargeActions.deleteFlightCharge,
  effect: async (action, _listenerApi) => {
    const { flChargeId, cb } = action.payload;

    const res = await Data.chargeChargeDeleteCreate({
      Id: flChargeId.toString(),
    });
    if (validResponse(res)) {
      cb();

      await delay(300);
      showModalConfirm({
        t18nTitle: 'agent_detail:deleted',
        t18nSubtitle: 'order_detail:sub_modal_confirm',
        t18nCancel: 'modal_confirm:close',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
      });
    } else {
      showModalConfirm({
        t18nTitle: 'modal_confirm:failed',
        t18nSubtitle: 'modal_confirm:please_try_again',
        t18nCancel: 'modal_confirm:ok',
      });
    }
  },
});

takeLatestListeners()({
  actionCreator: chargeActions.insertFlightCharge,
  effect: async (action, listenerApi) => {
    const { form, cb } = action.payload;
    const Item: Charge = {
      Id: form.Id ?? 0,
      ChargeValue: form.ChargeValue,
      OrderId: form.OrderId,
      ChargeType: form.ChargeType,
      BookingId: form.BookingId,
      PassengerId: form.PassengerId,
      PaxName: translate(form.PaxName as I18nKeys),
      StartPoint: form.StartPoint,
      EndPoint: form.EndPoint,
      Remark: form.Remark,
      Amount: form.Amount,
      Currency: form.Currency,
    };

    await Data.chargeChargeInsertCreate({
      Item,
    });

    listenerApi.dispatch(chargeActions.getChargesByOrderId(form.OrderId));
    // listenerApi.dispatch(orderActions.getOrderDetail(form.OrderId));
    cb();
  },
});
