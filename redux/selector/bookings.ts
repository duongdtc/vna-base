import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultFilterBooking = createSelector(
  (state: RootState) => state.bookings,
  booking => booking.resultFilter,
);

export const selectLoadingFilterBooking = createSelector(
  (state: RootState) => state.bookings,
  booking => booking.loadingFilter,
);

export const selectViewingBookingId = createSelector(
  (state: RootState) => state.bookings,
  bookings => bookings.viewingBookingId,
);

export const selectBookingFilterForm = createSelector(
  (state: RootState) => state.bookings,
  booking => booking.filterForm,
);

export const selectLoadingBooking = (id: string) =>
  createSelector(
    (state: RootState) => state.bookings.loadingBookings,
    loadings => loadings[id],
  );

export const selectViewingBookingVersion = createSelector(
  (state: RootState) => state.bookings,
  bookings => bookings.viewingBookingVersion,
);
