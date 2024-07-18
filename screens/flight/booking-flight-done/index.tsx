/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import {
  Block,
  Button,
  Icon,
  Image,
  NormalHeaderGradient,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import { LOGO_URL } from '@env';
import { reset } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Data } from '@services/axios';
import { Booking, Order } from '@services/axios/axios-data';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { ColorLight } from '@theme/color';
import { translate } from '@vna-base/translations/translate';
import {
  BookFlight,
  HitSlop,
  resetSearchFlight,
  validResponse,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useStyles } from './styles';
import { APP_SCREEN, RootStackParamList } from '@utils';
import { NavToOrderDetail } from '@screens/flight/booking-flight-done/footer';
import { MoreActionButton } from '@screens/flight/booking-flight-done/more-action';

export const BookingFlightDone = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.BOOKING_FLIGHT_DONE
>) => {
  const styles = useStyles();
  const { orderInfo, success } = route.params;

  const [orderDetail, setOrderDetail] = useState<Order | null>(null);

  const isBooking = useMemo(() => orderInfo.Type === BookFlight.KeepSeat, []);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const response = await Data.orderOrderGetOrderCreate({
        Id: orderInfo.OrderId,
        Forced: true,
      });

      if (validResponse(response)) {
        setOrderDetail(response.data.Item as Order);
      }
    };

    fetchOrderDetail();

    const disableBackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      disableBackHandler.remove();
    };
  }, []);

  const arrTotalFare = useMemo(() => {
    if (!orderDetail || !orderDetail.Bookings) {
      return [];
    }

    return orderDetail.Bookings?.map(booking => booking.TotalPrice ?? 0) ?? [];
  }, [orderDetail]);

  const totalFare = arrTotalFare.reduce((total, curr) => total + curr, 0);

  const backToHome = () => {
    reset({
      index: 0,
      routes: [
        {
          name: APP_SCREEN.BOTTOM_TAB_NAV,
        },
      ],
    });
    resetSearchFlight();
  };

  const SubTitle = useMemo(() => {
    switch (true) {
      case isBooking && success:
        return (
          <Text
            fontStyle="Body14Reg"
            colorTheme="neutral900"
            textAlign="center">
            {translate('book_flight_done:description')}{' '}
            <Text
              t18n="book_flight_done:hold_deadline"
              fontStyle="Body14Semi"
            />
          </Text>
        );

      case !isBooking && success:
        return (
          <Text
            t18n="book_flight_done:your_ticket_is_success"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
            textAlign="center"
          />
        );

      default:
        return (
          <Text
            fontStyle="Body14Semi"
            colorTheme="neutral900"
            textAlign="center">
            {translate('book_flight_done:view_order')}{' '}
            <Text
              t18n="common:or"
              fontStyle="Body14Reg"
              colorTheme="neutral800"
            />{' '}
            {translate('book_flight_done:reorder')}
          </Text>
        );
    }
  }, [isBooking, success]);

  const renderItemBooking = useCallback<ListRenderItem<Booking>>(
    ({ item, index }) => {
      const airline = realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        item.Airline!,
      );

      return (
        <Block
          padding={16}
          borderRadius={8}
          colorTheme="neutral100"
          borderWidth={5}
          borderColorTheme="neutral200"
          rowGap={16}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Block width={20} height={20} borderRadius={4} overflow="hidden">
                <SvgUri
                  width={20}
                  height={20}
                  uri={LOGO_URL + item.Airline + '.svg'}
                />
              </Block>
              <Text
                text={airline?.NameVi}
                fontStyle="Body12Reg"
                colorTheme="neutral900"
              />
            </Block>
            <Block
              flexDirection="row"
              alignItems="center"
              paddingVertical={2}
              columnGap={2}>
              <Text
                fontStyle="Body12Bold"
                text={item.StartPoint as string}
                colorTheme="primary900"
              />
              <Icon icon="arrow_right_fill" size={12} colorTheme="neutral900" />
              <Text
                fontStyle="Body12Bold"
                text={item.EndPoint as string}
                colorTheme="primary900"
              />
            </Block>
          </Block>
          <Separator type="horizontal" size={2} />
          <Block
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Block rowGap={2}>
              <Text
                t18n="book_flight_done:booking_code"
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Text
                text={
                  item.BookingCode
                    ? item.BookingCode!
                    : translate('common:failed')
                }
                fontStyle="Title16Bold"
                colorTheme={item.BookingCode ? 'success500' : 'error500'}
              />
            </Block>
            <Block rowGap={2} alignItems="flex-end">
              <Text
                t18n="book_flight_done:total_price"
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Text
                text={arrTotalFare[index].currencyFormat()}
                fontStyle="Title16Bold"
                colorTheme="price"
              />
            </Block>
          </Block>
          {isBooking && success && item.ExpirationDate !== null && (
            <Block borderRadius={8} paddingVertical={10} colorTheme="neutral50">
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral800"
                textAlign="center">
                {translate('book_flight_done:hold_until')}
                {'  '}
                <Text
                  text={dayjs(item.ExpirationDate).format('HH:mm')}
                  colorTheme="warning500"
                  fontStyle="Body14Bold"
                />
                {'  '}
                <Text
                  text={dayjs(item.ExpirationDate).format('DD/MM/YYYY')}
                  colorTheme="neutral900"
                  fontStyle="Body14Semi"
                />
              </Text>
            </Block>
          )}
        </Block>
      );
    },
    [arrTotalFare, isBooking, success],
  );

  return (
    <Screen unsafe statusBarStyle="light-content">
      <NormalHeaderGradient
        centerContent={
          <Text
            t18n="common:done"
            fontStyle="Title20Semi"
            colorTheme="classicWhite"
          />
        }
        rightContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="home_fill"
            leftIconSize={24}
            textColorTheme="classicWhite"
            padding={4}
            onPress={backToHome}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.contentContainerScrollView}>
        <Block paddingHorizontal={16} rowGap={12}>
          <Block paddingVertical={12} width="100%" alignItems="center">
            <Image
              source={success ? images.airplane : images.isolation_mode}
              style={styles.img}
              resizeMode="contain"
            />
          </Block>
          <Text
            fontStyle="Title20Semi"
            colorTheme="neutral900"
            textAlign="center">
            {translate(
              isBooking
                ? 'book_flight_done:booking'
                : 'book_flight_done:issue_ticket',
            )}{' '}
            <Text
              text={
                success
                  ? translate('common:success').toLowerCase()
                  : translate('common:failed').toLowerCase()
              }
              colorTheme={success ? 'success500' : 'error500'}
            />
          </Text>
          {SubTitle}
        </Block>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={styles.contentContainerFlatList}
          showsVerticalScrollIndicator={false}
          data={
            orderDetail?.Bookings?.sort(
              (a, b) => (a.Leg ?? 0) - (b.Leg ?? 0),
            ) ?? []
          }
          renderItem={renderItemBooking}
          keyExtractor={(item, index) => `${item.BookingCode}_${index}`}
          ItemSeparatorComponent={() => <Block height={12} />}
          ListEmptyComponent={
            <ActivityIndicator
              size="small"
              color={ColorLight.primary500}
              style={{ alignSelf: 'center' }}
            />
          }
        />
      </ScrollView>
      <Block style={styles.footer}>
        <Block
          flexDirection="row"
          paddingVertical={2}
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="book_flight_done:total_ticket_price"
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
          <Text fontStyle="Title20Semi" colorTheme="price">
            {totalFare.currencyFormat()}{' '}
            <Text text="VND" colorTheme="neutral900" />
          </Text>
        </Block>
        <NavToOrderDetail orderId={orderInfo.OrderId!} />
        <MoreActionButton />
      </Block>
    </Screen>
  );
};
