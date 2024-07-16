import { Button, LinearGradient, Text } from '@vna-base/components';
import { Form } from '@vna-base/screens/flight/components';
import { FlightInput, SearchForm } from '@vna-base/screens/flight/type';
import { HitSlop, MaxStageSearch, scale } from '@vna-base/utils';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { LayoutAnimation, StyleSheet, View, ViewProps } from 'react-native';
import { bs, createStyleSheet, useStyles } from '@theme';

export const MultiStage = (
  props: Pick<ViewProps, 'onLayout'> & { changeTab?: (i: number) => void },
) => {
  const { changeTab, ...subProps } = props;

  const { styles } = useStyles(styleSheet);

  const { control, getValues } = useFormContext<SearchForm>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'Flights',
  });

  const _addStage = () => {
    const flights = getValues().Flights;
    const preFlight = flights[flights.length - 1];
    append({
      airport: {
        takeOff: preFlight.airport?.landing,
      },
      date: {
        departureDay: preFlight.date?.departureDay,
      },
    } as FlightInput);

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 80,
    });
  };

  const _removeStage = (index: number) => {
    remove(index);

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 80,
    });
  };

  return (
    <View {...subProps}>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.container}>
          <LinearGradient style={StyleSheet.absoluteFill} type="gra3" />
          <View style={styles.formContainer}>
            <View style={styles.indexContainer}>
              <Text
                fontStyle="Body12Bold"
                colorTheme="white"
                text={(index + 1).toString()}
              />
            </View>
            <Button
              hitSlop={HitSlop.Large}
              onPress={() => {
                if (fields.length === 2) {
                  changeTab?.(0);
                } else {
                  _removeStage(index);
                }
              }}
              disabled={fields.length === 1}
              leftIcon="close_outline"
              leftIconSize={24}
              padding={0}
              textColorTheme="neutral100"
            />
          </View>
          <Form style={{ marginTop: 8 }} index={index} />
        </View>
      ))}
      {fields.length < MaxStageSearch && (
        <View style={[bs.borderRadius_8, { overflow: 'hidden' }]}>
          <LinearGradient style={StyleSheet.absoluteFill} type="gra3" />
          <Button
            fullWidth
            onPress={_addStage}
            type="common"
            textColorTheme="primaryPressed"
            t18n="flight:add_stage"
            leftIcon="plus_fill"
            leftIconSize={24}
          />
        </View>
      )}
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    padding: scale(8),
    marginBottom: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indexContainer: {
    paddingHorizontal: scale(8),
    backgroundColor: colors.primaryPressed,
    paddingVertical: scale(2),
    justifyContent: 'center',
    borderRadius: scale(4),
  },
}));
