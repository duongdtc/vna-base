import { Text } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { SeatMapUpdateForm } from '../type';
import { useSelector } from 'react-redux';
import { DEFAULT_CURRENCY } from '@env';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { realmRef } from '@services/realm/provider';
import { BookingRealm } from '@services/realm/models/booking';

export const TotalPrice = memo(() => {
  const { control } = useFormContext<SeatMapUpdateForm>();

  const { bookingId } = useSelector(selectCurrentFeature);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const Currency = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  )!.Currency;

  const passengers = useWatch({ control, name: 'passengers' });

  const price = passengers.reduce(
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
    <Text colorTheme="price" fontStyle="Title20Semi">
      {price.currencyFormat()}{' '}
      <Text
        text={Currency ?? DEFAULT_CURRENCY}
        colorTheme="neutral900"
        fontStyle="Title20Semi"
      />
    </Text>
  );
}, isEqual);
