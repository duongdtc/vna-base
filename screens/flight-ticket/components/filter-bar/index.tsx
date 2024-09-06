/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createStyleSheet, useStyles } from '@theme';
import {
  Block,
  Button,
  DateRangePicker,
  DateRangePickerMode,
  RangeDate,
  Text,
} from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/flight-ticket/type';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  HitSlop,
  scale,
  TicketTypeDetail,
  TicketTypeDetails,
} from '@vna-base/utils';
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
import { SortButton } from './sort-button';

export const FilterBar = () => {
  const { styles } = useStyles(styleSheet);
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

  const renderTypeItem = useCallback<ListRenderItem<TicketTypeDetail>>(
    ({ item }) => (
      <Controller
        control={control}
        name="Filter"
        render={({ field: { value, onChange } }) => {
          const filteredTypeIndex = value.findIndex(
            it => it.Name === 'TicketType',
          );
          const isSelected = !(
            filteredTypeIndex === -1 ||
            value[filteredTypeIndex].Value !== item.key
          );

          return (
            <TouchableOpacity
              style={[styles.statusItemContainer(isSelected, item.colorTheme)]}
              activeOpacity={ActiveOpacity}
              onPress={() => {
                const newArr = [...value];

                if (isSelected) {
                  newArr.splice(filteredTypeIndex, 1);
                } else if (filteredTypeIndex === -1) {
                  //theem OrderStatus vào mảng
                  newArr.push({
                    Contain: true,
                    Name: 'TicketType',
                    Value: item.key,
                  });
                } else {
                  newArr[filteredTypeIndex].Value = item.key;
                }

                onChange(newArr);
              }}>
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
    [control, styles],
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
            data={Object.values(TicketTypeDetails)}
            renderItem={renderTypeItem}
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

const styleSheet = createStyleSheet(({ colors }) => ({
  statusItemContainer: (isSelected: boolean, itemBgTheme: any) => ({
    paddingHorizontal: scale(8),
    paddingVertical: 4,
    flexDirection: 'row',
    columnGap: 4,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    //@ts-ignore
    backgroundColor: colors[itemBgTheme],
    //@ts-ignore
    borderColor: isSelected ? colors[itemBgTheme + '0'] : colors.neutral10,
  }),
  statusContentContainer: {
    paddingHorizontal: scale(12),
    paddingTop: 4,
    paddingBottom: 2,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
}));
