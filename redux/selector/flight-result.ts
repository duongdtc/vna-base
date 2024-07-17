import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectListFlights = createSelector(
  (state: RootState) => state.flightResult,
  ({ listGroup, currentStage }) => listGroup[currentStage],
);

export const selectMultiFlights = createSelector(
  (state: RootState) => state.flightResult,
  ({ multiFlights, currentStage }) => (currentStage !== 0 ? [] : multiFlights),
);

export const selectCurrentStage = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.currentStage,
);

export const selectIsCryptic = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.isCryptic,
);

export const selectFilterForm = createSelector(
  (state: RootState) => state.flightResult,
  ({ filterForms, currentStage }) => filterForms?.[currentStage],
);

export const selectFareType = createSelector(
  (state: RootState) => state.flightResult,
  ({ filterForms, currentStage }) => filterForms?.[currentStage]?.Fare,
);

export const selectSort = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.sort,
);

export const selectFareRule = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.fareRule,
);

export const selectSession = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.session,
);

export const selectListSelectedFlight = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.listSelectedFlight,
);

export const selectMinFares = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.minFares,
);

export const selectCustomFeeTotal = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.customFeeTotal,
);

export const selectVerifiedFlights = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.verifiedFlights,
);

export const selectIsLoadingVerifiedFlights = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.isLoadingVerifiedFlights,
);

export const selectSearchDone = createSelector(
  (state: RootState) => state.flightResult,
  flightResult => flightResult.searchDone,
);
