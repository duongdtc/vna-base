import { Block, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  FilterForm,
  FilterFormInBottomSheet,
  FilterName,
  Filter,
} from '@vna-base/screens/flight-ticket/type';
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
      data: Omit<FilterFormInBottomSheet, 'OrderStatus'>,
    ) => {
      const d: Array<Filter> = [];
      Object.keys(data.Filter).forEach(k => {
        if (
          data.Filter[k as FilterName] &&
          data.Filter[k as FilterName] !== ''
        ) {
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
    };

    const closeBottomSheet = () => {
      ref.current?.close();
    };

    return (
      <Block>
        <DotStarFilter />
        <Button
          disabled
          buttonStyle={{ opacity: 1 }}
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
