import Actions from '@vna-base/redux/action-type';
import { FlightBookingFormState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlightOfPassengerForm, PassengerForm } from '@vna-base/screens/flight/type';
import { Ancillary, BookFlightRes, SeatMap } from '@services/axios/axios-ibe';
import { BookFlight } from '@vna-base/utils';
import { SLICE_NAME } from './constant';

const initialState: FlightBookingFormState = {
  baggages: {},
  seatMaps: {},
  services: {},
  isLoadingSeatMaps: false,
  isLoadingAncillaries: false,
  passengersForm: null,
  quickInfoPassengers: '',
  encodeFlightInfoAncillary: null,
  encodeFlightInfoPreSeat: null,
};

const flightBookingFormSlice = createSlice({
  name: SLICE_NAME.FLIGHT_BOOKING_FORM,
  initialState: initialState,
  reducers: {
    clearSearchResult: (state, { payload }: PayloadAction<boolean>) => {
      state.baggages = initialState.baggages;
      state.services = initialState.services;
      state.seatMaps = initialState.seatMaps;
      state.quickInfoPassengers = '';
      if (payload) {
        state.passengersForm = null;
      }
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
    savePassengerForm: (
      state,
      {
        payload,
      }: PayloadAction<
        Pick<PassengerForm, 'Passengers' | 'ContactInfo' | 'SubmitOption'>
      >,
    ) => {
      state.passengersForm = payload;
    },
    saveQuickInputInfo: (state, { payload }: PayloadAction<string>) => {
      state.quickInfoPassengers = payload;
    },
    saveEncodeFlightInfoAncillary: (
      state,
      { payload }: PayloadAction<string | null>,
    ) => {
      state.encodeFlightInfoAncillary = payload;
    },
    saveEncodeFlightInfoPreSeat: (
      state,
      { payload }: PayloadAction<string | null>,
    ) => {
      state.encodeFlightInfoPreSeat = payload;
    },
  },
});

const getAncillaries = createAction(
  Actions.GET_ANCILLARIES,
  (flights: Array<FlightOfPassengerForm>) => ({
    payload: flights,
  }),
);

const getSeatMaps = createAction(
  Actions.GET_SEAT_MAPS,
  (flights: Array<FlightOfPassengerForm>) => ({
    payload: flights,
  }),
);

const bookFlight = createAction(
  Actions.BOOK_FLIGHT,
  (
    form: PassengerForm,
    callback: (
      success: boolean,
      orderInfo: Pick<BookFlightRes, 'OrderId' | 'ListBooking'> & {
        Type: BookFlight;
      },
    ) => void,
  ) => ({
    payload: { form, callback },
  }),
);

export const flightBookingFormActions = {
  ...flightBookingFormSlice.actions,
  getSeatMaps,
  getAncillaries,
  bookFlight,
};

export const flightBookingFormReducer = flightBookingFormSlice.reducer;
