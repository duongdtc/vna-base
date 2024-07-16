import { Button, DateTimePicker } from '@vna-base/components';
import { DateTimePickerRef } from '@vna-base/components/date-time-picker/type';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

export const DemoDateTimePicker = () => {
  const ref = useRef<DateTimePickerRef>(null);
  const [date, setDate] = useState<Date>(new Date());

  const showDatepicker = () => {
    ref.current?.open({ date });
  };

  return (
    <>
      <Button
        text={dayjs(date).format('DD/MM/YYYY HH:mm')}
        onPress={showDatepicker}
        textColorTheme="classicWhite"
        buttonColorTheme="primary500"
      />

      <DateTimePicker
        ref={ref}
        t18nTitle="book_flight_done:booking"
        minimumDate={new Date(2023, 10, 28, 10, 0)}
        maximumDate={new Date(2024, 0, 28, 10, 0)}
        submit={d => {
          setDate(d);
        }}
      />
    </>
  );
};
