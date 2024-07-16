/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Text } from '@vna-base/components';
import { EventResultFlightType } from '@vna-base/screens/flight/type';
import { MinPrice } from '@services/axios/axios-ibe';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import { useStyles } from './styles';

export const Calendar = ({
  minPrices,
  onPressDate,
}: {
  minPrices: Array<MinPrice>;
  onPressDate: (index: number) => void;
}) => {
  const styles = useStyles();

  const minValue = useRef(Number.POSITIVE_INFINITY);

  const _minPrices = minPrices.map(minPrice => {
    const price =
      minPrice.ListFlightFare!.findMin('FareInfo.TotalFare').FareInfo!
        .TotalFare!;

    if (price < minValue.current) {
      minValue.current = price;
    }

    return { price, DepartDate: minPrice.DepartDate };
  });

  const events: Array<EventResultFlightType> = _minPrices.map(minPrice => ({
    title: '',
    price: minPrice.price,
    start: dayjs(minPrice.DepartDate).startOf('day').toDate(),
    end: dayjs(minPrice.DepartDate).endOf('day').toDate(),
    colorTheme: minPrice.price === minValue.current ? 'warning600' : undefined,
    fontStyle: minPrice.price === minValue.current ? 'Body8Bold' : undefined,
  }));

  const renderEvent = (event: EventResultFlightType) => (
    <Block
      flex={1}
      justifyContent="center"
      alignItems="center"
      pointerEvents="none">
      <Text
        fontStyle={event.fontStyle ?? 'Body8Med'}
        colorTheme={event.colorTheme ?? 'neutral700'}
        text={Number(event.price).currencyFormat()}
      />
    </Block>
  );

  const onPressCell = (date: Date) => {
    const idx = dayjs(date).diff(minPrices[0].DepartDate, 'day');
    onPressDate(idx);
  };

  return (
    <Block colorTheme="neutral100" height={270} paddingVertical={12}>
      <BigCalendar<EventResultFlightType>
        swipeEnabled={false}
        events={events}
        height={240}
        mode="month"
        onPressCell={onPressCell}
        locale="vi"
        date={dayjs(minPrices[0].DepartDate).toDate()}
        weekStartsOn={1}
        renderEvent={renderEvent}
        calendarCellStyle={styles.calendarCellStyle}
        customCellTextStyle={{
          today: styles.customCellTextStyleToday,
          weekendDay: styles.customCellTextStyleWeekendDay,
          normalDay: styles.customCellTextStyleNormalDay,
          disabledDay: styles.customCellTextStyleDisabledDay,
        }}
        customHeaderStyleForMonthView={{
          normalText: styles.customHeaderStyleForMonthViewNormalText,
          weekendText: styles.customHeaderStyleForMonthViewWeekendText,
          weekText: styles.customHeaderStyleForMonthViewWeekText,
          container: styles.customHeaderStyleForMonthViewContainer,
        }}
        maxDate={dayjs(minPrices[minPrices.length - 1].DepartDate).toDate()}
        minDate={dayjs(minPrices[0].DepartDate).toDate()}
      />
    </Block>
  );
};
