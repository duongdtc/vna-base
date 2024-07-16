import { Block, CheckBox, Icon, Separator, Text } from '@vna-base/components';
import { translate } from '@vna-base/translations/translate';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import { BookingCancelForm } from '../../type';
import { useStyles } from './styles';

export const ListRoute = () => {
  const styles = useStyles();
  const { control } = useFormContext<BookingCancelForm>();

  const isCancelAll = useWatch({
    control: control,
    name: 'isCancelAll',
  });

  const { fields } = useFieldArray({
    name: 'routes',
    control,
    rules: {
      validate: routes =>
        routes.reduce((total, r) => total || r.isSelected, false),
    },
  });

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<BookingCancelForm, 'routes', 'id'>>
  >(
    ({ item, index }) => {
      return (
        <Controller
          control={control}
          name={`routes.${index}.isSelected`}
          render={({ field: { onChange, value } }) => (
            <Pressable
              disabled={isCancelAll}
              style={[styles.itemContainer, isCancelAll && styles.disabledItem]}
              onPress={() => {
                onChange(!value);
              }}>
              <Block flex={1} rowGap={4}>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Text
                    text={`${item.Airline}${item.FlightNumber}`}
                    fontStyle="Body12Bold"
                    colorTheme="primary600"
                  />
                  <Block width={1} height={10} colorTheme="neutral400" />
                  <Text
                    text={`${translate('policy_detail:fare_class')}:`}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                  <Text
                    text={
                      item.FareBasis
                        ? `${item.FareClass}_${item.FareBasis}`
                        : (item.FareClass as string)
                    }
                    fontStyle="Body12Bold"
                    colorTheme="primary600"
                  />
                </Block>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Text
                    text={item.StartPoint as string}
                    fontStyle="Body14Semi"
                    colorTheme="primary900"
                  />
                  <Icon icon="arrow_list" size={12} colorTheme="neutral900" />
                  <Text
                    text={item.EndPoint as string}
                    fontStyle="Body14Semi"
                    colorTheme="primary900"
                  />
                  <Block width={1} height={10} colorTheme="neutral400" />
                  <Text
                    text={dayjs(item.DepartDate).format('DD/MM/YYYY')}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                  <Text
                    text={dayjs(item.DepartDate).format('HH:MM')}
                    fontStyle="Body12Med"
                    colorTheme="neutral900"
                  />
                  <Text
                    text="-"
                    fontStyle="Body12Med"
                    colorTheme="neutral900"
                  />
                  <Text
                    text={dayjs(item.ArriveDate).format('HH:MM')}
                    fontStyle="Body12Med"
                    colorTheme="neutral900"
                  />
                </Block>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon={
                      item.Status === 'HK'
                        ? 'checkmark_circle_fill'
                        : 'alert_circle_fill'
                    }
                    colorTheme={
                      item.Status === 'HK' ? 'success500' : 'error500'
                    }
                    size={16}
                  />
                  <Text
                    text={`${item.Status} - ${
                      item.Status === 'HK'
                        ? translate('booking:confirm')
                        : translate('booking:not_confirm')
                    }`}
                    fontStyle="Body12Reg"
                    colorTheme="neutral900"
                  />
                </Block>
              </Block>
              <Block paddingHorizontal={8} justifyContent="center">
                <CheckBox disable value={value} />
              </Block>
            </Pressable>
          )}
        />
      );
    },
    [control, isCancelAll, styles.itemContainer, styles.disabledItem],
  );

  return (
    <FlatList
      scrollEnabled={false}
      data={fields}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Separator type="horizontal" />}
    />
  );
};
