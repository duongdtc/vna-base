import { Text } from '@vna-base/components';
import { ArgsChangeRange, FilterForm } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { RangeSelectorFare } from './range-selector-fare';
import { selectCustomFeeTotal } from '@redux-selector';
import { useSelector } from 'react-redux';
import { bs, createStyleSheet, useStyles } from '@theme';
import { View } from 'react-native';

export const FareRange = memo(
  () => {
    const { styles } = useStyles(styleSheet);
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
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            t18n="flight:fare_range"
            fontStyle="Body16Semi"
            colorTheme="neutral90"
          />
        </View>
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
}));
