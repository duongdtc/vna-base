import { Block, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  FilterAndUserAccount,
  FilterAndUserAccountName,
  FilterForm,
  FilterFormInBottomSheet,
} from '@vna-base/screens/user-account/type';
import React, { memo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { DotStarFilter } from './dot-star-filter';
import { FilterBottomSheet } from './filter-bottom-sheet';

export const FilterButton = memo(
  () => {
    const ref = useRef<NormalRef>(null);
    const { setValue } = useFormContext<FilterForm>();

    const showFilterBottomSheet = () => {
      ref.current?.present();
    };

    const submitFilterForm = (
      data: Omit<FilterFormInBottomSheet, 'Status'>,
    ) => {
      const d: Array<FilterAndUserAccount> = [];

      Object.keys(data.Filter).forEach(k => {
        if (
          data.Filter[k as FilterAndUserAccountName] &&
          data.Filter[k as FilterAndUserAccountName] !== ''
        ) {
          d.push({
            Name: k as FilterAndUserAccountName,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            Value: data.Filter[k as FilterAndUserAccountName],
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
