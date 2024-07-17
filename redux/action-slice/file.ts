import Actions from '@vna-base/redux/action-type';
import { IFileState, Process } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { SLICE_NAME } from './constant';
import { I18nKeys } from '@translations/locales';
import { PathInServer } from '@vna-base/utils';

const initialState: IFileState = {
  process: [],
};

const slide = createSlice({
  name: SLICE_NAME.FILE,
  initialState,
  reducers: {
    updateProcess: (
      state,
      { payload }: PayloadAction<{ process: Process; index: number }>,
    ) => {
      state.process[payload.index] = payload.process;
    },
  },
});

const uploadFiles = createAction(
  Actions.UPLOAD_FILES,
  (
    files: DocumentPickerResponse[],
    pathInServer: PathInServer,
    resolve?: (url: string[]) => void,
    reject?: (str: I18nKeys) => void,
  ) => ({
    payload: {
      files,
      pathInServer,
      resolve,
      reject,
    },
  }),
);

export const fileReducer = slide.reducer;
export const fileActions = {
  ...slide.actions,
  uploadFiles,
};
