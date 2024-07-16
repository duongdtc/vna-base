/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IconTypes } from '@assets/icon';
import { Block, Button, Icon, showToast, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { navigate } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  selectLoadingBooking,
  selectLoadingFlightAction,
} from '@redux-selector';
import { FlightActionExpandParams } from '@vna-base/screens/booking-detail/type';
import { AirlineRealm } from '@services/realm/models';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject, useRealm } from '@services/realm/provider';
import { useTheme } from '@theme';
import { Opacity } from '@theme/color';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  BookingStatus,
  BookingStatusDetails,
  getIconOfRoute,
  scale,
  System,
  SystemDetails,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';

export type FlightBookingContent = {
  bookingCode: string;
  bookingStatus: BookingStatus;
};

export const ItemBooking = ({
  id,
  showFlightActionOfBooking,
}: {
  id: string;
  showFlightActionOfBooking: (
    args: Omit<FlightActionExpandParams, 'closeBottomSheet'>,
  ) => void;
}) => {
  const realm = useRealm();
  const [t] = useTranslation();
  const { colors } = useTheme();

  const isLoadingDetail = useSelector(selectLoadingBooking(id));
  const isLoadingBookingAction = useSelector(selectLoadingFlightAction(id));

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const airline = realm.objectForPrimaryKey<AirlineRealm>(
    AirlineRealm.schema.name,
    bookingDetail?.Airline as string,
  );

  const _showFlightActionOfBooking = () => {
    showFlightActionOfBooking({
      bookingId: id,
    });
  };

  const onPressDetail = () => {
    if (!isEmpty(bookingDetail)) {
      navigate(APP_SCREEN.BOOKING_DETAIL, {
        id: id,
        system: bookingDetail.System!,
        bookingCode: bookingDetail.BookingCode!,
        surname: bookingDetail.Passengers![0]!.Surname!,
      });
    }
  };

  const status = useMemo(
    () => BookingStatusDetails[bookingDetail?.BookingStatus as BookingStatus],
    [bookingDetail],
  );

  return (
    <Block borderRadius={12} overflow="hidden">
      <Block
        borderWidth={5}
        colorTheme="neutral100"
        borderColorTheme="neutral200"
        paddingTop={12}
        rowGap={12}>
        {/* //cmt:  system + booking code */}
        <Block
          paddingHorizontal={12}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Block flexDirection="row" alignItems="center" columnGap={8}>
            {/* //cmt:  image airline */}
            <Block width={33} height={33} borderRadius={8} overflow="hidden">
              <SvgUri
                width={33}
                height={33}
                uri={LOGO_URL + bookingDetail?.Airline + '.svg'}
              />
            </Block>
            {/* //cmt:  booking code + name airline */}
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                Clipboard.setString(bookingDetail?.BookingCode ?? '');
                showToast({
                  type: 'success',
                  t18n: 'order_detail:copy_booking_code_success',
                });
              }}>
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Text
                  text={
                    bookingDetail?.BookingCode !== null &&
                    bookingDetail?.BookingCode !== ''
                      ? `${bookingDetail?.BookingCode}`
                      : 'FAIL'
                  }
                  colorTheme={
                    bookingDetail?.BookingCode !== null &&
                    bookingDetail?.BookingCode !== '' &&
                    bookingDetail?.BookingCode !== 'FAIL'
                      ? 'success600'
                      : 'error500'
                  }
                  fontStyle="Title20Bold"
                />
                <Icon icon="fi_sr_copy_alt" size={16} colorTheme="neutral300" />
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon={status?.icon as IconTypes}
                    size={16}
                    colorTheme={status?.iconColorTheme}
                  />
                  <Text
                    t18n={status?.t18n as I18nKeys}
                    fontStyle="Body12Med"
                    colorTheme="neutral900"
                  />
                </Block>
              </Block>
              <Text
                text={airline?.NameVi ?? airline?.NameEn}
                fontStyle="Capture11Reg"
                colorTheme="neutral800"
              />
            </TouchableOpacity>
          </Block>
          {/* //cmt:  info system */}
          <Block
            alignSelf="flex-start"
            position="absolute"
            flexDirection="row"
            alignItems="center"
            colorTheme={
              SystemDetails[bookingDetail?.System as System]?.colorTheme
            }
            style={{
              borderBottomLeftRadius: scale(10),
              borderTopRightRadius: scale(10),
              right: 0,
              top: -12,
            }}
            paddingVertical={4}
            paddingHorizontal={12}>
            <Text fontStyle="Capture11Reg" colorTheme="classicWhite">
              {translate('booking:system')}
              {': '}
              <Text
                fontStyle="Capture11Bold"
                colorTheme="classicWhite"
                text={bookingDetail?.System}
              />
            </Text>
          </Block>
        </Block>

        {/* //cmt: flight + status */}
        <Block
          paddingHorizontal={12}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          {/* //cmt: flight  */}
          <Block flex={1} rowGap={8}>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={bookingDetail?.StartPoint as string}
                fontStyle="Body14Bold"
                colorTheme="primary900"
              />
              <Icon
                icon={getIconOfRoute(
                  bookingDetail?.MultiCity,
                  bookingDetail?.RoundTrip,
                )}
                size={18}
                colorTheme="neutral800"
              />
              <Text
                text={bookingDetail?.EndPoint as string}
                fontStyle="Body14Bold"
                colorTheme="primary900"
              />
            </Block>
            {/* //cmt: departure date */}
            <Text fontStyle="Capture11Reg" colorTheme="neutral800">
              {`${dayjs(bookingDetail?.DepartDate).format('DD/MM/YYYY')} `}
              <Text
                text={dayjs(bookingDetail?.DepartDate).format('HH:mm')}
                fontStyle="Capture11Bold"
                colorTheme="price"
              />
            </Text>
          </Block>
          <Block flex={1}>
            <Text
              t18n="order:customer_name"
              fontStyle="Body12Reg"
              colorTheme="neutral700"
            />
            <Text
              text={bookingDetail?.PaxName?.toUpperCase()}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Block>
        </Block>
        {BookingStatus.OK === bookingDetail?.BookingStatus &&
          (bookingDetail?.ExpirationDate || bookingDetail?.TimePurchase) && (
            <Block
              marginHorizontal={12}
              flexDirection="row"
              alignItems="center">
              {bookingDetail?.ExpirationDate && (
                <Block flex={1} rowGap={4}>
                  <Text
                    text={`${t('booking:reservation_deadline')}: `}
                    fontStyle="Capture11Reg"
                    colorTheme="neutral800"
                  />
                  <Block flexDirection="row" columnGap={4} alignItems="center">
                    <Text
                      fontStyle="Capture11Reg"
                      colorTheme={
                        dayjs(bookingDetail?.ExpirationDate).isAfter(dayjs())
                          ? 'success600'
                          : 'error600'
                      }>
                      {`${dayjs(bookingDetail?.ExpirationDate).format(
                        'DD/MM/YYYY',
                      )} `}
                      <Text
                        text={dayjs(bookingDetail?.ExpirationDate).format(
                          'HH:mm',
                        )}
                        fontStyle="Capture11Bold"
                        colorTheme={
                          dayjs(bookingDetail?.ExpirationDate).isAfter(dayjs())
                            ? 'success600'
                            : 'error600'
                        }
                      />
                    </Text>
                    {dayjs(bookingDetail?.ExpirationDate).isBefore(dayjs()) && (
                      <Icon
                        icon="alert_circle_outline"
                        colorTheme="error600"
                        size={12}
                      />
                    )}
                  </Block>
                </Block>
              )}
              {bookingDetail?.TimePurchase && (
                <Block flex={1} rowGap={4}>
                  <Text
                    text={`${t('booking:price_hold_deadline')}: `}
                    fontStyle="Capture11Reg"
                    colorTheme="neutral800"
                  />
                  <Text
                    fontStyle="Capture11Reg"
                    colorTheme={
                      dayjs(bookingDetail?.TimePurchase).isAfter(dayjs())
                        ? 'primary600'
                        : 'error600'
                    }>
                    {`${dayjs(bookingDetail?.TimePurchase).format(
                      'DD/MM/YYYY',
                    )} `}
                    <Text
                      text={dayjs(bookingDetail?.TimePurchase).format('HH:mm')}
                      fontStyle="Capture11Bold"
                      colorTheme={
                        dayjs(bookingDetail?.TimePurchase).isAfter(dayjs())
                          ? 'primary600'
                          : 'error600'
                      }
                    />
                  </Text>
                </Block>
              )}
            </Block>
          )}
        {/* //cmt: button action footer */}
        <Block
          flexDirection="row"
          alignItems="center"
          borderTopWidth={10}
          borderColorTheme="neutral200">
          <Block flex={1}>
            <Button
              fullWidth
              rightIcon="external_link_fill"
              size="medium"
              t18n="order_detail:operation"
              textColorTheme="neutral900"
              disabled={isLoadingBookingAction}
              paddingVertical={10}
              textFontStyle="Body12Med"
              rightIconSize={16}
              activityIndicatorColorTheme="neutral800"
              isLoading={isLoadingBookingAction}
              onPress={_showFlightActionOfBooking}
            />
          </Block>
          <Block width={1} height={20} colorTheme="neutral200" />
          <Block flex={1}>
            <Button
              textFontStyle="Body12Med"
              rightIconSize={16}
              fullWidth
              paddingVertical={10}
              onPress={onPressDetail}
              rightIcon="arrow_ios_right_fill"
              size="medium"
              t18n="common:detail"
              textColorTheme="neutral900"
            />
          </Block>
        </Block>
      </Block>
      {isLoadingDetail && (
        <Block
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.neutral100 + Opacity[80],
          }}>
          <ActivityIndicator color={colors.neutral800} size="small" />
        </Block>
      )}
    </Block>
  );
};
