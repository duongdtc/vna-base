import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectResultFilterOrder = createSelector(
  (state: RootState) => state.order,
  order => order.resultFilter,
);

export const selectLoadingFilterOrder = createSelector(
  (state: RootState) => state.order,
  order => order.loadingFilter,
);

export const selectListOrderRemark = createSelector(
  (state: RootState) => state.order,
  order => order.listRemark,
);

export const selectListOrderActivity = createSelector(
  (state: RootState) => state.order,
  order => order.resultListActivity,
);

export const selectViewingOrderId = createSelector(
  (state: RootState) => state.order,
  order => order.viewingOrderId,
);
