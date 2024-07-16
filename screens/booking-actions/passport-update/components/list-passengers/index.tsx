import { Block } from '@vna-base/components';
import React, { memo, useCallback } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemPassenger } from './item-passenger';
import { PassportUpdateForm } from '../../type';
import isEqual from 'react-fast-compare';

export const ListPassengers = memo(({ bookingId }: { bookingId: string }) => {
  const { control } = useFormContext<PassportUpdateForm>();
  const { fields } = useFieldArray({ control, name: 'ListPassenger' });

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<PassportUpdateForm, 'ListPassenger', 'id'>>
  >(({ item, index }) => {
    return <ItemPassenger item={item} index={index} bookingId={bookingId} />;
  }, []);

  return (
    <Block flex={1}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fields}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Block height={12} />}
      />
    </Block>
  );
}, isEqual);
