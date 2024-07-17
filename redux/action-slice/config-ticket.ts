/* eslint-disable @typescript-eslint/ban-ts-comment */
import Actions from '@redux-action-type';
import { ConfigTicketState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ConfigTicketForm } from '@vna-base/screens/config-ticket/type';
import { Content, Eticket } from '@services/axios/axios-data';
import { ETicket } from '@services/axios/axios-email';
import { LanguageSystem, LanguageSystemDetail } from '@vna-base/utils';
import { SLICE_NAME } from './constant';

const initialState: ConfigTicketState = {
  configTicket: {},
  //@ts-ignore
  languages: {},
  templates: {},
};

const configTicketSlice = createSlice({
  name: SLICE_NAME.CONFIG_TICKET,
  initialState: initialState,
  reducers: {
    saveConfigTicket: (state, { payload }: PayloadAction<Eticket>) => {
      state.configTicket = payload;
    },
    saveTemplates: (
      state,
      { payload }: PayloadAction<Record<string, ETicket>>,
    ) => {
      state.templates = payload;
    },
    saveLanguages: (
      state,
      {
        payload,
      }: PayloadAction<
        Record<
          LanguageSystem,
          LanguageSystemDetail & { contents: Array<Content> }
        >
      >,
    ) => {
      state.languages = payload;
    },
  },
});

const getConfigTicket = createAction(Actions.GET_CONFIG_TICKET, () => ({
  payload: undefined,
}));

const updateConfigTicket = createAction(
  Actions.UPDATE_CONFIG_TICKET,
  (data: ConfigTicketForm, cb: (isSuccess: boolean) => void) => ({
    payload: { data, cb },
  }),
);

const getLanguages = createAction(
  Actions.GET_LANGUAGES_TICKET,
  (configEmailId?: string | null) => ({
    payload: { configEmailId },
  }),
);

const getTemplates = createAction(Actions.GET_TICKET_TEMPLATES, () => ({
  payload: undefined,
}));

export const configTicketActions = {
  ...configTicketSlice.actions,
  getConfigTicket,
  getTemplates,
  updateConfigTicket,
  getLanguages,
};

export const configTicketReducer = configTicketSlice.reducer;
