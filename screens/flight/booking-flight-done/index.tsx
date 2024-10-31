/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { reset } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreActionButton } from '@screens/flight/booking-flight-done/more-action';
import { Booking } from '@services/axios/axios-data';
import { AirlineRealm } from '@services/realm/models';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef, useObject } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { ColorLight } from '@theme/color';
import { APP_SCREEN, RootStackParamList } from '@utils';
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
import { translate } from '@vna-base/translations/translate';
import { resetSearchFlight, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

export const BookingFlightDone = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.BOOKING_FLIGHT_DONE
>) => {
  const { styles } = useStyles(styleSheet);
  const { bookingId, success } = route.params;

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  useEffect(() => {
    const disableBackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      disableBackHandler.remove();
    };
  }, []);

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
    return (
      <Text fontStyle="Body14Reg" colorTheme="neutral900" textAlign="center">
        {translate('book_flight_done:description')}{' '}
        <Text t18n="book_flight_done:hold_deadline" fontStyle="Body14Semi" />
      </Text>
    );
  }, [success]);

  const renderItemBooking = useCallback<ListRenderItem<Booking>>(
    ({ item, index }) => {
      const airline = realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        item.Airline!,
      );

      const listAirport = item.Flights?.reduce((total, curr, currIdx, arr) => {
        if (currIdx === 0) {
          total.push(curr.StartPoint);
          total.push(curr.EndPoint);
        } else {
          if (arr[currIdx - 1].EndPoint !== curr.StartPoint) {
            total.push(curr.StartPoint);
          }
          total.push(curr.EndPoint);
        }

        return total;
      }, []);

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
                <Image
                  source={images.logo_vna}
                  style={{ width: scale(20), height: scale(20) }}
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
              {listAirport?.map((ap, idx) => (
                <>
                  {idx !== 0 && (
                    <Icon
                      icon="arrow_right_fill"
                      size={12}
                      colorTheme="neutral900"
                    />
                  )}
                  <Text
                    fontStyle="Body12Bold"
                    text={ap}
                    colorTheme="primary900"
                  />
                </>
              ))}
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
                text={item.TotalPrice.currencyFormat()}
                fontStyle="Title16Bold"
                colorTheme="price"
              />
            </Block>
          </Block>
          {success && item.ExpirationDate !== null && (
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
    [success],
  );

  return (
    <Screen unsafe statusBarStyle="light-content">
      <NormalHeaderGradient
        gradientType="gra1"
        leftContent={<Block height={32} width={32} />}
        centerContent={
          <Text t18n="common:done" fontStyle="Title20Semi" colorTheme="white" />
        }
      />
      <ScrollView contentContainerStyle={styles.contentContainerScrollView}>
        <Block paddingHorizontal={16} rowGap={12}>
          <Block paddingVertical={12} width="100%" alignItems="center">
            <Image
              source={success ? images.airplane_vna : images.isolation_mode}
              style={styles.img}
              resizeMode="cover"
            />
          </Block>
          <Text
            fontStyle="Title20Semi"
            colorTheme="neutral900"
            textAlign="center">
            {translate('book_flight_done:booking')}{' '}
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
          data={[bookingDetail]}
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
        {/* <Block
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
            {bookingDetail?.TotalPrice?.currencyFormat()}{' '}
            <Text text="VND" colorTheme="neutral900" />
          </Text>
        </Block> */}
        <Block flexDirection="row" alignItems="center" columnGap={10}>
          <Block flex={1}>
            <Button
              text="Gửi email KH"
              buttonColorTheme="gra1"
              textColorTheme="neutral10"
              size="medium"
              fullWidth
              paddingVertical={12}
              onPress={() => {}}
            />
          </Block>
          <Block flex={1}>
            <Button
              text="Gửi SMS"
              buttonColorTheme="gra1"
              textColorTheme="neutral10"
              size="medium"
              fullWidth
              paddingVertical={12}
              onPress={() => {}}
            />
          </Block>
        </Block>
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={10}
          justifyContent="space-between">
          <Block flex={1}>
            <Button
              text="Tiếp tục đặt chỗ"
              buttonColorTheme="gra1"
              textColorTheme="neutral10"
              size="medium"
              fullWidth
              paddingVertical={12}
              onPress={backToHome}
            />
          </Block>
          <Block flex={1}>
            <Button
              text="Chi tiết đặt chỗ"
              buttonColorTheme="gra1"
              textColorTheme="neutral10"
              size="medium"
              fullWidth
              paddingVertical={12}
              onPress={() => {}}
            />
          </Block>
        </Block>
        <MoreActionButton />
      </Block>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, shadows }) => ({
  contentContainerScrollView: {
    paddingTop: scale(12),
    rowGap: scale(12),
    backgroundColor: colors.neutral10,
  },
  contentContainerFlatList: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  img: { width: scale(198), height: scale(62.29) },
  footer: {
    padding: scale(12),
    paddingBottom: scale(12) + UnistylesRuntime.insets.bottom,
    backgroundColor: colors.neutral10,
    rowGap: scale(10),
    ...shadows.main,
  },
}));
