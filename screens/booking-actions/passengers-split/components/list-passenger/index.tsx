/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, CheckBox, LinearGradient, Separator, Text } from '@vna-base/components';
import {
  ActiveOpacity,
  getFullNameOfPassenger,
  PassengerType,
  PassengerTypeDetails,
} from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useStyles } from '../../style';
import { SplitPassengersForm } from '../../type';
import isEmpty from 'lodash.isempty';

export const ListPassenger = memo(() => {
  const styles = useStyles();
  const { control } = useFormContext<SplitPassengersForm>();

  const { fields } = useFieldArray({
    control,
    name: 'passengers',
    rules: {
      validate: passengers => {
        let count = 0;
        passengers.forEach(psg => {
          if (!psg.isSelected) {
            count++;
          }
        });

        return count !== passengers.length;
      },
    },
  });

  const allPsg = useWatch({
    control,
    name: 'passengers',
  });

  const renderPassengers = useCallback<
    ListRenderItem<FieldArrayWithId<SplitPassengersForm, 'passengers', 'id'>>
  >(
    ({ item, index }) => {
      return (
        <Controller
          control={control}
          name={`passengers.${index}.isSelected`}
          render={({ field: { onChange, value } }) => {
            const disabled =
              !value &&
              allPsg?.reduce(
                (count, curr) => count + (!curr.isSelected ? 1 : 0),
                0,
              ) === 1;

            return (
              <Pressable
                disabled={disabled}
                style={[disabled && styles.disabledItem]}
                onPress={() => {
                  onChange(!value);
                }}>
                <Block>
                  <Block
                    padding={12}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Block rowGap={4}>
                      <Text
                        text={getFullNameOfPassenger(item)}
                        fontStyle="Title16Bold"
                        colorTheme="primary900"
                      />
                      <Block
                        flexDirection="row"
                        alignItems="center"
                        columnGap={4}>
                        <Text
                          t18n={
                            PassengerTypeDetails[item.PaxType as PassengerType]
                              .t18n
                          }
                          fontStyle="Body12Med"
                          colorTheme="neutral900"
                        />
                        <Block
                          width={1}
                          height={'100%'}
                          colorTheme="neutral200"
                        />
                        <Text
                          t18n={
                            item.Gender === 0
                              ? 'input_info_passenger:female'
                              : 'input_info_passenger:male'
                          }
                          fontStyle="Body12Reg"
                          colorTheme="neutral900"
                        />
                      </Block>
                    </Block>
                    <TouchableOpacity
                      activeOpacity={ActiveOpacity}
                      disabled={disabled}
                      onPress={() => {
                        onChange(!value);
                      }}>
                      <CheckBox disable value={value} />
                    </TouchableOpacity>
                  </Block>

                  {
                    //@ts-ignore
                    !isEmpty(item.Childrens) && (
                      <LinearGradient type="005" style={styles.linearContainer}>
                        <Text
                          //@ts-ignore
                          text={getFullNameOfPassenger(item.Childrens[0])}
                          fontStyle="Title16Bold"
                          colorTheme="primary900"
                        />
                        <Block
                          flexDirection="row"
                          alignItems="center"
                          columnGap={4}>
                          <Text
                            t18n={
                              PassengerTypeDetails[
                                //@ts-ignore
                                item.Childrens[0].PaxType as PassengerType
                              ].t18n
                            }
                            fontStyle="Body12Med"
                            colorTheme="neutral900"
                          />
                          <Block
                            width={1}
                            height={15}
                            colorTheme="neutral200"
                          />
                          <Text
                            t18n={
                              //@ts-ignore
                              item.Childrens[0].Gender === 0
                                ? 'input_info_passenger:female'
                                : 'input_info_passenger:male'
                            }
                            fontStyle="Body12Reg"
                            colorTheme="neutral900"
                          />
                        </Block>
                      </LinearGradient>
                    )
                  }
                </Block>
              </Pressable>
            );
          }}
        />
      );
    },
    [allPsg, control, styles.disabledItem],
  );

  return (
    <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
      <FlatList
        renderItem={renderPassengers}
        scrollEnabled={false}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
        data={fields}
        ItemSeparatorComponent={() => <Separator size={3} type="horizontal" />}
      />
    </Block>
  );
}, isEqual);
