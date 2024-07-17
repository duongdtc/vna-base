import Actions from '@vna-base/redux/action-type';
import { BookingState, ListData } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterForm } from '@vna-base/screens/booking/type';
import { Booking } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';

const initialState: BookingState = {
  resultFilter: { list: [], pageIndex: 1, totalPage: 1 },
  loadingFilter: true,
  filterForm: null,
  viewingBookingId: null,
  historyGetDetail: {},
  loadingBookings: {},
  viewingBookingVersion: null,
};

const bookingSlice = createSlice({
  name: SLICE_NAME.BOOKING,
  initialState: initialState,
  reducers: {
    saveResultFilter: (state, { payload }: PayloadAction<ListData>) => {
      state.resultFilter = payload;
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },

    savedFilterForm: (state, { payload }: PayloadAction<FilterForm | null>) => {
      state.filterForm = payload;
    },

    saveViewingBookingId: (
      state,
      { payload }: PayloadAction<string | null>,
    ) => {
      state.viewingBookingId = payload;
    },

    saveHistoryGetDetail: (
      state,
      { payload }: PayloadAction<Record<string, number>>,
    ) => {
      state.historyGetDetail = payload;
    },

    saveLoadingBooking: (
      state,
      { payload }: PayloadAction<Record<string, boolean>>,
    ) => {
      state.loadingBookings = {
        ...state.loadingBookings,
        ...payload,
      };
    },
    saveViewingBookingVersion: (
      state,
      { payload }: PayloadAction<Booking | null>,
    ) => {
      state.viewingBookingVersion = payload;
    },
  },
});

const getListBookings = createAction(
  Actions.GET_LIST_BOOKING,
  (payload: { filterForm?: FilterForm; pageIndex?: number }) => ({
    payload,
  }),
);

const exportExcel = createAction(
  Actions.EXPORT_EXCEL_BOOKING,
  (filterForm: FilterForm) => ({
    payload: { filterForm },
  }),
);

const getBookingByIdOrBookingCode = createAction(
  Actions.GET_BOOKING_DETAIL_BY_ID_BOOKING_CODE,
  (
    data: {
      id?: string;
      system: string;
    } ,
    option?: { isViewing?: boolean; withLoading?: boolean; force?: boolean },
    cb?: (
      isSuccess: boolean,
      data: {
        bookingId: string | null | undefined;
        bookingCode: string | null | undefined;
        surname: string | null | undefined;
      },
    ) => void,
  ) => ({
    payload: { ...data, option, cb },
  }),
);

const updateBooking = createAction(
  Actions.UPDATE_BOOKING,
  (
    item: Booking,
    isLoadingModal?: boolean,
    cb?: (isSuccess: boolean) => void,
  ) => ({
    payload: { item, isLoadingModal, cb },
  }),
);

const getBookingVersionDetail = createAction(
  Actions.GET_BOOKING_VERSION_DETAIL,
  (id: string) => ({
    payload: { id },
  }),
);

/**
 * Xoá mảng các booking
 */
const deleteBookings = createAction(
  Actions.DELETE_BOOKING,
  /**
   * @param ids mảng các id
   */
  (ids: Array<string>, cb: () => void) => ({
    payload: { ids, cb },
  }),
);

export const bookingActions = {
  ...bookingSlice.actions,
  getListBookings,
  exportExcel,
  getBookingByIdOrBookingCode,
  updateBooking,
  deleteBookings,
  getBookingVersionDetail,
};

export const bookingReducer = bookingSlice.reducer;
