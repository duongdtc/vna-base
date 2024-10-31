/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Ibe } from '@services/axios';
import { ActionLst, Booking } from '@services/axios/axios-data';
import {
  Ancillary,
  Booking as BookingIbe,
  IssueTicketRes,
  SeatMap,
  Ticket,
} from '@services/axios/axios-ibe';
import { BookingRealm, TicketRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import {
  hideLoading,
  showLoading,
  showModalConfirm,
} from '@vna-base/components';
import {
  bookingActionActions,
  currentAccountActions,
} from '@vna-base/redux/action-slice';
import {
  ANCILLARY_TYPE,
  BookingStatus,
  ConjTktNum,
  delay,
  randomTicketNumber,
  scale,
  System as SystemType,
  TicketStatus,
  TicketType,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { AxiosResponse } from 'axios';

import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';
import isNil from 'lodash.isnil';
import { List } from 'realm';

export const runBookingActionListnener = () => {
  takeLatestListeners()({
    actionCreator: bookingActionActions.getActionsByBookingId,
    effect: async (action, listenerApi) => {
      const { bookingId } = action.payload;

      listenerApi.dispatch(
        bookingActionActions.saveLoading({ [bookingId]: true }),
      );

      // const res = await Data.actionActionGetByBookingCreate({
      //   Id: bookingId,
      // });

      const res = await fakeActionBooking({ id: bookingId });

      if (validResponse(res)) {
        listenerApi.dispatch(
          bookingActionActions.saveActionsByBookingId({
            [bookingId]: (res.data.List ?? []).sort(
              (a, b) => (a.Feature?.Order ?? 0) - (b.Feature?.Order ?? 0),
            ),
          }),
        );
      } else {
        listenerApi.dispatch(
          bookingActionActions.saveActionsByBookingId({
            [bookingId]: [],
          }),
        );
      }

      listenerApi.dispatch(
        bookingActionActions.saveLoading({ [bookingId]: false }),
      );
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.issueTicket,
    effect: async (action, listenerApi) => {
      const { id, cb, autoUpdateBalance } = action.payload;

      const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
        BookingRealm.schema.name,
        id,
      );

      const price = Number(bookingDetail?.TotalPrice ?? 0);

      if (autoUpdateBalance) {
        listenerApi.dispatch(currentAccountActions.addBalance(-price));
      }

      const res = await fakeIssueTicket(id);

      await notifee.requestPermission({
        criticalAlert: true,
      });

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + 1000,
      };

      await notifee.createTriggerNotification(
        {
          title: 'Thanh toán xuất vé thành công',
          body: `Bạn vừa thanh toán ${price.currencyFormat()}VND`,
          ios: {
            critical: true,
            sound: 'default',
            criticalVolume: 1.0,
          },
        },
        trigger,
      );

      cb(validResponse(res), {
        listTicket: res.data.Booking?.ListTicket ?? [],
        error: {
          code: res.data.StatusCode ?? 'N/A',
          message: res.data.Message ?? '',
        },
      });
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'void_booking:voiding',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'void_booking:void_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.voidTicket,
    effect: async (action, listenerApi) => {
      const { id, cb } = action.payload;
      await delay(2000);
      try {
        const bookingDetail =
          realmRef.current?.objectForPrimaryKey<BookingRealm>(
            BookingRealm.schema.name,
            id,
          );

        listenerApi.dispatch(
          currentAccountActions.addBalance(
            Number(bookingDetail?.TotalPrice ?? 0),
          ),
        );

        if (!isNil(bookingDetail)) {
          realmRef.current?.write(() => {
            bookingDetail.Tickets?.forEach(ticket => {
              ticket.TicketStatus = TicketStatus.VOID;
              ticket.TicketType = TicketType.VOID;
            });

            bookingDetail.BookingStatus = BookingStatus.CANCELED;
          });
        }

        cb(true, (bookingDetail?.Tickets ?? []) as Array<Ticket>);
      } catch (error) {
        console.log('🚀 ~ effect: ~ error:', error);
      }
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.reBook,
    effect: async action => {
      showLoading({
        lottie: 'loading',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        t18nTitle: 're_book:re_booking',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      const { id, form, cb } = action.payload;

      const bookingDetail = realmRef.current
        ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
        ?.toJSON() as Booking;

      const res = await Ibe.flightReBookFlightCreate({
        System: bookingDetail?.System,
        BookingId: id,
        AutoIssue: form.autoIssue,
        SendEmail: form.autoSendEmail,
        CreateOrder: form.newOrder,
        BookingCode: bookingDetail.BookingCode,
        Airline: bookingDetail.Airline,
      });

      const newData: {
        bookingCode: string;
        orderId: string;
        listTicket: Array<Ticket>;
      } = { bookingCode: '', orderId: '', listTicket: [] };

      if (validResponse(res)) {
        newData.bookingCode = res.data.ListBooking![0].BookingCode!;
        newData.orderId = res.data.OrderId!;
        newData.listTicket = res.data.ListBooking![0].ListTicket ?? [];
      }

      cb(validResponse(res), newData);
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'issue_ticket:issuing_ticket',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'issue_ticket:successfully_issued',
      t18nTitle: 'update_booking:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'issue_ticket:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.issueEMD,
    effect: async action => {
      const { id, info, cb } = action.payload;

      const bookingDetail = realmRef.current
        ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
        ?.toJSON() as Booking;

      const res = await Ibe.flightIssueEmdCreate({
        System: bookingDetail?.System,
        BookingCode: bookingDetail?.BookingCode,
        BookingId: id,
        Tourcode: info.Tourcode,
        AccountCode: info.AccountCode,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res), res.data.Booking?.ListTicket ?? []);
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'booking_cancel:canceling',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'issue_ticket:successfully_issued',
      t18nTitle: 'booking_cancel:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.cancelBooking,
    effect: async action => {
      const { id, form, cb } = action.payload;

      const bookingDetail = realmRef.current
        ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
        ?.toJSON() as Booking;

      const res = await Ibe.flightCancelBookingCreate({
        CancelAll: form.isCancelAll,
        System: bookingDetail?.System,
        BookingCode: bookingDetail?.BookingCode,
        Airline: bookingDetail?.Airline,
        BookingId: id,
        ListSegmentId: form.routes
          .filter(r => r.isSelected)
          .map(r => r.Id!.toString()),
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res));
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'send_email:sending',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'send_email:send_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.sendEmails,
    effect: async action => {
      const { id, form, cb } = action.payload;

      const bookingDetail = realmRef.current
        ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
        ?.toJSON() as Booking;

      const res = await Ibe.flightSendEmailCreate({
        Airline: bookingDetail?.Airline,
        BookingCode: bookingDetail?.BookingCode,
        BookingId: id,
        System: bookingDetail?.System,
        Emails: form.emails.map(e => e.value),
        Lang: form.language,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res));
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'split_passenger:splitting',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'booking:update_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.passengersSplit,
    effect: async (action, _listenerApi) => {
      const { form, cb } = action.payload;

      const res = await Ibe.flightSplitPassengerCreate({
        System: form.System,
        Airline: form.Airline,
        BookingCode: form.BookingCode,
        BookingId: form.BookingId,
        CreateOrder: form.createNewOrder,
        ListPassenger: form.passengers,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res));
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'passport_update:updating',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'booking:update_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.passportUpdate,
    effect: async (action, _listenerApi) => {
      const { form, cb } = action.payload;
      const res = await Ibe.flightUpdatePassportCreate({
        ListPassenger: form.ListPassenger,
        Airline: form.Airline,
        BookingId: form.BookingId,
        BookingCode: form.BookingCode,
        System: form.System,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res));
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'member_card_udpate:adding_membership',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'booking:update_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.membershipUpdate,
    effect: async (action, _listenerApi) => {
      const { form, cb } = action.payload;

      const res = await Ibe.flightAddMembershipCreate({
        ListPassenger: form.ListPassenger,
        Airline: form.Airline,
        BookingId: form.BookingId,
        BookingCode: form.BookingCode,
        System: form.System,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res));
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.getSeatMaps,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(bookingActionActions.changeIsLoadingSeatMaps(true));
      const { System, BookingCode, Id, Flights } = action.payload;

      const res = await Ibe.flightGetSeatMapCreate({
        System,
        BookingInfo: { BookingCode, BookingId: Id },
      });

      const seatMaps: Record<string, Array<SeatMap>> = {};

      Flights?.forEach(fj => {
        seatMaps[fj.Leg!.toString()] = new Array(fj.Segments?.length);
      });

      if (validResponse(res)) {
        res.data.ListSeatMap?.forEach(seatMap => {
          Flights?.forEach(fj => {
            fj.Segments?.forEach((segment, segmentIndex) => {
              if (
                `${segment.StartPoint}${segment.EndPoint}${dayjs(
                  segment.DepartDate,
                ).format('DDMMYYYY')}` ===
                  `${seatMap.StartPoint}${seatMap.EndPoint}${seatMap.DepartDate}$` &&
                (segment.FlightNumber?.includes(seatMap.FlightNumber ?? '') ||
                  seatMap.FlightNumber?.includes(segment.FlightNumber ?? ''))
              ) {
                seatMaps[fj.Leg!][segmentIndex] = seatMap;
              }
            });
          });
        });
      }

      listenerApi.dispatch(bookingActionActions.saveSeatMaps(seatMaps));

      listenerApi.dispatch(bookingActionActions.changeIsLoadingSeatMaps(false));
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.getAncillaries,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        bookingActionActions.changeIsLoadingAncillaries(true),
      );

      const { System, BookingCode, Id, Flights } = action.payload;

      const res = await Ibe.flightGetAncillaryCreate({
        System,
        BookingInfo: { BookingCode, BookingId: Id },
      });

      const services: Record<string, Array<Ancillary>> = {};
      const baggages: Record<string, Array<Ancillary>> = {};

      if (validResponse(res)) {
        const listBaggage = res.data.ListBaggage!;
        listBaggage.sort((a, b) => a.Price! - b.Price!);

        const listService = res.data.ListService!;
        listService.sort((a, b) => a.Price! - b.Price!);

        Flights?.forEach(fj => {
          baggages[fj.Leg!.toString()] = listBaggage.filter(
            bg =>
              `${bg.StartPoint}${bg.EndPoint}` ===
              `${fj.StartPoint}${fj.EndPoint}`,
          );
          services[fj.Leg!.toString()] = listService.filter(
            s =>
              `${s.StartPoint}${s.EndPoint}` ===
              `${fj.StartPoint}${fj.EndPoint}`,
          );
        });
      }

      listenerApi.dispatch(bookingActionActions.saveServices(services));
      listenerApi.dispatch(bookingActionActions.saveBaggages(baggages));
      listenerApi.dispatch(
        bookingActionActions.changeIsLoadingAncillaries(false),
      );
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'seat_map_update:adding_seat',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'seat_map_update:update_booking_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.updateSeatMap,
    effect: async action => {
      const {
        bookingDetail: {
          System: system,
          BookingCode,
          Id,
          Airline,
          Flights,
          BookingStatus: bookingStatus,
        },
        passengers,
        cb,
      } = action.payload;

      const res = await Ibe.flightAddPreSeatCreate({
        System: system,
        Airline,
        AutoIssue: !(
          bookingStatus === BookingStatus.TICKETED || system === SystemType.VJ
        ),
        BookingCode,
        BookingId: Id,
        ListPassenger: passengers.map(passenger => {
          const listPreSeat: Array<Ancillary> = [];

          passenger.PreSeats.forEach((preSeat, preSeatIdx) => {
            preSeat.forEach((s, sIdx) => {
              if (!isEmpty(s)) {
                const segment = Flights![preSeatIdx].Segments![sIdx];
                listPreSeat.push({
                  Value: s?.SeatNumber,
                  StartPoint: segment.StartPoint,
                  Leg: segment.Leg,
                  EndPoint: segment.EndPoint,
                  Price: s.Price,
                  Airline,
                  Type: ANCILLARY_TYPE.PRESEAT,
                  PaxType: passenger.PaxType,
                  Confirmed: false,
                  Session: s.Session,
                  System: system,
                });
              }
            });
          });

          return {
            NameId: passenger.NameId,
            Surname: passenger.Surname,
            GivenName: passenger.GivenName,
            DateOfBirth: passenger.BirthDate,
            ListPreSeat: listPreSeat,
            Type: passenger.PaxType,
            Index: passenger.Index,
          };
        }),
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res), res.data.Booking?.ListTicket ?? []);
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nTitle: 'ancillary_update:adding_service',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'ancillary_update:update_booking_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.updateAncillaries,
    effect: async action => {
      const {
        bookingDetail: { System, BookingCode, Id, Airline, Flights },
        autoIssue,
        passengers,
        cb,
      } = action.payload;

      const res = await Ibe.flightAddServiceCreate({
        System,
        Airline,
        AutoIssue: autoIssue,
        BookingCode,
        BookingId: Id,
        ListPassenger: passengers.map(passenger => {
          const listBaggage: Array<Ancillary> = [];
          let listService: Array<Ancillary> = [];

          passenger.Baggages.forEach((baggage, flIdx) => {
            listBaggage.push({
              Value: baggage?.Value,
              StartPoint: baggage?.StartPoint,
              // Leg: baggage?.Leg,
              Leg: flIdx,
              EndPoint: baggage?.EndPoint,
              Price: baggage?.Price,
              Airline,
              Type: ANCILLARY_TYPE.BAGGAGE,
              PaxType: passenger.PaxType,
              Confirmed: false,
              Session: baggage?.Session,
              System,
            });
          });

          passenger.Services.forEach((fl, flIdx) => {
            fl.forEach((sm, smIdx) => {
              if (!isEmpty(sm)) {
                const segment = Flights![flIdx].Segments![smIdx];
                listService = listService.concat(
                  sm.map(srvs => ({
                    Value: srvs?.Value,
                    StartPoint: segment.StartPoint,
                    Leg: segment.Leg,
                    EndPoint: segment.EndPoint,
                    Price: srvs.Price,
                    Airline,
                    Type: ANCILLARY_TYPE.OTHER,
                    PaxType: passenger.PaxType,
                    Confirmed: false,
                    Session: srvs.Session,
                    System,
                  })),
                );
              }
            });
          });

          return {
            NameId: passenger.NameId,
            Surname: passenger.Surname,
            GivenName: passenger.GivenName,
            DateOfBirth: passenger.BirthDate,
            ListBaggage: listBaggage,
            ListService: listService,
            Type: passenger.PaxType,
            Index: passenger.Index,
          };
        }),
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res), res.data.Booking?.ListTicket ?? []);
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.changeFlight,
    effect: async (action, listenerApi) => {
      const { form, cb } = action.payload;

      const { SubmitChanges } = form;

      showLoading({
        lottie: 'loading',
        t18nTitle: SubmitChanges
          ? 'ancillary_update:adding_service'
          : 'booking_action:calculating_fee',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      try {
        const res = await Ibe.flightChangeFlightCreate({
          ...form,
          AutoIssue: false,
        });

        if (!validResponse(res)) {
          throw new Error();
        }

        if (SubmitChanges) {
          hideLoading({
            lottie: 'done',
            t18nSubtitle: 'ancillary_update:update_booking_success',
            t18nTitle: 'common:success',
            lottieStyle: { width: scale(182), height: scale(72) },
          });
        }

        if (!SubmitChanges) {
          hideLoading();

          listenerApi.dispatch(
            bookingActionActions.savePriceChangeFlight({
              fee: res.data.ModifyFee ?? 0,
              newPrice: res.data.TotalPrice ?? 0,
            }),
          );
        }

        cb(true);
      } catch (error) {
        hideLoading({
          lottie: 'failed',
          t18nSubtitle: 'update_booking:contact_admin_help',
          t18nTitle: 'common:failed',
          lottieStyle: { width: scale(182), height: scale(72) },
        });
      }
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.refundTicket,
    effect: async (action, listenerApi) => {
      const { form, cb } = action.payload;

      const { Confirm } = form;

      // let session: string | undefined;

      showLoading({
        lottie: 'loading',
        t18nTitle: Confirm
          ? 'refund_ticket:rfnding'
          : 'booking_action:calculating_fee',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      await delay(2000);
      hideLoading();

      // if (Confirm) {
      //   session = listenerApi.getState().bookingAction.sessionRefund!;
      // }

      try {
        // const res = await Ibe.flightRefundTicketCreate({
        //   ...form,
        //   Session: session,
        // });

        // if (!validResponse(res)) {
        //   throw new Error();
        // }

        const bookingDetail =
          realmRef.current?.objectForPrimaryKey<BookingRealm>(
            BookingRealm.schema.name,
            form.BookingId!,
          );

        if (Confirm) {
          if (!isEmpty(bookingDetail)) {
            listenerApi.dispatch(
              currentAccountActions.addBalance(
                (bookingDetail?.TotalPrice ?? 0) - 900_000,
              ),
            );

            realmRef.current?.write(() => {
              if (form.isCancelBooking) {
                bookingDetail.BookingStatus = BookingStatus.CANCELED;
              } else {
                // bookingDetail.BookingStatus = BookingStatus.OK;
              }

              bookingDetail.Tickets.forEach(tk => {
                tk.TicketStatus = TicketStatus.REFUND;
                tk.TicketType = TicketType.RFND;
              });
            });
          }

          hideLoading({
            lottie: 'done',
            t18nSubtitle: 'ancillary_update:update_booking_success',
            t18nTitle: 'common:success',
            lottieStyle: { width: scale(182), height: scale(72) },
          });
        }

        if (!Confirm) {
          hideLoading();
          // lưu phí thay đổi khi refund
          listenerApi.dispatch(
            bookingActionActions.saveRefundDoc({
              refundDocs: [
                {
                  TicketNumber: 'ALL TICKETS',
                  Passenger: 'ALL PASSENGERS',
                  RefundRoute: null,
                  BaseFare: {
                    Amount: (bookingDetail?.TotalPrice ?? 0) - 1308500,
                    Currency: 'VND',
                  },
                  TotalTax: {
                    Amount: 1308500,
                    Currency: 'VND',
                  },
                  UsedFare: {
                    Amount: 0,
                    Currency: 'VND',
                  },
                  RefundFare: {
                    Amount: 900_000,
                    Currency: 'VND',
                  },
                  RefundTotal: {
                    Amount: 2892500,
                    Currency: 'VND',
                  },
                },
              ],
              session: '',
            }),
          );
        }

        cb(true, (bookingDetail?.Tickets ?? []) as Array<Ticket>);
      } catch (error) {
        hideLoading({
          lottie: 'failed',
          t18nSubtitle: 'update_booking:contact_admin_help',
          t18nTitle: 'common:failed',
          lottieStyle: { width: scale(182), height: scale(72) },
        });
      }
    },
  });

  // TODO: sếp chưa làm xong
  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nTitle: 'ancillary_update:adding_service',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'ancillary_update:update_booking_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.passengersUpdate,
    effect: async action => {
      const { cb } = action.payload;

      const res = await Ibe.flightUpdatePassengerCreate({
        // Airline: form.Airline,
        // BookingCode: form.BookingCode,
        // BookingId: form.BookingId,
        // System: form.System,
        // ListPassenger: form.ListPassenger,
        // AutoIssue: form.AutoIssue,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb?.(validResponse(res));
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'update_contact:updating',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nSubtitle: 'booking:update_success',
      t18nTitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.updateContact,
    effect: async action => {
      const { id, info, cb } = action.payload;

      const bookingDetail = realmRef.current
        ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
        ?.toJSON() as Booking;

      const res = await Ibe.flightUpdateContactCreate({
        System: bookingDetail?.System,
        BookingCode: bookingDetail?.BookingCode,
        BookingId: id,
        Airline: bookingDetail?.Airline,
        Phone: info.Phone,
        Email: info.Email,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      cb(validResponse(res));
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActionActions.exchangeTicket,
    effect: async (action, listenerApi) => {
      const { form, cb } = action.payload;

      const { Confirm, NewPrice } = form;

      const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
        BookingRealm.schema.name,
        form.BookingId!,
      );

      // let session: string | undefined;

      showLoading({
        lottie: 'loading',
        t18nTitle: Confirm
          ? 'exchange_ticket:exchanging'
          : 'booking_action:calculating_fee',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      await delay(2000);
      hideLoading();

      // if (Confirm) {
      //   session = listenerApi.getState().bookingAction.sessionExchangeTicket!;
      // }

      try {
        // const res = await Ibe.flightExchangeTicketCreate({
        //   ...form,
        //   Session: session,
        // });

        // if (!validResponse(res)) {
        //   throw new Error();
        // }

        const oldPrice = bookingDetail?.TotalPrice ?? 0;

        const Penalty = 360_000;

        const different = NewPrice - oldPrice;

        const totalPrice = NewPrice + Penalty - oldPrice;

        if (different < 0) {
          throw new Error('Chỉ cho phép đổi sang vé có giá lớn hơn hoặc bằng');
        }

        if (Confirm) {
          if (!isNil(bookingDetail)) {
            listenerApi.dispatch(currentAccountActions.addBalance(-totalPrice));

            let newTickets = bookingDetail.toJSON().Tickets;

            newTickets.forEach(tk => {
              tk.TicketType = TicketType.EXCH;
              tk.TicketStatus = TicketStatus.EXCHANGE;
            });

            newTickets = newTickets.concat(
              newTickets.map(tk => {
                const newTk = cloneDeep(tk);

                newTk.Id = String.prototype.randomUniqueId();

                newTk.TicketStatus = TicketStatus.OPEN;
                newTk.TicketType = TicketType.OPEN;
                newTk.TicketNumber = randomTicketNumber();

                return newTk;
              }),
            );

            realmRef.current?.write(() => {
              bookingDetail.Tickets = newTickets;
              bookingDetail.TotalPrice = NewPrice;
            });
          }

          hideLoading({
            lottie: 'done',
            t18nSubtitle: 'exchange_ticket:exchange_success',
            t18nTitle: 'common:success',
            lottieStyle: { width: scale(182), height: scale(72) },
          });
        }

        if (!Confirm) {
          hideLoading();
          // lưu phí thay đổi khi refund
          // const {
          //   Penalty,
          //   Different,
          //   OldPrice,
          //   NewPrice,
          //   TotalPrice,
          //   PaidAmount,
          // } = res.data;
          // const newPrice = load(StorageKey.EXCH_TICKET_NEW_PRICE);

          listenerApi.dispatch(
            bookingActionActions.savePriceExchangeTicket({
              price: {
                Penalty: {
                  Amount: Penalty,
                  Currency: 'VND',
                },
                Different: {
                  Amount: different,
                  Currency: 'VND',
                },
                OldPrice: {
                  Amount: oldPrice,
                  Currency: 'VND',
                },
                NewPrice: {
                  Amount: NewPrice,
                  Currency: 'VND',
                },
                TotalPrice: {
                  Amount: totalPrice,
                  Currency: 'VND',
                },
                PaidAmount: oldPrice,
              },

              session: '',
            }),
          );
        }

        cb(true, (bookingDetail?.Tickets ?? []) as Array<Ticket>);
      } catch (error) {
        hideLoading();
        //   {
        //   lottie: 'failed',
        //   t18nSubtitle: 'update_booking:contact_admin_help',
        //   t18nTitle: 'common:failed',
        //   lottieStyle: { width: scale(182), height: scale(72) },
        // }

        showModalConfirm({
          lottie: 'failed',
          lottieStyle: { width: scale(182), height: scale(72) },
          t18nTitle: 'Đổi vé lỗi',
          t18nSubtitle: error.message,
          t18nCancel: 'modal_confirm:close',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
        });
      }
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'booking_action:calculating_fee',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      t18nTitle: 'common:success',
      t18nSubtitle: 'common:success',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    failedConfig: {
      lottie: 'failed',
      t18nSubtitle: 'update_booking:contact_admin_help',
      t18nTitle: 'common:failed',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
  })({
    actionCreator: bookingActionActions.bookingPricing,
    effect: async (action, listenApi) => {
      const {
        params: {
          AccountCode,
          Airline,
          BookingCode,
          BookingId,
          System,
          Tourcode,
        },
        cb,
      } = action.payload;

      const res = await Ibe.flightPriceQuoteCreate({
        System,
        Airline,
        BookingCode,
        BookingId,
        AccountCode,
        Tourcode,
      });

      if (!validResponse(res)) {
        throw new Error();
      }

      listenApi.dispatch(
        bookingActionActions.saveBookingPricingComplete(
          res.data.Booking as BookingIbe,
        ),
      );

      cb(validResponse(res));
    },
  });
};

async function fakeIssueTicket(
  id: string,
): Promise<AxiosResponse<IssueTicketRes, any>> {
  await delay(1000);

  const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    id,
  );

  const { StartPoint, EndPoint, DepartDate, Airline, ArriveDate } =
    bookingDetail!.Flights[0]!;

  // @ts-ignore
  const listTicket: List<TicketRealm> =
    bookingDetail?.Passengers.map(({ PaxType, GivenName, Surname }) => ({
      Index: 0,
      Id: String.prototype.randomUniqueId(),
      System: bookingDetail.System,
      Airline,
      BookingCode: bookingDetail.BookingCode,
      ConjTktNum: ConjTktNum,
      TicketNumber: randomTicketNumber(),
      TicketType: TicketType.OPEN,
      TicketStatus: TicketStatus.OPEN,
      TicketRelated: null,
      RelatedType: null,
      ServiceType: 'FLIGHT',
      ServiceCode: null,
      PaxType,
      FullName: `${Surname} ${GivenName}`,
      GivenName: GivenName,
      Surname: Surname,
      NameId: '2',
      Fare: 1639000,
      Tax: 701000,
      Fee: 0,
      Vat: 0,
      Total: 2_340_000,
      Currency: 'VND',
      Itinerary: 1,
      StartPoint,
      EndPoint,
      DepartDate: dayjs(DepartDate).format('DDMMYYYY'),
      ReturnDate: dayjs(ArriveDate).format('DDMMYYYY'),
      FareClass: 'N',
      FareBasis: 'NPXVNF',
      FlightType: 'domestic',
      Segments: 'VN' + StartPoint + EndPoint,
      Remark: 'PAX 738-2300011752/ETVN/18JUL24/SGNVN28BM/37980003',
      TicketImage: null,
      IssueDate: dayjs().format(),
    })) ?? [];

  realmRef.current?.write(() => {
    if (!isNil(bookingDetail)) {
      bookingDetail.BookingStatus = BookingStatus.TICKETED;
      bookingDetail.Tickets = listTicket;
    }
  });

  return {
    data: {
      Booking: {
        ...bookingDetail,
        //@ts-ignore
        ListTicket: cloneDeep(listTicket),
      },
      PaidAmount: 0,
      RequestID: 38406,
      ApiQueries: [],
      StatusCode: '000',
      Success: true,
      Expired: false,
      Message: null,
      Language: 'vi',
    },
  };
}

async function fakeActionBooking({
  id,
}: {
  id: string;
}): Promise<AxiosResponse<ActionLst, any>> {
  const booking = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    id,
  );

  let listAction = [
    {
      Id: '1B16573B-5FCE-46DC-883D-DE01010D5E95',
      FeatureId: 'BookingRetrieve',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'BookingRetrieve',
        NameVi: 'Retrieve PNR',
        NameEn: 'Retrieve PNR',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '1B16573B-5FCE-46DC-883D-DE01011D5E95',
      FeatureId: 'Rebook',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'Rebook',
        NameVi: 'Đặt lại',
        NameEn: 'Rebook',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '1B16573B-5FCE-46DC-823D-DE01211D5E95',
      FeatureId: 'UpdateContact',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'UpdateContact',
        NameVi: 'Cập nhật liên hệ',
        NameEn: 'Update Contact',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '1B16573B-5FCE-46DC-823D-DE01221D2E95',
      FeatureId: 'UpdateRemark',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'UpdateRemark',
        NameVi: 'Cập nhật Remark',
        NameEn: 'Update Remark',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '1B16573B-5FCE-46DC-823D-DE01571D2E95',
      FeatureId: 'UpdateOSI',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'UpdateOSI',
        NameVi: 'Cập nhật OSI',
        NameEn: 'Update OSI',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '1B16573B-5FCE-46DC-823D-SK01571D2E95',
      FeatureId: 'UpdateSK',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'UpdateOSI',
        NameVi: 'Cập nhật SK',
        NameEn: 'Update SK',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '1B16573B-5FCE-46DC-823D-SK11271D2E95',
      FeatureId: 'SendQueue',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'SendQueue',
        NameVi: 'Gửi Queue',
        NameEn: 'Send Queue',
        Icon: null,
        Style: 'secondary',
        Order: 1,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: 'DD176FF7-3E1F-4F4C-9BE6-F5AB3571F034',
      FeatureId: 'BookingUpdate',
      System: 'VN',
      Confirmed: true,
      Expired: true,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'BookingUpdate',
        NameVi: 'Sửa đặt chỗ',
        NameEn: 'Update booking',
        Icon: null,
        Style: 'secondary',
        Order: 2,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '22F0441F-7978-40C5-8DC5-50D1546695DC',
      FeatureId: 'FlightChange',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'FlightChange',
        NameVi: 'Đổi chuyến bay',
        NameEn: 'Change flights',
        Icon: null,
        Style: 'secondary',
        Order: 5,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '25F5E0C7-43F9-40D3-9193-7C94BFEA41FC',
      FeatureId: 'BookingPricing',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'BookingPricing',
        NameVi: 'Tính giá',
        NameEn: 'Quote pricing',
        Icon: null,
        Style: 'secondary',
        Order: 6,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: 'D77C8FB2-02D6-45D3-8B4D-6894B35F017F',
      FeatureId: 'FareRuleGet',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'FareRuleGet',
        NameVi: 'Xem điều kiện vé',
        NameEn: 'Get fare rules',
        Icon: null,
        Style: 'secondary',
        Order: 7,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '80E78AF3-FFC8-4BB4-8762-2CD7A13466E1',
      FeatureId: 'BookingCancel',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'BookingCancel',
        NameVi: 'Hủy đặt chỗ',
        NameEn: 'Cancel booking',
        Icon: null,
        Style: 'danger',
        Order: 8,
        Group: 'BOOKING',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '2847C8D1-BCB8-46CC-9B13-3BDFD395C020',
      FeatureId: 'SMSSend',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'SMSSend',
        NameVi: 'Tin nhắn SMS',
        NameEn: 'Send SMS',
        Icon: null,
        Style: 'secondary',
        Order: 13,
        Group: 'OTHER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '488D0330-13D5-4699-A61D-DFD654897534',
      FeatureId: 'PassengerUpdate',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'PassengerUpdate',
        NameVi: 'Cập nhật hành khách',
        NameEn: 'Update passengers',
        Icon: null,
        Style: 'secondary',
        Order: 2,
        Group: 'PASSENGER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '488D0330-13D5-4699-A61D-DFD654897574',
      FeatureId: 'PassengerSplit',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'PassengerSplit',
        NameVi: 'Tách hành khách',
        NameEn: 'Split passengers',
        Icon: null,
        Style: 'secondary',
        Order: 3,
        Group: 'PASSENGER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '488D0330-13D5-4699-A61D-DFD654297574',
      FeatureId: 'MoreBabies',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'MoreBabies',
        NameVi: 'Thêm trẻ sơ sinh',
        NameEn: 'More babies',
        Icon: null,
        Style: 'secondary',
        Order: 4,
        Group: 'PASSENGER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '488D0330-13D5-4699-A61D-DFD612897574',
      FeatureId: 'Membership',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'Membership',
        NameVi: 'Thẻ thành viên',
        NameEn: 'MemberShip Card',
        Icon: null,
        Style: 'secondary',
        Order: 5,
        Group: 'PASSENGER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '488D0330-13D5-4699-A61D-DFD654123574',
      FeatureId: 'PassportUpdate',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'PassportUpdate',
        NameVi: 'Cập nhập hộ chiếu',
        NameEn: 'Update Passport',
        Icon: null,
        Style: 'secondary',
        Order: 6,
        Group: 'PASSENGER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '947BFBBC-FB75-458C-8A8E-54AACF9E0F6E',
      FeatureId: 'EmailSend',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'EmailSend',
        NameVi: 'Nhận email hãng',
        NameEn: 'Send email',
        Icon: null,
        Style: 'secondary',
        Order: 12,
        Group: 'OTHER',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '947BFBBC-FB75-458C-1A8E-54AACF9E0F6E',
      FeatureId: 'BaggagesAndServices',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'BaggagesAndServices',
        NameVi: 'Hành lý & Dịch vụ',
        NameEn: 'Baggage & Services',
        Icon: null,
        Style: 'secondary',
        Order: 12,
        Group: 'SUPPORTS',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '947BFBBC-FB75-328C-5A8E-54AACF9E0F6E',
      FeatureId: 'Seat',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'Seat',
        NameVi: 'Chỗ ngồi',
        NameEn: 'Seat',
        Icon: null,
        Style: 'secondary',
        Order: 13,
        Group: 'SUPPORTS',
        Visible: true,
        Actions: [null],
      },
    },
    {
      Id: '941BFBBC-FB72-458C-8A8E-54BNCF9E0F6E',
      FeatureId: 'ServicesSupport',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: true,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'ServicesSupport',
        NameVi: 'Dịch vụ bổ trợ',
        NameEn: 'Additional services',
        Icon: null,
        Style: 'secondary',
        Order: 14,
        Group: 'SUPPORTS',
        Visible: true,
        Actions: [null],
      },
    },
  ];

  if (booking?.BookingStatus === BookingStatus.OK) {
    listAction.push({
      Id: 'EB9A4205-CFE4-4E99-A7A5-BDF62137B55B',
      FeatureId: 'TicketIssue',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: false,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'TicketIssue',
        NameVi: 'Xuất vé',
        NameEn: 'Issue ticket',
        Icon: null,
        Style: 'success',
        Order: 1,
        Group: 'TICKET',
        Visible: true,
        Actions: [null],
      },
    });
    listAction.push({
      Id: 'EB9A4205-CFE4-4E99-A7A5-BDF62127B55B',
      FeatureId: 'EMDIssue',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: false,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'EMDIssue',
        NameVi: 'Xuất EMD',
        NameEn: 'Issue EMD',
        Icon: null,
        Style: 'success',
        Order: 2,
        Group: 'TICKET',
        Visible: true,
        Actions: [null],
      },
    });
    listAction.push({
      Id: 'EB9A4205-CFE4-4E99-A1A5-BDF12137B55B',
      FeatureId: 'OpenNumberTicket',
      System: 'VN',
      Confirmed: true,
      Expired: false,
      Ticketed: false,
      API: true,
      AGT: true,
      WEB: true,
      Feature: {
        Code: 'OpenNumberTicket',
        NameVi: 'Mở số vé',
        NameEn: 'Open Number Ticket',
        Icon: null,
        Style: 'success',
        Order: 3,
        Group: 'TICKET',
        Visible: true,
        Actions: [null],
      },
    });
  } else if (booking?.BookingStatus === BookingStatus.TICKETED) {
    listAction = listAction.concat([
      {
        Id: '3D40CAD6-7E25-45B0-B3BB-551E2C936380',
        FeatureId: 'CheckInOnline',
        System: 'VN',
        Confirmed: false,
        Expired: false,
        Ticketed: true,
        API: true,
        AGT: true,
        WEB: true,
        Feature: {
          Code: 'CheckInOnline',
          NameVi: 'Check-in Online',
          NameEn: 'Check-in Online',
          Icon: null,
          Style: 'secondary',
          Order: 11,
          Group: 'OTHER',
          Visible: true,
          Actions: [null],
        },
      },
      {
        Id: '99ECB09A-10E1-4161-9DD9-70A587A4AD06',
        FeatureId: 'TicketVoid',
        System: 'VN',
        Confirmed: true,
        Expired: true,
        Ticketed: true,
        API: true,
        AGT: true,
        WEB: true,
        Feature: {
          Code: 'TicketVoid',
          NameVi: 'Void v\u00E9',
          NameEn: 'Void ticket',
          Icon: null,
          Style: 'danger',
          Order: 5,
          Group: 'TICKET',
          Visible: true,
          Actions: [null],
        },
      },
      {
        Id: 'D2EEB3E5-4758-4E82-A777-18D8D690B1CB',
        FeatureId: 'TicketExch',
        System: 'VN',
        Confirmed: true,
        Expired: true,
        Ticketed: true,
        API: true,
        AGT: true,
        WEB: true,
        Feature: {
          Code: 'TicketExch',
          NameVi: '\u0110\u1ED5i v\u00E9',
          NameEn: 'Exchange ticket',
          Icon: null,
          Style: 'secondary',
          Order: 3,
          Group: 'TICKET',
          Visible: true,
          Actions: [null],
        },
      },
      {
        Id: 'A3590145-33D0-4DF5-9B1C-12D0C15E7B50',
        FeatureId: 'TicketRfnd',
        System: 'VN',
        Confirmed: true,
        Expired: true,
        Ticketed: true,
        API: true,
        AGT: true,
        WEB: true,
        Feature: {
          Code: 'TicketRfnd',
          NameVi: 'Ho\u00E0n v\u00E9',
          NameEn: 'Refund ticket',
          Icon: null,
          Style: 'warning',
          Order: 4,
          Group: 'TICKET',
          Visible: true,
          Actions: [null],
        },
      },
    ]);
  }

  return {
    data: {
      List: listAction,
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
    },
  };
}
