import { RootState } from '@store/all-reducers';
import { createSelector } from '@reduxjs/toolkit';

export const selectAppConfig = createSelector(
  (state: RootState) => state.app,
  app => ({
    theme: app.theme,
    themeOption: app.themeOption,
  }),
);

// export const selectUnreadNotification = createSelector(
//   (state: RootState) => state.app,
//   app => app.unReadNotification,
// );

export const selectSupportedBiometryType = createSelector(
  (state: RootState) => state.app,
  app => app.supportedBiometryType,
);

export const selectLanguage = createSelector(
  (state: RootState) => state.app,
  app => app.language,
);

export const selectThemeOption = createSelector(
  (state: RootState) => state.app,
  app => app.themeOption,
);

export const selectTheme = createSelector(
  (state: RootState) => state.app,
  app => app.theme,
);
