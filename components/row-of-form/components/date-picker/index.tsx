/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Block,
  DatePicker as DatePickerBase,
  Icon,
  Text,
  DateTimePicker as DateTimePickerBase,
} from '@vna-base/components';
import { DatePickerRef } from '@vna-base/components/date-picker/type';
import {
  CommonProps,
  DatePicker as DatePickerType,
} from '@vna-base/components/row-of-form/type';
import { SortType } from '@services/axios';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useRef } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useStyles } from '../../styles';

export function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: DatePickerType & CommonProps<TFieldValues, TName>) {
  const styles = useStyles();
  const datePickerRef = useRef<DatePickerRef>(null);
  const {
    type,
    t18n,
    hideBottomSheet,
    control,
    name,
    isRequire,
    disable,
    fixedTitleFontStyle,
    colorThemeValue,
    ValueView,
    maximumDate,
    minimumDate,
    titleFontStyle,
    t18nDatePicker = 'booking:expiration_date',
    colorTheme = 'neutral100',
  } = props;

  const isDateTimePicker = useMemo(() => type === 'date-time-picker', [type]);

  const {
    field: { value: date, onChange: onChangeDate },
  } = useController({
    control: control,
    //@ts-ignore
    name: name,
  });

  const {
    field: { value: orderBy, onChange: onChangeOrderBy },
  } = useController({
    control: control,
    //@ts-ignore
    name: 'OrderBy',
  });

  const {
    field: { value: sortType, onChange: onChangeSortType },
  } = useController({
    control: control,
    //@ts-ignore
    name: 'SortType',
  });

  const val = useCallback(
    (d: Date) => {
      if (ValueView) {
        return ValueView(d);
      }

      return (
        <Text
          fontStyle="Body14Reg"
          colorTheme={colorThemeValue ?? 'neutral900'}
          text={dayjs(d).format(
            isDateTimePicker ? 'HH:mm DD/MM/YYYY' : 'DD/MM/YYYY',
          )}
        />
      );
    },
    [ValueView, colorThemeValue, isDateTimePicker],
  );

  const _onPressTitle = useCallback(() => {
    if (hideBottomSheet) {
      if (orderBy !== name) {
        onChangeOrderBy(name);
      } else {
        onChangeSortType(
          sortType === SortType.Asc ? SortType.Desc : SortType.Asc,
        );
      }

      hideBottomSheet();
    } else {
      datePickerRef.current?.open({
        date: date ? dayjs(date).toDate() : undefined,
      });
    }
  }, [
    date,
    hideBottomSheet,
    name,
    onChangeOrderBy,
    onChangeSortType,
    orderBy,
    sortType,
  ]);

  return (
    <Block flexDirection="row" alignItems="center" colorTheme={colorTheme}>
      <Pressable
        disabled={disable}
        style={[
          styles.leftContainer,
          { paddingLeft: orderBy === name ? 8 : 16 },
        ]}
        onPress={_onPressTitle}>
        {hideBottomSheet && orderBy === name && (
          <Icon
            icon={sortType === SortType.Asc ? 'sort_up_fill' : 'sort_down_fill'}
            colorTheme="primary500"
            size={18}
          />
        )}
        <Text
          t18n={t18n}
          colorTheme="neutral900"
          fontStyle={
            titleFontStyle ??
            (!fixedTitleFontStyle && date && date !== ''
              ? 'Title16Semi'
              : 'Body16Reg')
          }
        />
        {isRequire && (
          <Text text="*" fontStyle="Body16Reg" colorTheme="error500" />
        )}
      </Pressable>
      <Pressable
        disabled={disable}
        style={styles.rightContainer}
        onPress={() => {
          datePickerRef.current?.open({
            date: date ? dayjs(date).toDate() : undefined,
          });
        }}>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          {date ? (
            val(date)
          ) : (
            <Text
              fontStyle="Body14Reg"
              colorTheme="neutral700"
              text={isDateTimePicker ? '--:-- --/--/----' : '--/--/----'}
            />
          )}
          {!disable && (
            <Icon
              icon="arrow_ios_right_outline"
              colorTheme={date ? 'neutral900' : 'neutral700'}
              size={20}
            />
          )}
        </Block>
      </Pressable>
      {!disable &&
        (isDateTimePicker ? (
          <DateTimePickerBase
            ref={datePickerRef}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            t18nTitle={t18nDatePicker}
            submit={_date => onChangeDate(_date.toISOString())}
          />
        ) : (
          <DatePickerBase
            ref={datePickerRef}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            t18nTitle={t18nDatePicker}
            submit={_date => onChangeDate(_date.toISOString())}
          />
        ))}
    </Block>
  );
}
