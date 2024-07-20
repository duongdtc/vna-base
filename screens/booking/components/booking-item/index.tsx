/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { navigate } from '@navigation/navigation-service';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { APP_SCREEN } from '@utils';
import { Block, Icon, Text } from '@vna-base/components';
import { translate } from '@vna-base/translations/translate';
import {
  BookingStatus,
  BookingStatusDetails,
  getIconOfRoute,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

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

  // const isHideWhenAllExpired =
  //   isExpired &&
  //   (!bookingDetail?.TimePurchase ||
  //     dayjs(bookingDetail?.TimePurchase).isBefore(dayjs()));

  // const airline = bookingDetail?.Airline
  //   ? realmRef.current?.objectForPrimaryKey<AirlineRealm>(
  //       AirlineRealm.schema.name,
  //       bookingDetail?.Airline,
  //     )?.NameEn
  //   : '';

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
        borderRadius={12}
        colorTheme="neutral100"
        rowGap={12}>
        <Block
          flexDirection="row"
          columnGap={4}
          justifyContent="space-between"
          alignItems="flex-start">
          <Block rowGap={4} flex={1}>
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Block flexDirection="row" columnGap={4} alignItems="center">
                <Text
                  text={bookingDetail?.BookingCode ?? 'FAIL'}
                  fontStyle="Title20Bold"
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
              {bookingDetail?.ExpirationDate &&
                bookingDetail?.BookingStatus !== BookingStatus.TICKETED && (
                  <Block flexDirection="row" columnGap={2} alignItems="center">
                    <Text
                      colorTheme={isVisible ? 'neutral70' : 'neutral600'}
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
                  </Block>
                )}
            </Block>
          </Block>
        </Block>

        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon icon="person_fill" size={14} colorTheme="neutral70" />
          <Text
            text="Hành khách"
            fontStyle="Body12Med"
            colorTheme="neutral70"
          />
          <Block flex={1} alignItems="flex-end">
            <Text
              text={bookingDetail.PaxName ?? 'NGUYEN THU TRANG'}
              fontStyle="Body14Semi"
              colorTheme="neutral100"
            />
          </Block>
        </Block>

        <Block flexDirection="row" alignItems="center" columnGap={6}>
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
      </Block>
    </Pressable>
  );
};
