/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { AddAncillaryForm } from '../type';

export const TotalPrice = memo(() => {
  const { control } = useFormContext<AddAncillaryForm>();

  const passengers = useWatch({ control, name: 'passengers' });

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
      {price.currencyFormat()}{' '}
      <Text
        text={DEFAULT_CURRENCY}
        colorTheme="neutral900"
        fontStyle="Title20Semi"
      />
    </Text>
  );
}, isEqual);
