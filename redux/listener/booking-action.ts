/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Data, Ibe } from '@services/axios';
import { ActionLst, Booking, Flight } from '@services/axios/axios-data';
import {
  Ancillary,
  Booking as BookingIbe,
  SeatMap,
  Ticket,
} from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { hideLoading, showLoading } from '@vna-base/components';
import {
  bookingActionActions,
  currentAccountActions,
} from '@vna-base/redux/action-slice';
import {
  ANCILLARY_TYPE,
  BookingStatus,
  delay,
  load,
  scale,
  StorageKey,
  System as SystemType,
  TicketStatus,
  TicketType,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import isNil from 'lodash.isnil';

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
      const { id, cb } = action.payload;

      listenerApi.dispatch(
        currentAccountActions.addBalance(
          -Number(load(StorageKey.PRICE_BOOK ?? 0)),
        ),
      );

      const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
        BookingRealm.schema.name,
        id,
      );

      const res = await fakeIssueTicket({
        //@ts-ignore
        fl: bookingDetail?.Flights ?? [],
        paxName: bookingDetail?.PaxName ?? '',
        bookingCode: bookingDetail?.BookingCode ?? '',
      });

      realmRef.current?.write(() => {
        if (!isNil(bookingDetail)) {
          bookingDetail.BookingStatus = BookingStatus.TICKETED;
        }
      });

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
            -Number(load(StorageKey.PRICE_BOOK ?? 0)),
          ),
        );

        realmRef.current?.write(() => {
          if (!isNil(bookingDetail)) {
            bookingDetail.Tickets?.forEach(ticket => {
              ticket.TicketStatus = TicketStatus.VOID;
              ticket.TicketType = TicketType.VOID;
            });

            bookingDetail.BookingStatus = BookingStatus.CANCELED;
          }
        });

        cb(true, bookingDetail?.Tickets ?? []);
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

      let session: string | undefined;

      showLoading({
        lottie: 'loading',
        t18nTitle: Confirm
          ? 'refund_ticket:rfnding'
          : 'booking_action:calculating_fee',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      if (Confirm) {
        session = listenerApi.getState().bookingAction.sessionRefund!;
      }

      try {
        const res = await Ibe.flightRefundTicketCreate({
          ...form,
          Session: session,
        });

        if (!validResponse(res)) {
          throw new Error();
        }

        if (Confirm) {
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
              refundDocs: res.data.RefundDoc!,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              session: res.data.Session,
            }),
          );
        }

        cb(true, res.data.Booking?.ListTicket ?? []);
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

      const { Confirm } = form;

      let session: string | undefined;

      showLoading({
        lottie: 'loading',
        t18nTitle: Confirm
          ? 'exchange_ticket:exchanging'
          : 'booking_action:calculating_fee',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      if (Confirm) {
        session = listenerApi.getState().bookingAction.sessionExchangeTicket!;
      }

      try {
        const res = await Ibe.flightExchangeTicketCreate({
          ...form,
          Session: session,
        });

        if (!validResponse(res)) {
          throw new Error();
        }

        if (Confirm) {
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
          const {
            Penalty,
            Different,
            OldPrice,
            NewPrice,
            TotalPrice,
            PaidAmount,
          } = res.data;

          listenerApi.dispatch(
            bookingActionActions.savePriceExchangeTicket({
              price: {
                Penalty,
                Different,
                OldPrice,
                NewPrice,
                TotalPrice,
                PaidAmount,
              },
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              session: res.data.Session,
            }),
          );
        }

        cb(true, res.data.Booking?.ListTicket ?? []);
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

async function fakeIssueTicket({
  fl,
  paxName,
  bookingCode,
}: {
  fl: Flight[];
  paxName: string;
  bookingCode: string;
}) {
  await delay(1000);

  return {
    data: {
      Booking: {
        Source: null,
        System: 'VN',
        Airline: 'VN',
        BookingId: null,
        OrderCode: null,
        OrderId: null,
        GdsCode: '5KBXK4',
        BookingCode: bookingCode,
        BookingStatus: 'TICKETED',
        ExpirationTime: null,
        TimePurchase: null,
        TotalPrice: 0,
        Currency: 'VND',
        BookingPcc: null,
        BookingSignIn: null,
        BookingImage:
          '5KBXK4\r\nWARNING: NOT FOUND PASSENGER DATA!\r\nNO ITINERARY INFO!',
        ResponseTime: 0,
        AutoIssue: false,
        Sandbox: false,
        StatusCode: null,
        Message: null,
        ListContact: [],
        ListFlightFare: [],
        ListPassenger: [],
        ListTicket: fl.map(({ StartPoint, EndPoint, DepartDate }) => ({
          Index: 0,
          System: 'VN',
          Airline: 'VN',
          BookingCode: '5KBXK4',
          ConjTktNum: '738',
          TicketNumber:
            '738' + (Math.floor(Math.random() * 9000000000) + 1000000000),
          TicketType: 'OPEN',
          TicketStatus: 'OPEN',
          TicketRelated: null,
          RelatedType: null,
          ServiceType: 'FLIGHT',
          ServiceCode: null,
          PaxType: 'ADT',
          FullName: paxName,
          GivenName: paxName,
          Surname: paxName,
          NameId: '2',
          Fare: 1639000,
          Tax: 701000,
          Fee: 0,
          Vat: 0,
          Total: 2340000,
          Currency: 'VND',
          Itinerary: 1,
          StartPoint,
          EndPoint,
          DepartDate: dayjs(DepartDate).format('DDMMYYYY'),
          ReturnDate: null,
          FareClass: 'N',
          FareBasis: 'NPXVNF',
          FlightType: 'domestic',
          Segments: 'VN' + StartPoint + EndPoint,
          Remark: 'PAX 738-2300011752/ETVN/18JUL24/SGNVN28BM/37980003',
          TicketImage: null,
          IssueDate: '2024-07-18T00:00:00',
        })),
      },
      PaidAmount: 0,
      RequestID: 38406,
      ApiQueries: [],
      StatusCode: '000',
      Success: true,
      Expired: false,
      Message: null,
      Language: 'vi',
      CustomProperties: null,
    },
  };
}

async function fakeActionBooking({
  id,
}: {
  id: string;
}): Promise<AxiosResponse<ActionLst, any>> {
  return {
    data: {
      List: [
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
            Order: 2,
            Group: 'PASSENGER',
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
            Order: 3,
            Group: 'BOOKING',
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
        },
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
