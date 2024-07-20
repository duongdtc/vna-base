import { DEFAULT_CURRENCY } from '@env';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { Block, Button, Icon, Text } from '@vna-base/components';
import { selectViewingBookingId } from '@vna-base/redux/selector';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export const BottomInfoFlightBookingOrder = memo(
  ({
    expand,
    showFlightAction,
  }: {
    expand: () => void;
    showFlightAction: () => void;
  }) => {
    const styles = useStyles();

    const bookingId = useSelector(selectViewingBookingId);

    const bookingDetail = useObject<BookingRealm>(
      BookingRealm.schema.name,
      bookingId ?? '',
    );

    // render
    return (
      <Pressable onPress={expand}>
        <Block style={styles.containerBottom}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block rowGap={6}>
              <Block flexDirection="row" alignItems="center" columnGap={2}>
                <Text
                  t18n="booking:total_price"
                  fontStyle="Body14Semi"
                  colorTheme="neutral800"
                />
                <Icon icon="info_outline" size={16} colorTheme="primary500" />
              </Block>
              <Text fontStyle="Title20Semi" colorTheme="price">
                {`${(bookingDetail?.TotalPrice ?? 0).currencyFormat()}`}{' '}
                <Text text={DEFAULT_CURRENCY} colorTheme="neutral800" />
              </Text>
            </Block>
            <Button
              t18n="booking:operation"
              textColorTheme="white"
              size="medium"
              buttonColorTheme="001"
              paddingHorizontal={40}
              onPress={showFlightAction}
            />
          </Block>
        </Block>
      </Pressable>
    );
  },
  isEqual,
);
