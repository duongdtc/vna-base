import { Icon, Text } from '@vna-base/components';
import { FilterForm, OrderName } from '@vna-base/screens/order/type';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, scale } from '@vna-base/utils';
import React from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useStyles } from './styles';
import { SortType } from '@services/axios';

export const SortItem = ({
  fieldName,
  t18n,
  control,
  setValue,
  hideFilterBottomSheet,
}: {
  fieldName: OrderName;
  t18n: I18nKeys;
  control: Control<FilterForm, any>;
  setValue: UseFormSetValue<FilterForm>;
  hideFilterBottomSheet: () => void;
}) => {
  const styles = useStyles();

  const val = useWatch({ control, name: ['OrderBy', 'SortType'] });

  const selected = val[0] === fieldName;

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={() => {
        if (selected) {
          setValue(
            'SortType',
            val[1] === SortType.Asc ? SortType.Desc : SortType.Asc,
          );
        } else {
          setValue('OrderBy', fieldName);
        }

        hideFilterBottomSheet();
      }}
      style={[
        styles.optionFilterMenuContainer,
        selected && { paddingVertical: scale(12) },
      ]}>
      <Text
        t18n={t18n}
        colorTheme={selected ? 'neutral900' : 'neutral600'}
        fontStyle="Body16Reg"
      />
      {selected && (
        <Icon
          icon={val[1] === 'Asc' ? 'sort_up_fill' : 'sort_down_fill'}
          colorTheme="primary500"
          size={28}
        />
      )}
    </TouchableOpacity>
  );
};
