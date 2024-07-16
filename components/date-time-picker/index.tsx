import React, { forwardRef, memo } from 'react';
import { Platform } from 'react-native';
import { DateTimePickerAndroid } from './index-android';
import { DateTimePickerIOS } from './index-ios';
import { DateTimePickerProps, DateTimePickerRef } from './type';

export const DateTimePicker = memo(
  forwardRef<DateTimePickerRef, DateTimePickerProps>((props, ref) =>
    Platform.OS === 'android' ? (
      <DateTimePickerAndroid ref={ref} {...props} />
    ) : (
      <DateTimePickerIOS ref={ref} {...props} />
    ),
  ),
  () => true,
);
