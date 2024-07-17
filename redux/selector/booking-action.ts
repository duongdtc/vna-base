import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectFlightActionsByBookingId = (id: string) =>
  createSelector(
    (state: RootState) => state.bookingAction,
    flightAction => flightAction.actions[id],
  );

export const selectLoadingFlightAction = (id: string) =>
  createSelector(
    (state: RootState) => state.bookingAction.loadings,
    loadings => loadings[id],
  );

export const selectBaggagesActionBooking = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.baggages,
);

export const selectSeatMapsActionBooking = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.seatMaps,
);

export const selectServicesActionBooking = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.services,
);

export const selectIsLoadingSeatMapsActionBooking = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.isLoadingSeatMaps,
);

export const selectIsLoadingAncillariesActionBooking = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.isLoadingAncillaries,
);

export const selectPriceChangeFlight = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.priceChangeFlight,
);

export const selectRefundDoc = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.RefundDoc,
);

export const selectCurrentFeature = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.currentFeature,
);

export const selectPriceExchangeTicket = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.pricesExchangeTicket,
);

export const selectBookingPricingCompleted = createSelector(
  (state: RootState) => state.bookingAction,
  bookingAction => bookingAction.bookingPricingComplete,
);
