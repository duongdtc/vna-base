import { Block } from '@vna-base/components';
import React, { useCallback } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemPassenger } from './item-passenger';
import { PassengerUpdateForm } from '../../type';

export const ListPassengers = ({ bookingId }: { bookingId: string }) => {
  const { control } = useFormContext<PassengerUpdateForm>();
  const { fields } = useFieldArray({ control, name: 'Passengers' });

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<PassengerUpdateForm, 'Passengers', 'id'>>
  >(({ item, index }) => {
    return <ItemPassenger item={item} index={index} bookingId={bookingId} />;
  }, []);

  return (
    <Block flex={1} paddingBottom={24}>
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
};
