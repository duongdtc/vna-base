import { Block } from '@vna-base/components';
import { OptionsForm } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BookingSystem } from '../booking-system';

export const BookingSystems = memo(() => {
  const { control } = useFormContext<OptionsForm>();

  const { fields } = useFieldArray({
    control,
    name: 'BookingSystems',
  });

  return (
    <Block rowGap={12}>
      {fields.map((field, index) => (
        <BookingSystem index={index} key={field.id} />
      ))}
    </Block>
  );
}, isEqual);
