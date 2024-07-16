import { BottomSheetContentFlightRef } from '@vna-base/screens/flight/type';
import { scale } from '@vna-base/utils';
import React from 'react';
import { ScrollView } from 'react-native';
import { InfoPassengers } from './info-passengers';
import { ListFlight } from './list-flight';

export const InfoPassengerTab = ({
  contentFlightBottomSheetRef: bottomSheetRef,
}: {
  contentFlightBottomSheetRef: React.RefObject<BottomSheetContentFlightRef>;
}) => {
  return (
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      contentInsetAdjustmentBehavior="always"
      contentContainerStyle={{
        paddingTop: scale(12),
        paddingHorizontal: scale(12),
      }}>
      <ListFlight bottomSheetRef={bottomSheetRef} />
      <InfoPassengers />
    </ScrollView>
  );
};
