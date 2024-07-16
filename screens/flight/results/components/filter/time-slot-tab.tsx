import { FilterForm } from '@vna-base/screens/flight/type';
import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TimeSlot } from './time-slot';
import { View } from 'react-native';
import { bs } from '@theme';

export const TimeSlotTab = () => {
  const { control } = useFormContext<FilterForm>();

  return (
    <View style={bs.paddingHorizontal_12}>
      <Controller
        control={control}
        name={'DepartTimeSlot'}
        render={({ field: { value, onChange } }) => (
          <TimeSlot
            key={value.Leg}
            {...value}
            onChangeRange={i => {
              const newSlots = cloneDeep(value.slots);
              newSlots[i] = !newSlots[i];
              onChange({
                ...value,
                slots: newSlots,
              });
            }}
          />
        )}
      />
    </View>
  );
};
