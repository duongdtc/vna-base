/* eslint-disable @typescript-eslint/ban-ts-comment */
import Actions from '@vna-base/redux/action-type';
import { ConfigEmailState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { ConfigEmailForm } from '@vna-base/screens/config-email/type';
import { Content, Email } from '@services/axios/axios-data';
import { LanguageSystem, LanguageSystemDetail } from '@vna-base/utils';
import { SLICE_NAME } from './constant';

const initialState: ConfigEmailState = {
  configEmail: {},
  //@ts-ignore
  languages: {},
  templates: {},
};

const configEmailSlice = createSlice({
  name: SLICE_NAME.CONFIG_EMAIL,
  initialState: initialState,
  reducers: {
    saveConfigEmail: (state, { payload }: PayloadAction<Email>) => {
      state.configEmail = payload;
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
    saveTemplates: (
      state,
      { payload }: PayloadAction<Record<string, string | null | undefined>>,
    ) => {
      state.templates = payload;
    },
  },
});

const getConfigEmail = createAction(Actions.GET_CONFIG_EMAIL, () => ({
  payload: undefined,
}));

const getLanguages = createAction(
  Actions.GET_LANGUAGES_EMAIL,
  (configEmailId?: string | null) => ({
    payload: { configEmailId },
  }),
);

const getTemplates = createAction(Actions.GET_EMAIL_TEMPLATES, () => ({
  payload: undefined,
}));

const updateConfigEmail = createAction(
  Actions.UPDATE_CONFIG_EMAIL,
  (data: ConfigEmailForm, cb: (isSuccess: boolean) => void) => ({
    payload: { data, cb },
  }),
);

export const configEmailActions = {
  ...configEmailSlice.actions,
  getConfigEmail,
  getTemplates,
  getLanguages,
  updateConfigEmail,
};

export const configEmailReducer = configEmailSlice.reducer;
