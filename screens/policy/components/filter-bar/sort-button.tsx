import { Block, BottomSheet, Button, RowOfForm, Separator } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { FilterForm, OrderName } from '@vna-base/screens/policy/type';
import { I18nKeys } from '@translations/locales';
import React, { memo, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { SortItem } from './sort-item';

export const SortButton = memo(
  () => {
    const ref = useRef<NormalRef>(null);
    const { setValue, control } = useFormContext<FilterForm>();

    const showSortBottomSheet = () => {
      ref.current?.present();
    };

    const hideSortBottomSheet = () => {
      ref.current?.dismiss();
    };

    const renderItem = useCallback<
      ListRenderItem<{
        fieldName: OrderName;
        t18n: I18nKeys;
      }>
    >(
      ({ item }) => (
        <SortItem
          {...item}
          control={control}
          setValue={setValue}
          hideFilterBottomSheet={hideSortBottomSheet}
        />
      ),
      [control, setValue],
    );

    return (
      <>
        <Button
          leftIcon="height_fill"
          leftIconSize={24}
          textColorTheme="neutral800"
          onPress={showSortBottomSheet}
          padding={12}
        />
        <BottomSheet
          paddingBottom={true}
          ref={ref}
          enablePanDownToClose={false}
          typeBackDrop="gray"
          type="normal"
          t18nTitle="common:_sort"
          showIndicator={false}>
          <Block flex={1} paddingHorizontal={16}>
            <RowOfForm<FilterForm>
              type="switch"
              t18n="order:show_deleted"
              name="GetAll"
              hideBottomSheet={hideSortBottomSheet}
              control={control}
              paddingHorizontal={0}
            />
            <Separator type="horizontal" size={3} />
            <FlatList
              scrollEnabled={false}
              data={
                [
                  { fieldName: 'AgentGroup', t18n: 'policy:agent_group' },
                  { fieldName: 'System', t18n: 'policy:system' },
                  { fieldName: 'AirGroup', t18n: 'policy:air_group' },
                ] as Array<{
                  fieldName: OrderName;
                  t18n: I18nKeys;
                }>
              }
              keyExtractor={it => it.fieldName}
              renderItem={renderItem}
            />
          </Block>
        </BottomSheet>
      </>
    );
  },
  () => true,
);
