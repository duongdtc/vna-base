import { Block, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  Filter,
  FilterFormInBottomSheet,
  FilterName,
  PaymentHistoryFilterForm,
} from '@vna-base/screens/payment-history/type';
import { HitSlop } from '@vna-base/utils';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FilterBottomSheet } from './filter-bottom-sheet';

export const FilterButton = () => {
  const ref = useRef<NormalRef>(null);

  const { setValue } = useFormContext<PaymentHistoryFilterForm>();

  const showFilterBottomSheet = () => {
    ref.current?.present();
  };

  const submitFilterForm = (
    data: Omit<FilterFormInBottomSheet, 'OrderStatus'>,
  ) => {
    const d: Array<Filter> = [];
    Object.keys(data.Filter).forEach(k => {
      if (data.Filter[k as FilterName] && data.Filter[k as FilterName] !== '') {
        d.push({
          Name: k as FilterName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          Value: data.Filter[k as FilterName],
          Contain: true,
        });
      }
    });

    setValue('Filter', d, { shouldDirty: true });
    // setValue('GetAll', data.GetAll, { shouldDirty: true });
    // setValue('OrderBy', data.OrderBy, { shouldDirty: true });
    // setValue('SortType', data.SortType, { shouldDirty: true });
  };

  const closeBottomSheet = () => {
    ref.current?.close();
  };

  return (
    <Block>
      <Button
        hitSlop={HitSlop.Large}
        leftIcon="filter_fill"
        leftIconSize={24}
        textColorTheme="neutral900"
        padding={4}
        onPress={showFilterBottomSheet}
      />
      <FilterBottomSheet
        ref={ref}
        onDismiss={submitFilterForm}
        closeBottomSheet={closeBottomSheet}
      />
    </Block>
  );
};
