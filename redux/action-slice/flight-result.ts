import { FareRuleParams } from '@navigation/type';
import Actions from '@vna-base/redux/action-type';
import { CustomFeeTotal, FlightResultState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import {
  AirOptionCustom,
  ApplyFlightFee,
  ApplyPassengerFee,
  CustomFeeForm,
  FilterForm,
  Sort,
} from '@vna-base/screens/flight/type';
import {
  AirOption,
  FareRule,
  FlightFare,
  MinFare,
  OptionGroup,
  SessionInfo,
} from '@services/axios/axios-ibe';
import { StorageKey, load } from '@vna-base/utils';
import { SLICE_NAME } from './constant';

const initialState: FlightResultState = {
  isCryptic: !!load(StorageKey.IS_CRYPTIC_FLIGHT),
  filterForms: null,
  currentStage: 0,
  listGroup: [
    { ListAirOption: [] },
    { ListAirOption: [] },
    { ListAirOption: [] },
    { ListAirOption: [] },
  ],
  multiFlights: [],

  sort: {
    OrderField: 'Fare',
    OrderType: 'Asc',
  },
  session: '',
  fareRule: null,
  listSelectedFlight: [],
  verifiedFlights: [],
  isLoadingVerifiedFlights: false,
  minFares: [[]],
  customFeeTotal: {
    TotalFare: 0,
    BaseFare: 0,
    Total: 0,
    PriceAdt: 0,
    PriceAdtForAll: 0,
    PriceChd: 0,
    PriceInf: 0,
    disable: false,
    ADT: '0',
    CHD: '0',
    INF: '0',
    applyFLight: ApplyFlightFee.PerSegment,
    applyPassenger: ApplyPassengerFee.PerPassenger,
  },
  searchDone: false,
};

const flightResultSlice = createSlice({
  name: SLICE_NAME.FLIGHT_RESULT,
  initialState: initialState,
  reducers: {
    saveSearchDone: (state, { payload }: PayloadAction<boolean>) => {
      state.searchDone = payload;
    },

    changeCurrentStage: (state, { payload }: PayloadAction<number>) => {
      state.currentStage = payload;
    },
    saveFilterForms: (state, { payload }: PayloadAction<Array<FilterForm>>) => {
      state.filterForms = payload;
    },
    saveIsCryptic: (state, { payload }: PayloadAction<boolean>) => {
      state.isCryptic = payload;
    },
    saveListGroup: (state, { payload }: PayloadAction<Array<OptionGroup>>) => {
      state.listGroup = payload;
    },
    saveMultiFlights: (state, { payload }: PayloadAction<Array<AirOption>>) => {
      state.multiFlights = payload;
    },
    saveSession: (state, { payload }: PayloadAction<string>) => {
      state.session = payload;
    },
    saveFareRule: (
      state,
      {
        payload,
      }: PayloadAction<{
        type: 'Custom' | 'Terminal';
        list: Array<FareRule>;
      } | null>,
    ) => {
      state.fareRule = payload;
    },
    clearSearchResult: (state, { payload }: PayloadAction<boolean>) => {
      state.listGroup = initialState.listGroup;
      state.multiFlights = initialState.multiFlights;
      state.session = initialState.session;
      state.listSelectedFlight = initialState.listSelectedFlight;
      state.verifiedFlights = initialState.verifiedFlights;
      state.customFeeTotal = initialState.customFeeTotal;
      state.searchDone = initialState.searchDone;

      if (payload) {
        state.filterForms = initialState.filterForms;
        state.currentStage = initialState.currentStage;
      }
    },
    saveCustomFeeTotal: (
      state,
      { payload }: PayloadAction<CustomFeeTotal & CustomFeeForm>,
    ) => {
      state.customFeeTotal = payload;
    },
    changeDisableCustomFeeTotal: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.customFeeTotal.disable = payload;
    },
    saveSort: (state, { payload }: PayloadAction<Sort>) => {
      state.sort = payload;
    },
    saveListSelectedFlight: (
      state,
      { payload }: PayloadAction<Array<AirOptionCustom>>,
    ) => {
      state.listSelectedFlight = payload;
      // state.progress = 0;
    },
    saveVerifiedFlights: (
      state,
      { payload }: PayloadAction<Array<FlightFare>>,
    ) => {
      state.verifiedFlights = payload;
      // state.progress = 0;
    },
    changeIsLoadingVerifiedFlights: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isLoadingVerifiedFlights = payload;
    },
    reset: () => {},
    saveMinFares: (
      state,
      {
        payload,
      }: PayloadAction<Array<Array<{ minFare: MinFare | null; date: Date }>>>,
    ) => {
      state.minFares = payload;
    },
  },
});

const getFareRule = createAction(
  Actions.GET_FARE_RULE,
  (data: FareRuleParams) => ({
    payload: data,
  }),
);

const getMinFares = createAction(Actions.GET_MIN_FARE, () => ({
  payload: undefined,
}));

const changeMinimize = createAction(Actions.CHANGE_MINIMIZE, () => ({
  payload: undefined,
}));

const saveCustomFee = createAction(
  Actions.SAVE_CUSTOM_FEE,
  (customFee: CustomFeeForm) => ({
    payload: customFee,
  }),
);

const calCustomFeeTotal = createAction(
  Actions.CAL_CUSTOM_FEE,
  (form: CustomFeeForm) => ({
    payload: form,
  }),
);

const copyFareReportToClipboard = createAction(
  Actions.COPY_FARE_REPORT_TO_CLIP_BOARD,
  () => ({
    payload: undefined,
  }),
);

const verifyFlights = createAction(
  Actions.VERIFY_FLIGHT,
  (
    flights: Array<SessionInfo>,
    cb: (data: {
      verifiedFlights: Array<FlightFare>;
      errMsg: string | null | undefined;
    }) => void,
  ) => ({
    payload: { flights, cb },
  }),
);

export const flightResultActions = {
  ...flightResultSlice.actions,
  getFareRule,
  getMinFares,
  changeMinimize,
  saveCustomFee,
  copyFareReportToClipboard,
  calCustomFeeTotal,
  verifyFlights,
};

export const flightResultReducer = flightResultSlice.reducer;
