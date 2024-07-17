import Actions from '@redux-action-type';
import { EmailState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ETicket, EmailModel } from '@services/axios/axios-email';
import { SLICE_NAME } from './constant';
import { EmailForm } from '@vna-base/screens/order-email/type';

const initState: EmailState = {
  email: {},
  eTickets: {},
  isLoadingEmail: false,
  isLoadingETicket: false,
};

const emailSlide = createSlice({
  name: SLICE_NAME.EMAIL,
  initialState: initState,
  reducers: {
    saveEmail: (state, { payload }: PayloadAction<EmailModel>) => {
      state.email = payload;
    },
    saveETicket: (
      state,
      { payload }: PayloadAction<Record<string, Array<ETicket>>>,
    ) => {
      state.eTickets = payload;
    },
    changeIsLoadingEmail: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingEmail = payload;
    },
    changeIsLoadingETicket: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingETicket = payload;
    },
  },
});

const getEmail = createAction(Actions.GET_EMAIL, (form: EmailForm) => ({
  payload: form,
}));

const getETickets = createAction(
  Actions.GET_E_TICKET,
  (form: EmailForm & { bookingIds: Array<string> }) => ({
    payload: form,
  }),
);

const sendCustomEmail = createAction(
  Actions.SEND_CUSTOM_EMAIL,
  (form: EmailForm, cb?: (isSuccess: boolean) => void) => ({
    payload: { ...form, cb },
  }),
);

export const emailReducer = emailSlide.reducer;
export const emailActions = {
  ...emailSlide.actions,
  getEmail,
  getETickets,
  sendCustomEmail,
};
