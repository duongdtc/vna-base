import { RadioButton, Separator, Text } from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, ListFareFilter } from '@vna-base/utils';
import React, { memo } from 'react';
import { useController } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from '@theme';
import { SectionContainer } from '@screens/flight/results/components/filter/section-container';

export const Fare = memo(
  () => {
    const { styles } = useStyles(styleSheet);

    const {
      field: { value, onChange },
    } = useController<FilterForm, 'Fare'>({
      name: 'Fare',
    });
    return (
      <SectionContainer t18n="flight:fare">
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
      </SectionContainer>
    );
  },
  () => true,
);

const styleSheet = createStyleSheet(({ spacings }) => ({
  itemContainer: {
    paddingVertical: spacings[20],
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacings[16],
  },
}));
