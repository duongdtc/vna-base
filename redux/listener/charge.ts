/* eslint-disable @typescript-eslint/ban-ts-comment */
import { showModalConfirm } from '@vna-base/components';
import { chargeActions } from '@vna-base/redux/action-slice';
import { Data } from '@services/axios';
import { Charge, ChargeLst } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { delay, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import { AxiosResponse } from 'axios';

export const runChargeListener = () => {
  takeLatestListeners()({
    actionCreator: chargeActions.getChargesByOrderId,
    effect: async (action, listenerApi) => {
      const { orderId, force } = action.payload;
      listenerApi.dispatch(chargeActions.saveIsLoadingCharges(true));

      const history = listenerApi.getState().charge.historyGetChargesByOrderId;

      if (
        force ||
        !history[orderId] ||
        dayjs().unix() - history[orderId] > 30
      ) {
        // const response = await Data.chargeChargeGetByOrderCreate({
        //   Id: orderId,
        //   Forced: true,
        // });
        const response = await fakeChargeByOrderId();

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
};

async function fakeChargeByOrderId(): Promise<AxiosResponse<ChargeLst, any>> {
  await delay(1000);

  return {
    data: {
      List: [
        {
          Id: 32577,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: null,
          PolicyId: null,
          TicketId: null,
          Amount: 678000,
          Currency: 'VND',
          ChargeType: 'TICKET_FARE',
          ChargeValue: 'AAP2VNF,AAP4VNF',
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32578,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: null,
          PolicyId: null,
          TicketId: null,
          Amount: 1193000,
          Currency: 'VND',
          ChargeType: 'TICKET_TAX',
          ChargeValue: null,
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32579,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: null,
          PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
          TicketId: '73B64CF2-AC5B-40CA-8BB2-EFB9E0787BD7',
          Amount: 100000,
          Currency: 'VND',
          ChargeType: 'SERVICE_FEE',
          ChargeValue: null,
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          IsPolicy: true,
          Paid: true,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32580,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: null,
          PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
          TicketId: '73B64CF2-AC5B-40CA-8BB2-EFB9E0787BD7',
          Amount: 100000,
          Currency: 'VND',
          ChargeType: 'SERVICE_FEE',
          ChargeValue: null,
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'SGN',
          EndPoint: 'DAD',
          SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          IsPolicy: true,
          Paid: true,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32581,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: 'F303D205-B670-4836-96DB-5C655964BEDC',
          PolicyId: null,
          TicketId: null,
          Amount: 324000,
          Currency: 'VND',
          ChargeType: 'BAGGAGE_FEE',
          ChargeValue: 'PREPAID BAG UPTO23KG158LCM',
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32582,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: '3D07E101-5C6B-4CCF-A5AB-4198A2807C76',
          PolicyId: null,
          TicketId: null,
          Amount: 344000,
          Currency: 'VND',
          ChargeType: 'ANCILLARY_FEE',
          ChargeValue: 'LOUNGE ACCESS DOMESTIC',
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: '',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32583,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'A6916185-A097-4094-A6AC-91E957A549A8',
          AncillaryId: null,
          PolicyId: null,
          TicketId: null,
          Amount: 678000,
          Currency: 'VND',
          ChargeType: 'TICKET_FARE',
          ChargeValue: 'AAP2VNF,AAP4VNF',
          PaxName: 'NGUYEN VAN DUONG',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32584,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'A6916185-A097-4094-A6AC-91E957A549A8',
          AncillaryId: null,
          PolicyId: null,
          TicketId: null,
          Amount: 1193000,
          Currency: 'VND',
          ChargeType: 'TICKET_TAX',
          ChargeValue: null,
          PaxName: 'NGUYEN VAN DUONG',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32585,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'A6916185-A097-4094-A6AC-91E957A549A8',
          AncillaryId: null,
          PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
          TicketId: '7C96D2A7-4584-4489-B227-8DE762BF0457',
          Amount: 100000,
          Currency: 'VND',
          ChargeType: 'SERVICE_FEE',
          ChargeValue: null,
          PaxName: 'NGUYEN VAN DUONG',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          IsPolicy: true,
          Paid: true,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32586,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'A6916185-A097-4094-A6AC-91E957A549A8',
          AncillaryId: null,
          PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
          TicketId: '7C96D2A7-4584-4489-B227-8DE762BF0457',
          Amount: 100000,
          Currency: 'VND',
          ChargeType: 'SERVICE_FEE',
          ChargeValue: null,
          PaxName: 'NGUYEN VAN DUONG',
          Remark: null,
          StartPoint: 'SGN',
          EndPoint: 'DAD',
          SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          IsPolicy: true,
          Paid: true,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32587,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: '05D5FE45-E010-45E2-939C-4224B8089EC4',
          AncillaryId: null,
          PolicyId: null,
          TicketId: null,
          Amount: 611000,
          Currency: 'VND',
          ChargeType: 'TICKET_FARE',
          ChargeValue: 'AAP2VNF,AAP4VNF',
          PaxName: 'NGUYEN VAN DUY',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32588,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: '05D5FE45-E010-45E2-939C-4224B8089EC4',
          AncillaryId: null,
          PolicyId: null,
          TicketId: null,
          Amount: 1068000,
          Currency: 'VND',
          ChargeType: 'TICKET_TAX',
          ChargeValue: null,
          PaxName: 'NGUYEN VAN DUY',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32589,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: '05D5FE45-E010-45E2-939C-4224B8089EC4',
          AncillaryId: null,
          PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
          TicketId: '4344A3C0-C22B-4640-A02B-370597F43776',
          Amount: 100000,
          Currency: 'VND',
          ChargeType: 'SERVICE_FEE',
          ChargeValue: null,
          PaxName: 'NGUYEN VAN DUY',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          IsPolicy: true,
          Paid: true,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32590,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: '05D5FE45-E010-45E2-939C-4224B8089EC4',
          AncillaryId: null,
          PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
          TicketId: '4344A3C0-C22B-4640-A02B-370597F43776',
          Amount: 100000,
          Currency: 'VND',
          ChargeType: 'SERVICE_FEE',
          ChargeValue: null,
          PaxName: 'NGUYEN VAN DUY',
          Remark: null,
          StartPoint: 'SGN',
          EndPoint: 'DAD',
          SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          IsPolicy: true,
          Paid: true,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
        },
        {
          Id: 32591,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          OrderId: '5311D070-5C8B-462E-B463-C96B7617FDBA',
          BookingId: '74119A92-09F5-4CE5-A15E-43C7BCD37E4F',
          PassengerId: 'B55E2A61-2174-4E0C-B804-F26CAB1DE6E7',
          AncillaryId: 'FE0A8814-41C2-4A98-B8E9-4F3373EAE567',
          PolicyId: null,
          TicketId: null,
          Amount: 344000,
          Currency: 'VND',
          ChargeType: 'BAGGAGE_FEE',
          ChargeValue: 'Domestic Lounge',
          PaxName: 'NGUYEN THI MAI',
          Remark: null,
          StartPoint: 'HAN',
          EndPoint: null,
          SupplierId: null,
          IsPolicy: false,
          Paid: false,
          Ancillary: null,
          Booking: null,
          Order: null,
          Passenger: null,
          Policy: null,
          Ticket: null,
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
}
