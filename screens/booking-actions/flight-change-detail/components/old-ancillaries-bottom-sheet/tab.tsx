import { EmptyList, Separator } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ancillary } from '@services/axios/axios-data';
import React, { useCallback } from 'react';
import { ListRenderItem } from 'react-native';
import { AncillaryItem } from './ancillary-item';
import { scale } from '@vna-base/utils';

export const Tab = ({ ancillaries }: { ancillaries: Array<Ancillary> }) => {
  const renderFlight = useCallback<ListRenderItem<Ancillary>>(
    ({ item }) => <AncillaryItem {...item} />,
    [],
  );

  return (
    <BottomSheetFlatList
      data={ancillaries}
      renderItem={renderFlight}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={() => (
        <Separator type="horizontal" paddingHorizontal={16} />
      )}
      ListEmptyComponent={
        <EmptyList
          imageStyle={{ width: scale(80), height: scale(80) }}
          image="img_other_service"
          t18nTitle="flight_change_detail:have_no_ancillaries"
        />
      }
      contentContainerStyle={{ padding: 12 }}
    />
  );
};
