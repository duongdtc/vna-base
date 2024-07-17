import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectBaggages = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.baggages,
);

export const selectSeatMaps = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.seatMaps,
);

export const selectServices = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.services,
);

export const selectIsLoadingSeatMaps = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.isLoadingSeatMaps,
);

export const selectIsLoadingAncillaries = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.isLoadingAncillaries,
);

export const selectQuickInputInfoPassengers = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.quickInfoPassengers,
);

export const selectEncodeFlightInfoAncillary = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.encodeFlightInfoAncillary,
);

export const selectEncodeFlightInfoPreSeat = createSelector(
  (state: RootState) => state.flightBookingForm,
  flightBookingForm => flightBookingForm.encodeFlightInfoPreSeat,
);
