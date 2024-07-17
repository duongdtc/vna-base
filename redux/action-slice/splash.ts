import { SplashState } from '@redux/type';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SLICE_NAME } from './constant';

const initialState: SplashState = {
  isMounted: false,
};

const splashSlice = createSlice({
  name: SLICE_NAME.SPLASH,
  initialState: initialState,
  reducers: {
    setIsMounted: (state, { payload }: PayloadAction<boolean>) => {
      state.isMounted = payload;
    },
  },
});

export const { reducer: splashReducer, actions: splashActions } = splashSlice;
