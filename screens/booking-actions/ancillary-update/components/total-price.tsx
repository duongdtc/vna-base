import { Text } from '@vna-base/components';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { DEFAULT_CURRENCY } from '@env';
import { AncillaryUpdateForm } from '../type';
import { useObject } from '@services/realm/provider';
import { BookingRealm } from '@services/realm/models/booking';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { useSelector } from 'react-redux';
import { ANCILLARY_TYPE } from '@vna-base/utils';

export const TotalPrice = memo(() => {
  const { control } = useFormContext<AncillaryUpdateForm>();
  const { bookingId } = useSelector(selectCurrentFeature);
  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId);

  const passengers = useWatch({ control, name: 'passengers' });

  const totalOldAncillaries = useMemo(
    () =>
      bookingDetail?.Ancillaries?.reduce(
        (total, currAnc) =>
          total +
          (currAnc?.Type !== ANCILLARY_TYPE.PRESEAT ? currAnc?.Price ?? 0 : 0),
        0,
      ) ?? 0,
    [bookingDetail],
  );

  const price = passengers.reduce(
    (total, currPassenger) =>
      total +
      currPassenger.Baggages.reduce(
        (flTotal, currBg) => flTotal + (currBg?.Price ?? 0),
        0,
      ) +
      currPassenger.Services.reduce(
        (flTotal, currFl) =>
          flTotal +
          currFl.reduce(
            (smTotal, currSm) =>
              smTotal +
              currSm.reduce(
                (svTotal, currSv) => svTotal + (currSv?.Price ?? 0),
                0,
              ),
            0,
          ),
        0,
      ),
    0,
  );

  return (
    <Text colorTheme="price" fontStyle="Title20Semi">
      {(price - totalOldAncillaries).currencyFormat()}{' '}
      <Text
        text={bookingDetail?.Currency ?? DEFAULT_CURRENCY}
        colorTheme="neutral900"
        fontStyle="Title20Semi"
      />
    </Text>
  );
}, isEqual);
