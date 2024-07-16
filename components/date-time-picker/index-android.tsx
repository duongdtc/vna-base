import {
  DateTimePickerAndroid as DateTimePickerAndroidBase,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { forwardRef, memo, useImperativeHandle } from 'react';
import { DateTimePickerProps, DateTimePickerRef } from './type';

export const DateTimePickerAndroid = memo(
  forwardRef<DateTimePickerRef, DateTimePickerProps>((props, ref) => {
    const { maximumDate, minimumDate, submit } = props;

    const openTimePicker = (
      event: DateTimePickerEvent,
      date?: Date | undefined,
    ) => {
      if (event.type !== 'dismissed') {
        DateTimePickerAndroidBase.open({
          value: date ?? new Date(),
          onChange: (e, d) => {
            if (e.type !== 'dismissed') {
              submit(d!);
            }
          },
          mode: 'time',
        });
      }
    };

    /**
     *  open datepicker trước
     */
    const open = ({ date }: { date: Date }) => {
      DateTimePickerAndroidBase.open({
        value: date,
        onChange: openTimePicker,
        mode: 'date',
        maximumDate,
        minimumDate,
        is24Hour: true,
      });
    };

    useImperativeHandle(ref, () => ({
      open,
    }));

    return null;
  }),
  () => false,
);
