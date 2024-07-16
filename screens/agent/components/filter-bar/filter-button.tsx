import { Block, Button } from '@vna-base/components';
import {
  FilterAndOrder,
  FilterAndOrderName,
  FilterForm,
  FilterFormInBottomSheet,
} from '@vna-base/screens/agent/type';
import React, { memo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { DotStarFilter } from './dot-star-filter';
import { FilterBottomSheet } from './filter-bottom-sheet';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            Value: data.Filter[k as FilterAndOrderName],
            Contain: false,
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
