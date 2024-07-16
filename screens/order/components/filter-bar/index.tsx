import {
  Block,
  Button,
  DateRangePicker,
  DateRangePickerMode,
  Icon,
  RangeDate,
  Text,
} from '@vna-base/components';
import { FilterForm, OrderStatusDetail } from '@vna-base/screens/order/type';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, HitSlop, OrderStatusDetails } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { FilterButton } from './filter-button';
import { useStyles } from './styles';
import { SortButton } from './sort-button';
import { useTheme } from '@theme';

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

  const renderStatusItem = useCallback<ListRenderItem<OrderStatusDetail>>(
    ({ item }) => (
      <Controller
        control={control}
        name="Filter"
        render={({ field: { value, onChange } }) => {
          const filteredStatusIndex = value.findIndex(
            it => it.Name === 'OrderStatus',
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
                  backgroundColor: colors[item.colorTheme],
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
                    Name: 'OrderStatus',
                    Value: item.key,
                  });
                } else {
                  newArr[filteredStatusIndex].Value = item.key;
                }

                onChange(newArr);
              }}>
              <Icon
                icon={item.icon}
                colorTheme={item.iconColorTheme}
                size={13}
              />
              <Text
                t18n={item.t18n}
                colorTheme="neutral900"
                fontStyle="Body12Med"
              />
            </TouchableOpacity>
          );
        }}
      />
    ),
    [colors, control, styles.statusItemContainer],
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
            hitSlop={HitSlop.Large}
          />
          <Controller
            control={control}
            name="Range"
            render={({ field: { value } }) => (
              <Pressable style={styles.dateContainer} onPress={showDatePicker}>
                <Text
                  text={translate('common:from_to_with_params', {
                    from: dayjs(value.from).format('DD/MM/YYYY'),
                    to: dayjs(value.to).format('DD/MM/YYYY'),
                  })}
                  fontStyle="Body14Reg"
                  colorTheme="neutral800"
                />
              </Pressable>
            )}
          />
          <FilterButton />
          <SortButton />
        </Block>
        <Block>
          <FlatList
            data={Object.values(OrderStatusDetails)}
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
