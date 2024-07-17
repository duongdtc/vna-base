import Actions from '@redux-action-type';
import { IAppState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeType } from '@theme';
import { ThemeOptions } from '@theme/type';
import { SLICE_NAME } from './constant';
import * as Keychain from 'react-native-keychain';
import { DEFAULT_FALLBACK_LNG_I18n } from '@env';
import { Language } from '@translations/type';

const initialAppState: IAppState = {
  internetState: true,
  language: DEFAULT_FALLBACK_LNG_I18n as Language,
  theme: 'light',
  themeOption: ThemeOptions.Light,
  supportedBiometryType: null,
};

const appSlice = createSlice({
  name: SLICE_NAME.APP,
  initialState: initialAppState,
  reducers: {
    // setUnReadNotification: (state, { payload }: PayloadAction<number>) => {
    //   state.unReadNotification = payload;
    // },
    saveLanguage: (state, { payload }: PayloadAction<Language>) => {
      state.language = payload;
    },
    setInternetState: (state, { payload }: PayloadAction<boolean>) => {
      state.internetState = payload;
    },
    setAppTheme: (state, { payload }: PayloadAction<ThemeType>) => {
      state.theme = payload;
    },
    setThemeOption: (state, { payload }: PayloadAction<ThemeOptions>) => {
      state.themeOption = payload;
    },
    setSupportedBiometryType: (
      state,
      { payload }: PayloadAction<Keychain.BIOMETRY_TYPE | null>,
    ) => {
      state.supportedBiometryType = payload;
    },
  },
});

const changeThemeOption = createAction(
  Actions.CHANGE_THEME_OPTION,
  (themeOption: ThemeOptions) => ({
    payload: themeOption,
  }),
);

const changeLanguage = createAction(
  Actions.CHANGE_LANGUAGE,
  (lang: Language) => ({
    payload: lang,
  }),
);

const startLoadApp = createAction(Actions.START_LOAD_APP, () => ({
  payload: undefined,
}));

export const appReducer = appSlice.reducer;
export const appActions = {
  ...appSlice.actions,
  changeThemeOption,
  changeLanguage,
  startLoadApp,
};
