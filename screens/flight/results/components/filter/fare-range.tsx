import { SectionContainer } from '@screens/flight/results/components/filter/section-container';
import { bs } from '@theme';
import { selectCustomFeeTotal } from '@vna-base/redux/selector';
import { ArgsChangeRange, FilterForm } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { RangeSelectorFare } from './range-selector-fare';

export const FareRange = memo(
  () => {
    const { control } = useFormContext<FilterForm>();

    const customFeeTotal = useSelector(selectCustomFeeTotal);

    const {
      field: { value, onChange },
    } = useController<FilterForm, 'FareRange'>({
      name: 'FareRange',
    });

    const fareType = useWatch({
      control,
      name: 'Fare',
    });

    const change = (val: ArgsChangeRange) => {
      onChange({
        ...value,
        range: [val.lower, val.upper],
      });
    };

    return (
      <SectionContainer t18n="flight:fare_range">
        <View style={bs.paddingHorizontal_16}>
          <RangeSelectorFare
            initialRange={value.range}
            onChangeRange={val => {
              change(val);
            }}
            fare={value.fare[fareType]}
            customFee={customFeeTotal[fareType]}
          />
        </View>
      </SectionContainer>
    );
  },
  () => true,
);
