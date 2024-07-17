/* eslint-disable react/no-unstable-nested-components */
import { Block } from '@vna-base/components';

import { chargeActions, paymentActions } from '@vna-base/redux/action-slice';
import { FlightActionBottomSheet } from '@vna-base/screens/booking-detail/components';
import {
  FlightActionBottomSheetRef,
  FlightActionExpandParams,
} from '@vna-base/screens/booking-detail/type';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject } from '@services/realm/provider';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, ListRenderItem, ScrollView } from 'react-native';
import { ItemBooking } from './item-booking';
import { PriceBookingInfo } from './price-booking-info';
import { useStyles } from './style';
import { PaymentExpense } from './payment-expense';
import { PaymentReceive } from './payment-receive';

export const TabBooking = ({ id }: { id: string }) => {
  const styles = useStyles();
  const flightActionRef = useRef<FlightActionBottomSheetRef>(null);

  const order = useObject<OrderRealm>(OrderRealm.schema.name, id);

  useEffect(() => {
    dispatch(chargeActions.getChargesByOrderId(id));
    dispatch(paymentActions.getListPaymentExpense(id));
    dispatch(paymentActions.getListPaymentReceive(id));
  }, [id]);

  const showFlightActionOfBooking = useCallback(
    ({ bookingId }: Omit<FlightActionExpandParams, 'closeBottomSheet'>) => {
      flightActionRef.current?.present({
        bookingId,
      });
    },
    [],
  );

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item }) => {
      return (
        <ItemBooking
          id={item}
          showFlightActionOfBooking={showFlightActionOfBooking}
        />
      );
    },
    [showFlightActionOfBooking],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <FlatList
        scrollEnabled={false}
        data={order?.Bookings ?? []}
        keyExtractor={(item, index) => `${item}.${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Block height={12} />}
      />
      <PriceBookingInfo />
      <PaymentExpense />
      <PaymentReceive />
      <FlightActionBottomSheet ref={flightActionRef} />
    </ScrollView>
  );
};
