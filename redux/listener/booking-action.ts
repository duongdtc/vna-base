/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { hideLoading, showLoading } from '@vna-base/components';
import { bookingActionActions } from '@redux-slice';
import { Data, Ibe } from '@services/axios';
import { Booking } from '@services/axios/axios-data';
import {
  Ancillary,
  SeatMap,
  Ticket,
  Booking as BookingIbe,
} from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import {
  ANCILLARY_TYPE,
  BookingStatus,
  scale,
  System as SystemType,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';

takeLatestListeners()({
  actionCreator: bookingActionActions.getActionsByBookingId,
  effect: async (action, listenerApi) => {
    const { bookingId } = action.payload;

    listenerApi.dispatch(
      bookingActionActions.saveLoading({ [bookingId]: true }),
    );

    const res = await Data.actionActionGetByBookingCreate({
      Id: bookingId,
    });

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
  effect: async action => {
    const { id, info, cb } = action.payload;

    const bookingDetail = realmRef.current
      ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
      ?.toJSON() as Booking;

    const res = await Ibe.flightIssueTicketCreate({
      System: bookingDetail?.System,
      BookingCode: bookingDetail?.BookingCode,
      BookingId: id,
      Tourcode: info.Tourcode,
      AccountCode: info.AccountCode,
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
  effect: async action => {
    const { id, form, cb } = action.payload;

    const bookingDetail = realmRef.current
      ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id)
      ?.toJSON() as Booking;

    const res = await Ibe.flightVoidTicketCreate({
      System: bookingDetail?.System,
      Airline: bookingDetail?.Airline,
      BookingCode: bookingDetail?.BookingCode,
      BookingId: id,

      CancelBooking: form.isCancelBooking,
      VoidAllTicket: form.isVoidAllTicket,
      ListTicket: form.tickets
        .filter(ticket => ticket.isSelected)
        .map(ticket => ticket.TicketNumber as string),
    });

    if (!validResponse(res)) {
      throw new Error();
    }

    cb(validResponse(res), res.data.Booking?.ListTicket ?? []);
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
    listenerApi.dispatch(bookingActionActions.changeIsLoadingAncillaries(true));

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
            `${s.StartPoint}${s.EndPoint}` === `${fj.StartPoint}${fj.EndPoint}`,
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

    let session: string | undefined = undefined;

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

    let session: string | undefined = undefined;

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
