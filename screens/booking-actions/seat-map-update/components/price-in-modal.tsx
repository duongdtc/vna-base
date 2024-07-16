import { Block, Separator, Text } from '@vna-base/components';
import { selectCurrentFeature } from '@redux-selector';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import React from 'react';
import { useSelector } from 'react-redux';
import { SeatMapUpdateForm } from '../type';

export const PriceInModal = (formData: SeatMapUpdateForm) => {
  const { bookingId } = useSelector(selectCurrentFeature);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const TotalPrice = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  )!.TotalPrice;

  const detalSeatPrice = formData.passengers.reduce(
    (total, currPassenger) =>
      total +
      currPassenger.PreSeats.reduce(
        (flTotal, currFl) =>
          flTotal +
          currFl.reduce(
            (segmentTotal, currSeg) => segmentTotal + (currSeg?.Price ?? 0),
            0,
          ),
        0,
      ),
    0,
  );

  return (
    <Block paddingHorizontal={12} colorTheme="neutral50" borderRadius={8}>
      <Block
        flexDirection="row"
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="seat_map_update:booking_price"
          colorTheme="neutral900"
          fontStyle="Body14Reg"
        />
        <Text
          text={TotalPrice?.currencyFormat()}
          colorTheme="price"
          fontStyle="Body14Semi"
        />
      </Block>
      <Separator type="horizontal" />
      <Block
        flexDirection="row"
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="seat_map_update:additional_seats_are_available"
          colorTheme="neutral900"
          fontStyle="Body14Reg"
        />
        <Text
          text={detalSeatPrice.currencyFormat()}
          colorTheme="price"
          fontStyle="Body14Semi"
        />
      </Block>
      <Separator type="horizontal" />
      <Block
        flexDirection="row"
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="seat_map_update:total_payment"
          colorTheme="neutral900"
          fontStyle="Body14Semi"
        />
        <Text
          text={((TotalPrice ?? 0) + detalSeatPrice).currencyFormat()}
          colorTheme="price"
          fontStyle="Title16Bold"
        />
      </Block>
    </Block>
  );
};
