import { Icon, Separator, Switch, Text } from '@vna-base/components';
import { LogoAirline } from '@vna-base/components/logo-airline';
import { selectCustomFeeTotal, selectLanguage } from '@redux-selector';
import { FilterForm } from '@vna-base/screens/flight/type';
import { AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
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

export const Airline = memo(
  () => {
    const { styles } = useStyles(styleSheet);
    const [t] = useTranslation();
    const realm = useRealm();
    const customFeeTotal = useSelector(selectCustomFeeTotal);
    const lng = useSelector(selectLanguage);
    const { control, setValue, getValues } = useFormContext<FilterForm>();

    const { fields } = useFieldArray({
      control,
      name: 'Airline',
    });

    const fareType = useWatch({
      control,
      name: 'Fare',
    });

    const selectAll = () => {
      getValues().Airline.forEach((al, i) => {
        if (!al.selected) {
          setValue(`Airline.${i}`, { ...al, selected: true });
        }
      });
    };

    const selectOnlyThis = (selectedIdx: number) => {
      getValues().Airline.forEach((al, i) => {
        if (i !== selectedIdx) {
          setValue(`Airline.${i}`, { ...al, selected: false });
        } else {
          setValue(`Airline.${i}`, { ...al, selected: true });
        }
      });
    };

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            t18n="flight:airline"
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
        {fields.map(({ key }, i) => {
          const airline = realm.objectForPrimaryKey<AirlineRealm>(
            AirlineRealm.schema.name,
            key,
          );

          return (
            <View key={key} style={bs.paddingHorizontal_12}>
              {i !== 0 && <Separator type="horizontal" />}
              <Controller
                control={control}
                name={`Airline.${i}`}
                render={({ field: { value, onChange } }) => (
                  <View style={styles.alContainer}>
                    <Pressable
                      style={styles.nameContainer}
                      onPress={() => {
                        selectOnlyThis(i);
                      }}>
                      <LogoAirline size={32} radius={8} airline={key} />
                      <View style={bs.rowGap_2}>
                        <Text
                          text={
                            lng === 'vi' ? airline?.NameVi : airline?.NameEn
                          }
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
                            t18n="flight:only_this_airline"
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
          );
        })}
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
