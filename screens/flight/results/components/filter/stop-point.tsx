import { Separator, Switch, Text } from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';
import React, { memo } from 'react';
import { useController } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { SectionContainer } from '@screens/flight/results/components/filter/section-container';

export const StopPoint = memo(
  () => {
    const { styles } = useStyles(styleSheet);

    const {
      field: { value, onChange },
    } = useController<FilterForm, 'StopNum'>({
      name: 'StopNum',
      rules: {
        required: true,
      },
    });

    const selectAll = () => {
      const stopNums = cloneDeep(value);
      stopNums.forEach(sn => {
        sn.selected = true;
      });
      onChange(stopNums);
    };

    return (
      <SectionContainer
        t18n="flight:stop_point"
        t18nRight="common:select_all"
        onPressRight={selectAll}>
        {value.map(({ selected, key, t18n }, i) => {
          const choose = () => {
            const temp = cloneDeep(value);
            temp[i].selected = !temp[i].selected;
            onChange(temp);
          };

          return (
            <View key={key} style={bs.paddingHorizontal_12}>
              {i !== 0 && <Separator type="horizontal" />}
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                style={styles.itemContainer}
                onPress={choose}>
                <Text
                  t18n={t18n}
                  fontStyle="Body16Reg"
                  colorTheme="neutral90"
                />
                <Switch value={selected} disable opacity={1} />
              </TouchableOpacity>
            </View>
          );
        })}
      </SectionContainer>
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
