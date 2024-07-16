/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { navigate } from '@navigation/navigation-service';
import { Booking } from '@services/axios/axios-data';
import { AirlineRealm } from '@services/realm/models';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef, useObject } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  BookingStatus,
  BookingStatusDetails,
  getIconOfRoute,
  System,
  SystemDetails,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { APP_SCREEN } from '@utils';

export type Props = {
  /**
   * phải truyền 1 trong 2 item hoặc id
   */
  item?: Booking;
  id?: string;
  customStyle?: StyleProp<ViewStyle>;
};

export const BookingItem = ({ item, customStyle, id }: Props) => {
  const _bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const bookingDetail = (item ?? _bookingDetail) as Booking;

  const status =
    BookingStatusDetails[bookingDetail?.BookingStatus as BookingStatus];

  const isVisible = bookingDetail?.Visible;

  const isExpired =
    !bookingDetail?.ExpirationDate ||
    dayjs(bookingDetail?.ExpirationDate).isBefore(dayjs());

  const isHideWhenAllExpired =
    isExpired &&
    (!bookingDetail?.TimePurchase ||
      dayjs(bookingDetail?.TimePurchase).isBefore(dayjs()));

  const airline = bookingDetail?.Airline
    ? realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        bookingDetail?.Airline,
      )?.NameEn
    : '';

  return (
    <Pressable
      onPress={() => {
        navigate(APP_SCREEN.BOOKING_DETAIL, {
          id: bookingDetail.Id!,
          system: bookingDetail.System!,
          bookingCode: bookingDetail.BookingCode!,
          surname: (bookingDetail.Passengers ?? [])[0]?.Surname ?? '',
        });
      }}>
      <Block
        style={customStyle}
        padding={12}
        colorTheme="neutral100"
        rowGap={12}>
        <Block
          flexDirection="row"
          columnGap={4}
          justifyContent="space-between"
          alignItems="flex-start">
          <Block rowGap={4} flex={1}>
            <Block flexDirection="row" columnGap={4} alignItems="center">
              <Text
                text={bookingDetail?.BookingCode ?? 'FAIL'}
                fontStyle="Title16Bold"
                colorTheme={
                  // eslint-disable-next-line no-nested-ternary
                  isVisible
                    ? !bookingDetail?.BookingCode
                      ? 'error600'
                      : 'success600'
                    : 'neutral600'
                }
              />
              <Icon
                icon={status?.icon}
                size={13}
                colorTheme={isVisible ? status?.iconColorTheme : 'neutral600'}
              />
              <Text
                t18n={status?.t18n}
                fontStyle="Body12Med"
                colorTheme={isVisible ? 'neutral700' : 'neutral600'}
              />
            </Block>

            <Block flexDirection="row" alignItems="center" columnGap={4}>
              {bookingDetail?.OrderCode && (
                <Text fontStyle="Capture11Reg" colorTheme="neutral800">
                  {translate('booking:order')}
                  {': '}
                  <Text
                    text={bookingDetail?.OrderCode ?? ''}
                    fontStyle="Capture11Bold"
                  />
                </Text>
              )}
              {bookingDetail?.OrderCode && bookingDetail?.AgentName && (
                <Block
                  height={4}
                  width={4}
                  borderRadius={2}
                  colorTheme="neutral600"
                />
              )}
              {bookingDetail?.AgentName && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text={bookingDetail?.AgentName}
                  fontStyle="Capture11Reg"
                  colorTheme="neutral800"
                />
              )}
              {bookingDetail?.AgentName && bookingDetail?.Airline && (
                <Block
                  height={4}
                  width={4}
                  borderRadius={2}
                  colorTheme="neutral600"
                />
              )}
              {bookingDetail?.Airline && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text={airline}
                  fontStyle="Capture11Reg"
                  colorTheme="neutral800"
                />
              )}
            </Block>
          </Block>

          <Block
            borderRadius={4}
            paddingVertical={4}
            paddingHorizontal={6}
            colorTheme={
              isVisible
                ? SystemDetails[bookingDetail?.System as System]?.colorTheme
                : 'neutral600'
            }>
            <Text fontStyle="Capture11Reg" colorTheme="classicWhite">
              {translate('booking:system')}
              {': '}
              <Text
                fontStyle="Capture11Bold"
                colorTheme="classicWhite"
                text={bookingDetail?.System ?? ''}
              />
            </Text>
          </Block>
        </Block>

        <Block flexDirection="row" alignItems="center" columnGap={6}>
          <Block width={32} height={32} borderRadius={8} overflow="hidden">
            {bookingDetail?.Airline && (
              <SvgUri
                width={32}
                height={32}
                uri={LOGO_URL + bookingDetail?.Airline + '.svg'}
              />
            )}
          </Block>

          <Block rowGap={2} flex={1}>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={bookingDetail?.StartPoint ?? ''}
                fontStyle="Body14Semi"
                colorTheme={isVisible ? 'primary900' : 'neutral600'}
              />
              <Icon
                icon={getIconOfRoute(
                  bookingDetail?.MultiCity,
                  bookingDetail?.RoundTrip,
                )}
                size={18}
                colorTheme={isVisible ? 'neutral800' : 'neutral600'}
              />
              <Text
                text={bookingDetail?.EndPoint ?? ''}
                fontStyle="Body14Semi"
                colorTheme={isVisible ? 'primary900' : 'neutral600'}
              />
            </Block>
            <Text fontStyle="Capture11Reg" colorTheme="neutral800">
              {dayjs(bookingDetail?.DepartDate).format('DD/MM/YYYY')}{' '}
              <Text
                text={dayjs(bookingDetail?.DepartDate).format('HH:mm')}
                fontStyle="Capture11Bold"
                colorTheme="price"
              />
            </Text>
          </Block>

          <Block rowGap={2} alignItems="flex-end">
            <Text
              fontStyle="Body12Med"
              colorTheme="neutral600"
              t18n="booking:price"
            />
            <Text
              fontStyle="Title16Bold"
              colorTheme={isVisible ? 'price' : 'neutral600'}
              text={Number(bookingDetail?.TotalPrice).currencyFormat()}
            />
          </Block>
        </Block>

        {!isHideWhenAllExpired && (
          <Block flexDirection="row" columnGap={4} alignItems="center">
            {bookingDetail?.ExpirationDate && (
              <Block flexDirection="row" columnGap={2} alignItems="center">
                <Text
                  colorTheme={isVisible ? 'neutral800' : 'neutral600'}
                  fontStyle="Capture11Reg">
                  {`${translate('booking:reservation_deadline')}: `}
                  <Text
                    colorTheme={
                      // eslint-disable-next-line no-nested-ternary
                      isVisible
                        ? isExpired
                          ? 'error600'
                          : 'success600'
                        : 'neutral600'
                    }
                    fontStyle="Capture11Reg">
                    {`${dayjs(bookingDetail?.ExpirationDate).format(
                      'DD/MM/YYYY ',
                    )}`}
                    <Text
                      colorTheme={
                        // eslint-disable-next-line no-nested-ternary
                        isVisible
                          ? isExpired
                            ? 'error600'
                            : 'success600'
                          : 'neutral600'
                      }
                      fontStyle="Capture11Bold"
                      text={dayjs(bookingDetail?.ExpirationDate).format(
                        ' HH:mm',
                      )}
                    />
                  </Text>
                </Text>
                {isExpired && (
                  <Icon
                    icon="alert_circle_outline"
                    size={12}
                    colorTheme="error600"
                  />
                )}
              </Block>
            )}

            {bookingDetail?.TimePurchase && (
              <Text
                colorTheme={isVisible ? 'neutral800' : 'neutral600'}
                fontStyle="Capture11Reg">
                {`${translate('booking:price_hold_deadline')}: `}
                <Text
                  colorTheme={isVisible ? 'primary600' : 'neutral600'}
                  fontStyle="Capture11Reg">
                  {`${dayjs(bookingDetail?.TimePurchase).format(
                    'DD/MM/YYYY',
                  )} `}
                  <Text
                    colorTheme={isVisible ? 'primary600' : 'neutral600'}
                    fontStyle="Capture11Bold"
                    text={dayjs(bookingDetail?.TimePurchase).format('HH:mm')}
                  />
                </Text>
              </Text>
            )}
          </Block>
        )}
      </Block>
    </Pressable>
  );
};
