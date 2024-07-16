import { Block, BottomSheet, Button, RowOfForm, Separator } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { FilterForm, OrderName } from '@vna-base/screens/agent/type';
import { I18nKeys } from '@translations/locales';
import { HitSlop } from '@vna-base/utils';
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
          hitSlop={HitSlop.Large}
          leftIcon="height_fill"
          leftIconSize={24}
          textColorTheme="neutral800"
          onPress={showSortBottomSheet}
          padding={0}
        />
        <BottomSheet
          paddingBottom={true}
          ref={ref}
          enablePanDownToClose={false}
          typeBackDrop="gray"
          type="normal"
          useDynamicSnapPoint={true}
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
                  { fieldName: 'CreatedDate', t18n: 'order:create_time' },
                  { fieldName: 'CustomerID', t18n: 'agent:customer_id' },
                  { fieldName: 'AgentCode', t18n: 'add_new_agent:agent_code' },
                  { fieldName: 'AgentName', t18n: 'add_new_agent:agent_name' },
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
