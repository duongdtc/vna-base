import { createSelector } from '@reduxjs/toolkit';
import { MinPrice } from '@services/axios/axios-ibe';
import { RootState } from '@store/all-reducers';

export const selectMinPrices = (id: number) =>
  createSelector(
    (state: RootState) => state.flightResultMonth,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    flightResultMonth => flightResultMonth[`stage${id}`] as Array<MinPrice>,
  );

export const selectViewChart = createSelector(
  (state: RootState) => state.flightResultMonth,
  flightResultMonth => flightResultMonth.viewChart,
);

export const selectResultMonthFilterForm = createSelector(
  (state: RootState) => state.flightResultMonth,
  flightResultMonth => flightResultMonth.filterForm,
);

export const selectResultMonthAirlines = createSelector(
  (state: RootState) => state.flightResultMonth,
  flightResultMonth => flightResultMonth.airlines,
);
