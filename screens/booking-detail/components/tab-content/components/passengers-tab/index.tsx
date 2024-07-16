/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { FormBookingDetail } from '@vna-base/screens/booking-detail/type';
import React, { useCallback } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemPassenger } from './item-passenger';
import { useStyles } from './style';

export const PassengersTab = () => {
  const styles = useStyles();
  const { control } = useFormContext<FormBookingDetail>();
  const { fields } = useFieldArray({ control, name: 'Passengers' });

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<FormBookingDetail, 'Passengers', 'id'>>
  >(({ item, index }) => {
    return <ItemPassenger item={item} index={index} />;
  }, []);

  return (
    <Block flex={1}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fields.sort(function (a, b) {
          if (a.PaxType! < b.PaxType!) {
            return -1;
          }

          if (a.PaxType! > b.PaxType!) {
            return 1;
          }

          return 0;
        })}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <Block height={12} />}
      />
    </Block>
  );
};
