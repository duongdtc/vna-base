import {
  Block,
  DateRangePicker,
  DateRangePickerMode,
  Icon,
  RangeDate,
  Text,
} from '@vna-base/components';
import { selectBalanceInfo } from '@redux-selector';
import { TopupFilterForm } from '@vna-base/screens/topup-history/type';
import { translate } from '@vna-base/translations/translate';
import { CurrencyDetails } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

export const TopInfo = memo(() => {
  const { balance } = useSelector(selectBalanceInfo);

  const { setValue, getValues, control } = useFormContext<TopupFilterForm>();

  const handleDoneDatePicker = (range: RangeDate) => {
    setValue('Range', range);
  };

  const showDatePicker = () => {
    const rangeDate = getValues().Range;

    DateRangePicker.present(
      {
        minimumDate: dayjs().subtract(4, 'years').toDate(),
        t18nTitle: 'common:select_booking_date',
        mode: DateRangePickerMode.Range,
        allowDateRangeChanges: false,
        allowToChooseNilDate: false,
        t18nCancel: 'common:cancel',
        maximumDate: dayjs().toDate(),
        initialValue: rangeDate,
      },
      handleDoneDatePicker,
    );
  };

  return (
    <Block
      paddingVertical={8}
      paddingHorizontal={12}
      colorTheme="neutral100"
      borderBottomWidth={3}
      borderColorTheme="neutral300">
      <Block
        columnGap={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Block
          flex={1}
          colorTheme="neutral50"
          borderRadius={4}
          paddingVertical={8}
          paddingHorizontal={8}
          rowGap={4}>
          <Text
            text={`${translate('transaction_history:amount')} (${
              CurrencyDetails.VND.symbol
            })`}
            fontStyle="Body12Med"
            colorTheme="neutral800"
          />
          <Text
            text={balance.currencyFormat()}
            fontStyle="Title16Semi"
            colorTheme="success500"
          />
        </Block>
        <Pressable onPress={showDatePicker}>
          <Block
            rowGap={4}
            paddingVertical={8}
            borderBottomWidth={10}
            borderColorTheme="neutral200">
            <Text
              t18n="transaction_history:time_range"
              fontStyle="Body12Reg"
              colorTheme="neutral700"
            />
            <Controller
              control={control}
              name="Range"
              render={({ field: { value } }) => (
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon="calendar_fill"
                    size={14}
                    colorTheme="neutral800"
                  />
                  <Text
                    text={`${dayjs(value.from).format('DD/MM/YYYY')} - ${dayjs(
                      value.to,
                    ).format('DD/MM/YYYY')}`}
                    fontStyle="Body12Med"
                    colorTheme="neutral800"
                  />
                </Block>
              )}
            />
          </Block>
        </Pressable>
      </Block>
    </Block>
  );
}, isEqual);
