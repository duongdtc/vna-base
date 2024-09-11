import { DEFAULT_CURRENCY } from '@env';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, LinearGradient, Text } from '@vna-base/components';
import { selectViewingBookingId } from '@vna-base/redux/selector';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';

export const BottomInfoFlightBookingOrder = memo(
  ({
    expand,
    showFlightAction,
  }: {
    expand: () => void;
    showFlightAction: () => void;
  }) => {
    const { styles } = useStyles(styleSheet);

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
            <Pressable onPress={showFlightAction}>
              <LinearGradient type="gra1" style={styles.btn}>
                <Text
                  textAlign="center"
                  t18n="booking:operation"
                  fontStyle="Title16Bold"
                  colorTheme="white"
                />
              </LinearGradient>
            </Pressable>
          </Block>
        </Block>
      </Pressable>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, shadows, radius }) => ({
  containerBottom: {
    backgroundColor: colors.neutral10,
    paddingTop: scale(8),
    paddingHorizontal: scale(12),
    paddingBottom: UnistylesRuntime.insets.bottom + scale(8),
    ...shadows.main,
  },
  btn: {
    paddingHorizontal: scale(40),
    paddingVertical: scale(12),
    borderRadius: radius[8],
  },
}));
