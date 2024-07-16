import { Block, EmptyList, Separator } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectCharges, selectViewingBookingId } from '@redux-selector';
import { chargeActions } from '@redux-slice';
import { Charge } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect } from 'react';
import { ListRenderItem, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { ChargeItem } from './charge-item';
import { useStyles } from './styles';
import { useObject } from '@services/realm/provider';

export const DetailTab = () =>
  //   {
  //   showFeeModal,
  // }: {
  //   showFeeModal: (flCharge?: Charge) => void;
  // }
  {
    const styles = useStyles();

    const bookingId = useSelector(selectViewingBookingId);
    const charges = useSelector(selectCharges);
    const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId!);

    useEffect(() => {
      if (bookingDetail?.OrderId) {
        dispatch(chargeActions.getChargesByOrderId(bookingDetail?.OrderId));
      }
    }, [bookingDetail?.OrderId]);

    const pullToRefresh = () => {
      if (bookingDetail?.OrderId) {
        dispatch(chargeActions.getChargesByOrderId(bookingDetail?.OrderId));
      }
    };

    const renderItem = useCallback<ListRenderItem<Charge>>(({ item }) => {
      return (
        <ChargeItem
          {...item}
          // showFeeModal={showFeeModal}
        />
      );
    }, []);

    return (
      <Block flex={1} colorTheme="neutral50">
        <BottomSheetFlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={pullToRefresh} />
          }
          data={charges}
          ListEmptyComponent={
            <EmptyList
              height={300}
              image="emptyListFlight"
              imageStyle={{ width: 192, height: 101 }}
            />
          }
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => (
            <Separator type="horizontal" size={3} />
          )}
          keyExtractor={(i, index) => `${i.Id}_${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </Block>
    );
  };
