import Actions from '@vna-base/redux/action-type';
import { BookingActionState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Passenger as PassengerUpdateAncillary } from '@vna-base/screens/booking-actions/ancillary-update/type';
import { BookingCancelForm } from '@vna-base/screens/booking-actions/booking-cancel/type';
import { EmailSendForm } from '@vna-base/screens/booking-actions/email-send/type';
import { MemberCardUpdateForm } from '@vna-base/screens/booking-actions/member-card-update/type';
import { SplitPassengersForm } from '@vna-base/screens/booking-actions/passengers-split/type';
import { PassportUpdateForm } from '@vna-base/screens/booking-actions/passport-update/type';
import { ReBookForm } from '@vna-base/screens/booking-actions/re-book/type';
import { Passenger as PassengerUpdateSeatMap } from '@vna-base/screens/booking-actions/seat-map-update/type';
import { VoidTicketForm } from '@vna-base/screens/booking-actions/ticket-void/type';
import {
  IssueEMDForm,
  IssueTicketForm,
  UpdateContactForm,
} from '@vna-base/screens/index';
import { Action, Booking } from '@services/axios/axios-data';
import {
  Ancillary,
  ChangeFlightReq,
  ExchangeTicketReq,
  ExchangeTicketRes,
  RefundDoc,
  RefundTicketReq,
  SeatMap,
  Ticket,
  UpdatePassengerReq,
  Booking as BookingIbe,
} from '@services/axios/axios-ibe';
import { SLICE_NAME } from './constant';

const initialState: BookingActionState = {
  actions: {},
  loadings: {},
  isLoadingAncillaries: false,
  baggages: {},
  services: {},
  isLoadingSeatMaps: false,
  seatMaps: {},
  priceChangeFlight: {
    fee: 0,
    newPrice: 0,
  },
  currentFeature: { featureId: '', bookingId: '' },
  RefundDoc: [],
  pricesExchangeTicket: { PaidAmount: 0 },
  bookingPricingComplete: {},
};

const slice = createSlice({
  name: SLICE_NAME.BOOKING_ACTION,
  initialState,
  reducers: {
    saveActionsByBookingId: (
      state,
      { payload }: PayloadAction<Record<string, Array<Action>>>,
    ) => {
      state.actions = {
        ...state.actions,
        ...payload,
      };
    },

    saveLoading: (
      state,
      { payload }: PayloadAction<Record<string, boolean>>,
    ) => {
      state.loadings = {
        ...state.loadings,
        ...payload,
      };
    },

    saveBaggages: (
      state,
      { payload }: PayloadAction<Record<string, Ancillary[]>>,
    ) => {
      state.baggages = payload;
    },
    saveServices: (
      state,
      { payload }: PayloadAction<Record<string, Ancillary[]>>,
    ) => {
      state.services = payload;
    },
    saveSeatMaps: (
      state,
      { payload }: PayloadAction<Record<string, SeatMap[]>>,
    ) => {
      state.seatMaps = payload;
    },
    changeIsLoadingSeatMaps: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingSeatMaps = payload;
    },
    changeIsLoadingAncillaries: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isLoadingAncillaries = payload;
    },
    savePriceChangeFlight: (
      state,
      { payload }: PayloadAction<{ fee: number; newPrice: number }>,
    ) => {
      state.priceChangeFlight = payload;
    },
    saveCurrentFeature: (
      state,
      { payload }: PayloadAction<{ featureId: string; bookingId: string }>,
    ) => {
      state.currentFeature = payload;
    },
    saveRefundDoc: (
      state,
      {
        payload,
      }: PayloadAction<{
        refundDocs: Array<RefundDoc>;
        session: string | undefined;
      }>,
    ) => {
      state.RefundDoc = payload.refundDocs;
      state.sessionRefund = payload.session;
    },

    savePriceExchangeTicket: (
      state,
      {
        payload,
      }: PayloadAction<{
        price: Pick<
          ExchangeTicketRes,
          | 'Penalty'
          | 'Different'
          | 'OldPrice'
          | 'NewPrice'
          | 'TotalPrice'
          | 'PaidAmount'
        >;
        session: string | undefined;
      }>,
    ) => {
      state.pricesExchangeTicket = payload.price;
      state.sessionExchangeTicket = payload.session;
    },

    saveBookingPricingComplete: (
      state,
      { payload }: PayloadAction<BookingIbe>,
    ) => {
      state.bookingPricingComplete = payload;
    },
  },
});

const getActionsByBookingId = createAction(
  Actions.GET_FLIGHT_ACTIONS_BY_BOOKING_ID,
  (bookingId: string) => ({
    payload: { bookingId },
  }),
);

const issueTicket = createAction(
  Actions.ISSUE_TICKET,
  (
    id: string,
    info: IssueTicketForm,
    cb: (
      isSuccess: boolean,
      data: {
        listTicket: Array<Ticket>;
        error: {
          code: string;
          message: string;
        };
      },
    ) => void,
    autoUpdateBalance = true,
  ) => ({
    payload: { id, info, cb, autoUpdateBalance },
  }),
);

const voidTicket = createAction(
  Actions.VOID_TICKET,
  (
    id: string,
    form: VoidTicketForm,
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => ({
    payload: { id, form, cb },
  }),
);

const reBook = createAction(
  Actions.RE_BOOK,
  (
    id: string,
    form: ReBookForm,
    cb: (
      isSuccess: boolean,
      newData: {
        bookingCode: string;
        orderId: string;
        listTicket: Array<Ticket>;
      },
    ) => void,
  ) => ({
    payload: { id, form, cb },
  }),
);

const issueEMD = createAction(
  Actions.ISSUE_EMD,
  (
    id: string,
    info: IssueEMDForm,
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => ({
    payload: { id, info, cb },
  }),
);

const cancelBooking = createAction(
  Actions.CANCEL_BOOKING,
  (id: string, form: BookingCancelForm, cb: (isSuccess: boolean) => void) => ({
    payload: { id, form, cb },
  }),
);

const sendEmails = createAction(
  Actions.SEND_EMAILS,
  (id: string, form: EmailSendForm, cb: (isSuccess: boolean) => void) => ({
    payload: { id, form, cb },
  }),
);

const passengersSplit = createAction(
  Actions.SPLIT_PASSENGER,
  (form: SplitPassengersForm, cb: (isSuccess: boolean) => void) => ({
    payload: { form, cb },
  }),
);

const passengersUpdate = createAction(
  Actions.UPDATE_PASSENGER,
  (
    form: Omit<UpdatePassengerReq, 'RequestInfo'>,
    cb?: (isSuccess: boolean) => void,
  ) => ({
    payload: {
      form,
      cb,
    },
  }),
);

const passportUpdate = createAction(
  Actions.PASSPORT_UPDATE,
  (form: PassportUpdateForm, cb: (isSuccess: boolean) => void) => ({
    payload: { form, cb },
  }),
);

const membershipUpdate = createAction(
  Actions.MEMBER_SHIP_UPDATE,
  (form: MemberCardUpdateForm, cb: (isSuccess: boolean) => void) => ({
    payload: { form, cb },
  }),
);

const getAncillaries = createAction(
  Actions.GET_ANCILLARIES_ACTION_BOOKING,
  (bookingDetail: Booking) => ({
    payload: bookingDetail,
  }),
);

const getSeatMaps = createAction(
  Actions.GET_SEAT_MAP_ACTION_BOOKING,
  (bookingDetail: Booking) => ({
    payload: bookingDetail,
  }),
);

const updateSeatMap = createAction(
  Actions.UPDATE_SEAT_MAP,
  (
    data: {
      bookingDetail: Booking;
      passengers: Array<PassengerUpdateSeatMap>;
    },
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => ({
    payload: {
      ...data,
      cb,
    },
  }),
);

const updateAncillaries = createAction(
  Actions.UPDATE_ANCILLARIES,
  (
    data: {
      bookingDetail: Booking;
      autoIssue: boolean;
      passengers: Array<PassengerUpdateAncillary>;
    },
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => ({
    payload: {
      ...data,
      cb,
    },
  }),
);

const changeFlight = createAction(
  Actions.CHANGE_FLIGHT,
  (
    form: Omit<ChangeFlightReq, 'RequestInfo' | 'AutoIssue'>,
    cb: (isSuccess: boolean) => void,
  ) => ({
    payload: {
      form,
      cb,
    },
  }),
);

const refundTicket = createAction(
  Actions.REFUND_TICKET,
  (
    form: Omit<RefundTicketReq, 'RequestInfo'> & {
      isCancelBooking: boolean;
    },
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => ({
    payload: {
      form,
      cb,
    },
  }),
);

const updateContact = createAction(
  Actions.UPDATE_CONTACT,
  (id: string, info: UpdateContactForm, cb: (isSuccess: boolean) => void) => ({
    payload: { id, info, cb },
  }),
);

const exchangeTicket = createAction(
  Actions.EXCHANGE_TICKET,
  (
    form: Omit<ExchangeTicketReq, 'RequestInfo' | 'AutoIssue'> & {
      NewPrice: number;
    },
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => ({
    payload: {
      form,
      cb,
    },
  }),
);

const bookingPricing = createAction(
  Actions.BOOKING_PRICING,
  (
    params: {
      System: string;
      Airline: string;
      BookingCode: string;
      BookingId: string;
      AccountCode: string;
      Tourcode: string;
    },
    cb: (isSuccess: boolean) => void,
  ) => ({
    payload: { params, cb },
  }),
);

export const bookingActionReducer = slice.reducer;
export const bookingActionActions = {
  ...slice.actions,
  getActionsByBookingId,
  issueTicket,
  voidTicket,
  reBook,
  issueEMD,
  cancelBooking,
  sendEmails,
  passengersSplit,
  passengersUpdate,
  passportUpdate,
  membershipUpdate,
  getAncillaries,
  getSeatMaps,
  updateSeatMap,
  updateAncillaries,
  changeFlight,
  refundTicket,
  updateContact,
  exchangeTicket,
  bookingPricing,
};
