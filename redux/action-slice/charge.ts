import Actions from '@redux-action-type';
import { ChargeState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Charge } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';
import { ModalFeeType } from '@vna-base/screens/order-detail/components/tab-contents/components/tab-booking/type';

const initialState: ChargeState = {
  charges: [],
  isLoadingCharge: false,
  historyGetChargesByOrderId: {},
};

const chargeSlice = createSlice({
  name: SLICE_NAME.CHARGE,
  initialState: initialState,
  reducers: {
    saveCharges: (state, { payload }: PayloadAction<Array<Charge>>) => {
      state.charges = payload;
    },
    saveIsLoadingCharges: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingCharge = payload;
    },

    saveHistoryGetCharges: (
      state,
      { payload }: PayloadAction<Record<string, number>>,
    ) => {
      state.historyGetChargesByOrderId = payload;
    },
  },
});

const getChargesByOrderId = createAction(
  Actions.GET_CHARGE_BY_ORDER_ID,
  // force dùng khi pull to refresh
  (orderId: string, force?: boolean) => ({
    payload: { orderId, force },
  }),
);

const updateFlightCharge = createAction(
  Actions.FLIGHT_CHARGE_UPDATE,
  (form: ModalFeeType, cb: () => void) => ({
    payload: { form, cb },
  }),
);

const deleteFlightCharge = createAction(
  Actions.FLIGHT_CHARGE_DELETE,
  (flChargeId: number, cb: () => void) => ({
    payload: { flChargeId, cb },
  }),
);

const insertFlightCharge = createAction(
  Actions.FLIGHT_CHARGE_INSERT,
  (form: ModalFeeType, cb: () => void) => ({
    payload: { form, cb },
  }),
);

export const chargeActions = {
  ...chargeSlice.actions,
  getChargesByOrderId,
  updateFlightCharge,
  deleteFlightCharge,
  insertFlightCharge,
};

export const chargeReducer = chargeSlice.reducer;
