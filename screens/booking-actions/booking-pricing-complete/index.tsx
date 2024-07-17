/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import {
  Block,
  Button,
  DescriptionsBooking,
  Image,
  NormalHeaderGradient,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectBookingPricingCompleted } from '@vna-base/redux/selector';
import { bookingActions, chargeActions } from '@vna-base/redux/action-slice';
import { FarePax } from '@services/axios/axios-ibe';
import { translate } from '@vna-base/translations/translate';
import { Currency, dispatch } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemFareInfo } from './item-fare';
import { useStyles } from './styles';

export const BookingPricingCompleted = () => {
  const styles = useStyles();

  const booking = useSelector(selectBookingPricingCompleted);

  const renderPassengers = useCallback<ListRenderItem<FarePax>>(({ item }) => {
    return <ItemFareInfo infoPax={item} />;
  }, []);

  const goBackHome = () => {
    dispatch(
      bookingActions.getBookingByIdOrBookingCode(
        {
          id: booking.BookingId!,
          bookingCode: booking!.BookingCode!,
          system: booking!.System!,
        },
        {
          force: true,
        },
      ),
    );

    dispatch(chargeActions.getChargesByOrderId(booking.OrderId as string));

    goBack();
  };

  return (
    <Screen
      unsafe
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <NormalHeaderGradient
        leftContent={<Block height={32} width={32} />}
        centerContent={
          <Text
            t18n="issue_ticket:completed"
            fontStyle="Title20Semi"
            colorTheme="neutral100"
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Block width={358} height={80} alignItems="center">
          <Image
            source={images.airplane}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="center"
          />
        </Block>
        <Text
          fontStyle="Title20Semi"
          colorTheme="primary900"
          textAlign="center">
          {`${translate('booking_pricing:pricing')}`}{' '}
          <Text
            fontStyle="Title20Semi"
            colorTheme="success500"
            t18n="issue_ticket:success"
          />
        </Text>
        <DescriptionsBooking
          t18n="booking_pricing:description"
          colorTheme="neutral50"
        />
        <FlatList
          data={booking.ListFlightFare?.[0].FareInfo?.ListFarePax}
          scrollEnabled={false}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <Block height={12} colorTheme="neutral100" />
          )}
          renderItem={renderPassengers}
        />
      </ScrollView>
      <Block style={styles.containerBottom}>
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="order:total_payment"
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
          <Text fontStyle="Title20Semi" colorTheme="price">
            {`${booking.TotalPrice?.currencyFormat()}`}{' '}
            <Text
              text={Currency.VND}
              fontStyle="Title20Semi"
              colorTheme="neutral800"
            />
          </Text>
        </Block>
        <Button
          fullWidth
          t18n="issue_ticket:closed"
          type="classic"
          textColorTheme="neutral900"
          onPress={goBackHome}
        />
      </Block>
    </Screen>
  );
};
