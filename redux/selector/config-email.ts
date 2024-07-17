import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/all-reducers';

export const selectConfigEmail = createSelector(
  (state: RootState) => state.configEmail,
  configEmail => configEmail.configEmail,
);

export const selectConfigEmailLanguages = createSelector(
  (state: RootState) => state.configEmail,
  configEmail => configEmail.languages,
);

export const selectConfigEmailTemplates = createSelector(
  (state: RootState) => state.configEmail,
  configEmail => configEmail.templates,
);
