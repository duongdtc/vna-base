import { SectionContainer } from '@screens/flight/results/components/filter/section-container';
import { bs } from '@theme';
import { ArgsChangeRange, FilterForm } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import { useController } from 'react-hook-form';
import { View } from 'react-native';
import { RangeSelectorDuration } from './range-selector-duration';

export const Duration = memo(
  () => {
    const {
      field: { value, onChange },
    } = useController<FilterForm, 'Duration'>({
      name: 'Duration',
    });

    const change = (val: ArgsChangeRange) => {
      onChange({
        ...value,
        range: [val.lower, val.upper],
      });
    };

    return (
      <SectionContainer t18n="flight:flight_duration">
        <View style={bs.paddingHorizontal_16}>
          <RangeSelectorDuration
            initialRange={value.range}
            onChangeRange={val => {
              change(val);
            }}
            duration={value.duration}
          />
        </View>
      </SectionContainer>
    );
  },
  () => true,
);
