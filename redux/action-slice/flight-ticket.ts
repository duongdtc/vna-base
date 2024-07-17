import Actions from '@redux-action-type';
import { FlightTicketState, ListDataFlightTicket } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { FilterForm } from '@vna-base/screens/flight-ticket/type';
import { SLICE_NAME } from './constant';

const initialState: FlightTicketState = {
  resultFilter: { list: [], pageIndex: 1, totalPage: 1 },
  isLoadingFilter: true,
  filterForm: null,
};

const flightTicketSlice = createSlice({
  name: SLICE_NAME.FLIGHT_TICKET,
  initialState: initialState,
  reducers: {
    saveResultFilter: (
      state,
      { payload }: PayloadAction<ListDataFlightTicket>,
    ) => {
      state.resultFilter = payload;
    },

    savedFilterForm: (state, { payload }: PayloadAction<FilterForm | null>) => {
      state.filterForm = payload;
    },

    changeIsLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingFilter = payload;
    },
  },
});

const getListFlightTicket = createAction(
  Actions.GET_LIST_FLIGHT_TICKET,
  (payload: { filterForm?: FilterForm; pageIndex?: number }) => ({
    payload,
  }),
);

const exportExcel = createAction(
  Actions.EXPORT_EXCEL_FLIGHT_TICKET,
  (filterForm: FilterForm) => ({
    payload: filterForm,
  }),
);

export const flightTicketActions = {
  ...flightTicketSlice.actions,
  getListFlightTicket,
  exportExcel,
};

export const flightTicketReducer = flightTicketSlice.reducer;
