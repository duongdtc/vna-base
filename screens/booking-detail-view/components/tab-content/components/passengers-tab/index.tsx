import { Block } from '@vna-base/components';
import { selectViewingBookingVersion } from '@redux-selector';
import { Passenger } from '@services/axios/axios-data';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemPassenger } from './item-passenger';
import { useStyles } from './style';

export const PassengersTab = () => {
  const styles = useStyles();

  const bookingDetail = useSelector(selectViewingBookingVersion);

  const renderItem = useCallback<ListRenderItem<Passenger>>(({ item }) => {
    return <ItemPassenger item={item} />;
  }, []);

  return (
    <Block flex={1}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={bookingDetail?.Passengers ?? []}
        keyExtractor={(item, index) => `${item.Id}${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <Block height={12} />}
      />
    </Block>
  );
};
