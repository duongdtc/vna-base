import { Icon, Separator, Switch, Text } from '@vna-base/components';
import { selectCustomFeeTotal } from '@vna-base/redux/selector';
import { FilterForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, HitSlop } from '@vna-base/utils';
import React, { memo } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { bs, createStyleSheet, useStyles } from '@theme';

export const TypeTicket = memo(
  () => {
    const { styles } = useStyles(styleSheet);
    const [t] = useTranslation();
    const customFeeTotal = useSelector(selectCustomFeeTotal);
    const { control, getValues, setValue } = useFormContext<FilterForm>();

    const { fields } = useFieldArray({
      control,
      name: 'SeatClass',
    });

    const fareType = useWatch({
      control,
      name: 'Fare',
    });

    const selectAll = () => {
      getValues().SeatClass.forEach((sc, i) => {
        if (!sc.selected) {
          setValue(`SeatClass.${i}`, { ...sc, selected: true });
        }
      });
    };

    const selectOnlyThis = (selectedIdx: number) => {
      getValues().SeatClass.forEach((al, i) => {
        if (i !== selectedIdx) {
          setValue(`SeatClass.${i}`, { ...al, selected: false });
        } else {
          setValue(`SeatClass.${i}`, { ...al, selected: true });
        }
      });
    };

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            t18n="flight:type_ticket"
            fontStyle="Body16Semi"
            colorTheme="neutral90"
          />
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={selectAll}
            hitSlop={HitSlop.Large}>
            <Text
              t18n="common:select_all"
              fontStyle="Body14Reg"
              colorTheme="primaryColor"
            />
          </TouchableOpacity>
        </View>
        {fields.map(({ key }, i) => (
          <View key={key} style={bs.paddingHorizontal_12}>
            {i !== 0 && <Separator type="horizontal" />}
            <Controller
              control={control}
              name={`SeatClass.${i}`}
              render={({ field: { value, onChange } }) => (
                <View style={styles.alContainer}>
                  <Pressable
                    style={styles.nameContainer}
                    onPress={() => {
                      selectOnlyThis(i);
                    }}>
                    <View style={bs.rowGap_2}>
                      <Text
                        text={value.key}
                        fontStyle="Body16Semi"
                        colorTheme="neutral90"
                      />
                      <Text fontStyle="Body12Reg" colorTheme="neutral90">
                        {t('common:from')}{' '}
                        <Text colorTheme="successColor">
                          {(
                            value.minFare[fareType] + customFeeTotal[fareType]
                          ).currencyFormat()}
                        </Text>{' '}
                        đ
                      </Text>
                      <View style={[bs.flexDirectionRow, bs.alignCenter]}>
                        <Text
                          t18n="flight:only_this_fare_family"
                          fontStyle="Body12Reg"
                          colorTheme="primaryColor"
                        />
                        <Icon
                          icon="arrow_right_fill"
                          colorTheme="primaryColor"
                          size={12}
                        />
                      </View>
                    </View>
                  </Pressable>
                  <Pressable
                    style={styles.switchContainer}
                    onPress={() => {
                      onChange({ ...value, selected: !value.selected });
                    }}>
                    <Switch value={value.selected} disable opacity={1} />
                  </Pressable>
                </View>
              )}
            />
          </View>
        ))}
      </View>
    );
  },
  () => true,
);

const styleSheet = createStyleSheet(({ colors, spacings, shadows }) => ({
  container: {
    backgroundColor: colors.neutral10,
    marginTop: spacings[12],
  },
  titleContainer: {
    paddingHorizontal: spacings[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacings[12],
    backgroundColor: colors.neutral10,
    ...shadows['.3'],
  },
  alContainer: {
    paddingHorizontal: spacings[8],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    columnGap: spacings[8],
    paddingVertical: spacings[12],
    alignItems: 'center',
  },
  switchContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: spacings[24],
  },
}));
