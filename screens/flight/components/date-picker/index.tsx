/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  DateRangePicker,
  DateRangePickerMode,
  Icon,
  RangeDate,
  Separator,
  Text,
} from '@vna-base/components';
import {
  DateFlight,
  DatePickerProps,
  ModalMonthPickerRef,
  SearchForm,
} from '@vna-base/screens/flight/type';
import { createStyleSheet, useStyles, bs } from '@theme';
import {
  ActiveOpacity,
  getMonthName,
  getNameDay,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { ModalMonthPicker } from '../modal-month-picker';

export const DatePicker = memo(
  ({ style, roundTrip, selectBackDayDone, index }: DatePickerProps) => {
    const { styles } = useStyles(styleSheet);

    const { control, setValue, getValues } = useFormContext<SearchForm>();

    const byMonth = useWatch({
      control,
      name: 'ByMonth',
    });

    const dateFlight = useWatch({
      control,
      name: `Flights.${index}.date`,
    });

    const monthPickerRef = useRef<ModalMonthPickerRef>(null);

    const handleDoneDatePicker = (result: RangeDate | Date) => {
      const newVal = {
        //@ts-ignore
        departureDay: roundTrip ? result.from : result,
        //@ts-ignore
        backDay: result?.to,
      } as DateFlight;

      setValue(`Flights.${index}.date`, newVal);

      const flights = getValues().Flights;

      for (let i = index + 1; i < flights.length; ++i) {
        if (flights[i].date.departureDay < newVal.departureDay) {
          setValue(`Flights.${i}.date`, {
            departureDay: newVal.departureDay,
            backDay: undefined,
          });
        }
      }
    };

    const handleDoneMonthPicker = (result: RangeDate, isBackDay: boolean) => {
      const tempResult = result;
      if (dayjs(tempResult.from).isBefore(dayjs(), 'day')) {
        tempResult.from = dayjs().toDate();
      }

      setValue(`Flights.${index}.date`, {
        departureDay: tempResult.from,
        backDay: tempResult.to,
      });

      if (isBackDay) {
        selectBackDayDone?.();
      }

      const flights = getValues().Flights;

      for (let i = index + 1; i < flights.length; ++i) {
        if (
          dayjs(flights[i].date.departureDay).isBefore(
            tempResult.from,
            'months',
          )
        ) {
          setValue(`Flights.${i}.date`, {
            departureDay: tempResult.from,
            backDay: undefined,
          });
        }
      }
    };

    const handleDoneWhenChooseBackDay = (result: RangeDate) => {
      setValue(`Flights.${index}.date`, {
        departureDay: result.from,
        backDay: result.to,
      });

      selectBackDayDone?.();
    };

    const showDatePicker = () => {
      if (byMonth) {
        monthPickerRef.current?.present({
          initialValue: {
            from: dateFlight.departureDay,
            to: roundTrip ? dateFlight?.backDay : undefined,
          },
          minDate:
            getValues().Flights[index - 1]?.date.departureDay ?? new Date(),
          t18nTitle: 'flight:select_date',
          mode: roundTrip
            ? DateRangePickerMode.Range
            : DateRangePickerMode.Single,
        });
      } else {
        const cf = {
          t18nTitle: roundTrip ? 'flight:select_date' : 'flight:departure_day',
          allowDateRangeChanges: false,
          allowToChooseNilDate: false,
          minimumDate:
            getValues().Flights[index - 1]?.date.departureDay ?? new Date(),
          maximumDate: dayjs().add(1, 'y').toDate(),
          t18nCancel: 'common:cancel',
          initialValue: roundTrip
            ? { from: dateFlight.departureDay, to: dateFlight.backDay }
            : dateFlight.departureDay,
          mode: roundTrip
            ? DateRangePickerMode.Range
            : DateRangePickerMode.Single,
        };

        //@ts-ignore
        DateRangePicker.present(cf, handleDoneDatePicker);
      }
    };

    const onPressBackDay = () => {
      if (byMonth) {
        monthPickerRef.current?.present({
          initialValue: { from: dateFlight.departureDay, to: undefined },
          t18nTitle: 'flight:select_date',
          mode: DateRangePickerMode.Range,
          isBackDay: true,
          minDate:
            getValues().Flights[index - 1]?.date.departureDay ?? new Date(),
        });
      } else {
        const cf = {
          t18nTitle: 'flight:select_date',
          allowDateRangeChanges: false,
          allowToChooseNilDate: false,
          minimumDate:
            getValues().Flights[index - 1]?.date.departureDay ?? new Date(),
          maximumDate: dayjs().add(1, 'y').toDate(),
          t18nCancel: 'common:cancel',
          initialValue: { from: dateFlight.departureDay, to: undefined },
          mode: DateRangePickerMode.Range,
        };

        //@ts-ignore
        DateRangePicker.present(cf, handleDoneWhenChooseBackDay);
      }
    };

    const txtDay = useCallback(
      (d: Date) => {
        if (!roundTrip && !selectBackDayDone) {
          return '';
        }

        if (byMonth) {
          return dayjs(d).format('YYYY');
        }

        return getNameDay(dayjs(d).day());
      },
      [byMonth, roundTrip, selectBackDayDone],
    );

    const txtMain = useCallback(
      (d: Date) => {
        if (byMonth) {
          return getMonthName(dayjs(d).month());
        }

        const date = dayjs(d).format('DD/MM/YYYY');
        let txt = '';

        switch (true) {
          case !!selectBackDayDone:
            txt = '';
            break;

          case !roundTrip:
            txt = getNameDay(dayjs(d).day()) + ', ';
            break;

          default:
            break;
        }

        return txt + date;
      },
      [byMonth, roundTrip, selectBackDayDone],
    );

    return (
      <>
        <TouchableOpacity
          style={[styles.container, style]}
          onPress={showDatePicker}
          activeOpacity={ActiveOpacity}>
          <View style={styles.dateContainer}>
            <View style={bs.rowGap_4}>
              <Text
                t18n={byMonth ? 'flight:start' : 'flight:departure_day'}
                fontStyle="Body12Med"
                colorTheme="neutral70"
              />
              <Text
                text={txtMain(dateFlight.departureDay)}
                fontStyle="H320Semi"
                colorTheme="neutral100"
              />
              {txtDay(dateFlight.departureDay) !== '' && (
                <Text
                  text={txtDay(dateFlight.departureDay)}
                  fontStyle="Body12Med"
                  colorTheme="primaryPressed"
                />
              )}
            </View>
            {!roundTrip && !selectBackDayDone && (
              <Icon
                icon="calendar_fill"
                size={24}
                colorTheme="primaryPressed"
              />
            )}
          </View>
          {roundTrip && (
            <>
              <Separator type="vertical" height={56} />
              {dateFlight?.backDay ? (
                <View style={styles.dateContainer}>
                  <View style={bs.rowGap_4}>
                    <Text
                      t18n={byMonth ? 'flight:end' : 'flight:back_day'}
                      fontStyle="Body12Med"
                      colorTheme="neutral70"
                    />
                    <Text
                      text={txtMain(dateFlight.backDay)}
                      fontStyle="H320Semi"
                      colorTheme="neutral100"
                    />
                    {txtDay(dateFlight.backDay) !== '' && (
                      <Text
                        text={txtDay(dateFlight.backDay)}
                        fontStyle="Body12Med"
                        colorTheme="primaryPressed"
                      />
                    )}
                  </View>
                </View>
              ) : (
                <View style={[styles.dateContainer, styles.undefinedBackDay]}>
                  <Icon
                    icon="calendar_fill"
                    size={24}
                    colorTheme="primaryPressed"
                  />
                  <Text
                    t18n={byMonth ? 'flight:end' : 'flight:back_day'}
                    fontStyle="H320Semi"
                    colorTheme="neutral70"
                  />
                </View>
              )}
            </>
          )}
          {!!selectBackDayDone && (
            <>
              <Separator type="vertical" height={56} />
              <TouchableOpacity
                onPress={onPressBackDay}
                style={[styles.dateContainer, styles.undefinedBackDay]}
                activeOpacity={ActiveOpacity}>
                <Icon
                  icon="calendar_fill"
                  size={24}
                  colorTheme="primaryPressed"
                />
                <Text
                  t18n={byMonth ? 'flight:end' : 'flight:back_day'}
                  fontStyle="H320Semi"
                  colorTheme="neutral70"
                />
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
        <ModalMonthPicker
          ref={monthPickerRef}
          handleDone={handleDoneMonthPicker}
        />
      </>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, borders }) => ({
  container: {
    borderWidth: borders[5],
    flexDirection: 'row',
    borderRadius: scale(8),
    overflow: 'hidden',
    borderColor: colors.neutral40,
    alignItems: 'center',
    backgroundColor: colors.neutral10,
  },
  dateContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  undefinedBackDay: {
    justifyContent: 'flex-start',
    columnGap: scale(12),
  },
}));
