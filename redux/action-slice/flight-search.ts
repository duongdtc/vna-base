import Actions from '@vna-base/redux/action-type';
import { FlightSearchState, Route } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { SearchForm } from '@vna-base/screens/flight/type';
import { MinPrice } from '@services/axios/axios-ibe';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import { SLICE_NAME } from './constant';

const initialState: FlightSearchState = {
  notification: null,
  // notification: {
  //   title: 'Thông báo về hạn chế di chuyển.',
  //   url: 'https://www.facebook.com/',
  // },
  CACodes: [
    { code: '8723H', title: 'BESTFLIGHT', describe: 'Giảm 40% Business' },
    { code: '872Hd', title: 'ENJOYFLYING', describe: 'Giảm 50% Skyboss' },
  ],
  searchForm: {
    Passengers: { Adt: 1, Chd: 0, Inf: 0 },
    Flights: [
      {
        airport: {
          takeOff: undefined,
          landing: undefined,
        },
        date: {
          departureDay: dayjs().add(3, 'days').toDate(),
          backDay: dayjs().add(6, 'days').toDate(),
        },
      },
      {
        airport: {
          takeOff: undefined,
          landing: undefined,
        },
        date: {
          departureDay: dayjs().add(6, 'days').toDate(),
          backDay: dayjs().add(9, 'days').toDate(),
        },
      },
    ],
    SeatClass: null,
    FareType: null,
    PassengerSearchType: null,
    Corporation: '',
    Nearby: true,
    Straight: true,
    ByMonth: false,
    Type: 'OneStage',
  },
  routes: [],
};

const flightSearchSlice = createSlice({
  name: SLICE_NAME.FLIGHT_SEARCH,
  initialState: initialState,
  reducers: {
    saveSearchForm: (
      state,
      {
        payload,
      }: PayloadAction<{
        form: SearchForm;
        routes: Array<Route>;
      }>,
    ) => {
      state.searchForm = payload.form;
      state.routes = payload.routes;
    },
    reset: state => {
      const newSearchForm = cloneDeep(initialState.searchForm);

      state.searchForm = newSearchForm;
      state.routes = initialState.routes;
    },
  },
});

const searchFlights = createAction(
  Actions.SEARCH_FLIGHTS,
  (
    form?: SearchForm,
    date?: Date,
    minPrices?: Array<
      MinPrice & {
        Leg: number;
      }
    >,
  ) => ({
    payload: { form, date, minPrices },
  }),
);

const searchFlightByMonth = createAction(
  Actions.SEARCH_FLIGHTS_BY_MONTH,
  (leg: number, date: Date) => ({
    payload: { leg, date },
  }),
);

export const flightSearchActions = {
  ...flightSearchSlice.actions,
  searchFlights,
  searchFlightByMonth,
};

export const flightSearchReducer = flightSearchSlice.reducer;
