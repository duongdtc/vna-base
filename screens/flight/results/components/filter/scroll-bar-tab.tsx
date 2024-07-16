import { FilterForm } from '@vna-base/screens/flight/type';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RangeSelectorTime } from './range-selector-time';
import { View } from 'react-native';
import { bs } from '@theme';

export const ScrollBarTab = () => {
  const { control } = useFormContext<FilterForm>();

  return (
    <View style={bs.paddingHorizontal_12}>
      <Controller
        control={control}
        name={'DepartTimeRange'}
        render={({ field: { value, onChange } }) => (
          <RangeSelectorTime
            key={value.Leg}
            {...value}
            initialRange={value.range}
            onChangeRange={range => {
              onChange({
                ...value,
                range: [range.lower, range.upper],
              });
            }}
          />
        )}
      />
    </View>
  );
};
