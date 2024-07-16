import { Text } from '@vna-base/components';
import { ArgsChangeRange, FilterForm } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import { useController } from 'react-hook-form';
import { RangeSelectorDuration } from './range-selector-duration';
import { View } from 'react-native';
import { bs, createStyleSheet, useStyles } from '@theme';

export const Duration = memo(
  () => {
    const { styles } = useStyles(styleSheet);

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
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            t18n="flight:flight_duration"
            fontStyle="Body16Semi"
            colorTheme="neutral90"
          />
        </View>
        <View style={bs.paddingHorizontal_16}>
          <RangeSelectorDuration
            initialRange={value.range}
            onChangeRange={val => {
              change(val);
            }}
            duration={value.duration}
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
