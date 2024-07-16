import { Block, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  FilterAndOrder,
  FilterForm,
  FilterAndOrderName,
  FilterFormInBottomSheet,
} from '@vna-base/screens/booking/type';
import React, { memo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FilterBottomSheet } from './filter-bottom-sheet';
import { DotStarFilter } from './dot-star-filter';

export const FilterButton = memo(
  () => {
    const ref = useRef<NormalRef>(null);
    const { setValue } = useFormContext<FilterForm>();

    const showFilterBottomSheet = () => {
      ref.current?.present();
    };

    const submitFilterForm = (data: FilterFormInBottomSheet) => {
      const d: Array<FilterAndOrder> = [];
      Object.keys(data.Filter).forEach(k => {
        if (
          data.Filter[k as FilterAndOrderName] &&
          data.Filter[k as FilterAndOrderName] !== ''
        ) {
          d.push({
            Name: k as FilterAndOrderName,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Value: data.Filter[k as FilterAndOrderName]!,
            Contain: true,
          });
        }
      });

      setValue('Filter', d, { shouldDirty: true });
      setValue('GetAll', data.GetAll, { shouldDirty: true });
      setValue('OrderBy', data.OrderBy, { shouldDirty: true });
      setValue('SortType', data.SortType, { shouldDirty: true });
    };

    const closeBottomSheet = () => {
      ref.current?.close();
    };

    return (
      <Block>
        <DotStarFilter />
        <Button
          leftIcon="filter_fill"
          leftIconSize={24}
          textColorTheme="neutral800"
          onPress={showFilterBottomSheet}
          padding={12}
        />
        <FilterBottomSheet
          ref={ref}
          onDismiss={submitFilterForm}
          closeBottomSheet={closeBottomSheet}
        />
      </Block>
    );
  },
  () => true,
);
