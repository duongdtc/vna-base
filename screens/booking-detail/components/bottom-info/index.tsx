import { Block, Button, Icon, Separator, Text } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import { selectViewingBookingId } from '@redux-selector';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
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
          <Block flexDirection="row" alignItems="center">
            <Block flex={1} flexDirection="row" justifyContent="space-between">
              <Text
                t18n="booking:net_price"
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Text
                text={(bookingDetail?.NetPrice ?? 0).currencyFormat()}
                fontStyle="Body14Semi"
                colorTheme="price"
              />
            </Block>
            <Separator
              type="vertical"
              height={16}
              marginHorizontal={8}
              colorTheme="neutral200"
            />
            <Block flex={1} flexDirection="row" justifyContent="space-between">
              <Text
                t18n="order:profit"
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Text
                text={(bookingDetail?.Profit ?? 0).currencyFormat()}
                fontStyle="Body14Semi"
                colorTheme="success500"
              />
            </Block>
          </Block>
          <Block
            height={1}
            marginTop={8}
            marginBottom={12}
            colorTheme="neutral200"
          />
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
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Button
                t18n="booking:operation"
                textColorTheme="classicWhite"
                size="large"
                buttonColorTheme="primary500"
                onPress={showFlightAction}
              />
            </Block>
          </Block>
        </Block>
      </Pressable>
    );
  },
  isEqual,
);
