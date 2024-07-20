import {
  Block,
  Button,
  DateRangePicker,
  DateRangePickerMode,
  Icon,
  RangeDate,
  Text,
  TextInput,
} from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/booking/type';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, BookingStatusDetails } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { FilterButton } from './filter-button';
import { useStyles } from './styles';
import { BookingStatusDetail } from '@vna-base/screens/booking-detail/type';
import { useTheme } from '@theme';
import { Opacity } from '@theme/color';
import { FontStyle } from '@theme/typography';

export const FilterBar = () => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { setValue, getValues, control } = useFormContext<FilterForm>();

  const handleDoneDatePicker = (range: RangeDate) => {
    setValue('Range', range);
  };

  const showDatePicker = () => {
    const { Range } = getValues();

    DateRangePicker.present(
      {
        minimumDate: dayjs().subtract(4, 'years').toDate(),
        t18nTitle: 'common:select_booking_date',
        mode: DateRangePickerMode.Range,
        allowDateRangeChanges: false,
        allowToChooseNilDate: false,
        t18nCancel: 'common:cancel',
        maximumDate: dayjs().toDate(),
        initialValue: Range,
      },
      handleDoneDatePicker,
    );
  };

  const ListBookingStatus = (({ ALL, OK, FAIL, TICKETED, CANCELED }) => ({
    ALL,
    OK,
    FAIL,
    TICKETED,
    CANCELED,
  }))(BookingStatusDetails);

  const renderStatusItem = useCallback<ListRenderItem<BookingStatusDetail>>(
    ({ item }) => (
      <Controller
        control={control}
        name="Filter"
        render={({ field: { value, onChange } }) => {
          const filteredStatusIndex = value.findIndex(
            it => it.Name === 'BookingStatus',
          );
          const isSelected = !(
            filteredStatusIndex === -1 ||
            value[filteredStatusIndex].Value !== item.key
          );

          return (
            <TouchableOpacity
              style={[
                styles.statusItemContainer,
                {
                  backgroundColor: colors[item.iconColorTheme] + Opacity[10],
                  borderColor: isSelected
                    ? colors.primary500
                    : colors.neutral100,
                },
              ]}
              activeOpacity={ActiveOpacity}
              onPress={() => {
                const newArr = [...value];

                if (isSelected) {
                  newArr.splice(filteredStatusIndex, 1);
                } else if (filteredStatusIndex === -1) {
                  //theem OrderStatus vào mảng
                  newArr.push({
                    Contain: true,
                    Name: 'BookingStatus',
                    Value: item.key,
                  });
                } else {
                  newArr[filteredStatusIndex].Value = item.key;
                }

                onChange(newArr);
              }}>
              {item.icon && (
                <Icon
                  icon={item.icon}
                  colorTheme={item.iconColorTheme}
                  size={13}
                />
              )}
              <Text
                t18n={item.t18n}
                textAlign="center"
                colorTheme="neutral900"
                fontStyle="Body12Med"
              />
            </TouchableOpacity>
          );
        }}
      />
    ),
    [colors, control, styles],
  );

  return (
    <Block paddingBottom={1} zIndex={9}>
      <Block colorTheme="neutral100" shadow=".3">
        <Block flexDirection="row" alignItems="center">
          <Button
            leftIcon="calendar_fill"
            leftIconSize={24}
            textColorTheme="neutral800"
            onPress={showDatePicker}
            padding={12}
          />
          <Block flex={1}>
            <TextInput
              size="small"
              left={
                <Icon icon="search_fill" size={20} colorTheme="neutral700" />
              }
              placeholder="Tìm kiếm mã booking"
              placeholderTextColor={colors.neutral700}
              style={FontStyle.Body14Reg}
            />
          </Block>
          <FilterButton />
        </Block>
        <Block>
          <FlatList
            data={Object.values(ListBookingStatus)}
            renderItem={renderStatusItem}
            contentContainerStyle={styles.statusContentContainer}
            horizontal
            keyExtractor={it => it.key}
            ItemSeparatorComponent={() => <Block width={8} />}
            showsHorizontalScrollIndicator={false}
          />
        </Block>
      </Block>
    </Block>
  );
};
