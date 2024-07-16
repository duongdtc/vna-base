import { RadioButton, Separator, Text } from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, ListFareFilter } from '@vna-base/utils';
import React, { memo } from 'react';
import { useController } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from '@theme';

export const Fare = memo(
  () => {
    const { styles } = useStyles(styleSheet);

    const {
      field: { value, onChange },
    } = useController<FilterForm, 'Fare'>({
      name: 'Fare',
    });
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text
            t18n="flight:fare"
            fontStyle="Body16Semi"
            colorTheme="neutral90"
          />
        </View>
        {ListFareFilter.map(({ key, t18n }, i) => {
          const selected = value === key;
          const choose = () => {
            onChange(key);
          };

          return (
            <View key={key}>
              {i !== 0 && <Separator type="horizontal" />}
              <TouchableOpacity
                disabled={selected}
                activeOpacity={ActiveOpacity}
                style={styles.itemContainer}
                onPress={choose}>
                <Text
                  t18n={t18n}
                  fontStyle="Body16Reg"
                  colorTheme={selected ? 'primaryColor' : 'neutral90'}
                />
                <RadioButton
                  sizeDot={14}
                  value={selected}
                  disable
                  opacity={1}
                />
              </TouchableOpacity>
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
  itemContainer: {
    paddingVertical: spacings[20],
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacings[16],
  },
}));
