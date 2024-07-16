import { Block, Separator, Text } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import { selectCurrentFeature } from '@redux-selector';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import React from 'react';
import { useSelector } from 'react-redux';
import { AncillaryUpdateForm } from '../type';

export const PriceInModal = ({
  passengers,
}: Pick<AncillaryUpdateForm, 'passengers'>) => {
  const { bookingId } = useSelector(selectCurrentFeature);

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId);

  const addPrice = passengers.reduce(
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
    <Block padding={12} colorTheme="neutral50" borderRadius={8}>
      <Block
        flexDirection="row"
        paddingBottom={12}
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="ancillary_update:booking_price"
          colorTheme="neutral900"
          fontStyle="Body14Reg"
        />
        <Text
          text={(bookingDetail?.TotalPrice ?? 0).currencyFormat()}
          colorTheme="price"
          fontStyle="Body14Semi"
        />
      </Block>
      <Separator type="horizontal" colorTheme="neutral200" />
      <Block
        flexDirection="row"
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="ancillary_update:additional_service"
          colorTheme="neutral900"
          fontStyle="Body14Reg"
        />
        <Text
          text={addPrice.currencyFormat()}
          colorTheme="price"
          fontStyle="Body14Semi"
        />
      </Block>
      <Separator type="horizontal" colorTheme="neutral200" />
      <Block
        flexDirection="row"
        paddingTop={12}
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="ancillary_update:total_payment"
          colorTheme="neutral900"
          fontStyle="Body14Bold"
        />
        <Text colorTheme="price" fontStyle="Title16Bold">
          {((bookingDetail?.TotalPrice ?? 0) + addPrice).currencyFormat()}{' '}
          <Text
            text={bookingDetail?.Currency ?? DEFAULT_CURRENCY}
            colorTheme="neutral900"
            fontStyle="Title16Bold"
          />
        </Text>
      </Block>
    </Block>
  );
};
