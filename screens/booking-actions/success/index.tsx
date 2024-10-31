/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { popWithStep, reset } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ticket } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  Block,
  Button,
  DescriptionsBooking,
  Icon,
  Image,
  NormalHeaderGradient,
  Screen,
  Separator,
  showToast,
  Text,
} from '@vna-base/components';
import {
  BookingStatus,
  BookingStatusDetails,
  HitSlop,
  resetSearchFlight,
  scale,
  TicketType,
  TicketTypeDetails,
} from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const Success = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.BOOKING_ACTION_SUCCESS
>) => {
  const { flightAction, t18nAnnouncement, tickets, bookingId } = route.params;
  const { styles } = useStyles(styleSheet);

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const title = useMemo(() => {
    switch (flightAction) {
      case 'CheckInOnline':
        return 'Thanh toán online';

      case 'TicketVoid':
        return 'Void vé';

      case 'RefundTicket':
        return 'Hoàn vé';

      default:
        return 'Xuất vé';
    }
    // const flAction = actions?.find(ac => ac.Feature?.Code === flightAction);

    // return Lng === 'en' ? flAction?.Feature?.NameEn : flAction?.Feature?.NameVi;
  }, [flightAction]);

  const goBack = () => {
    // dispatch(
    //   bookingActions.getBookingByIdOrBookingCode(
    //     {
    //       id: bookingId,
    //       bookingCode: bookingDetail!.BookingCode!,
    //       system: bookingDetail!.System!,
    //       surname: bookingDetail?.Passengers[0]?.Surname,
    //     },
    //     {
    //       force: true,
    //     },
    //   ),
    // );

    let step = 2;

    switch (flightAction) {
      case 'ExchangeTicket':
        step = 4;
        break;

      case 'FlightChange':
        step = 4;
        break;

      default:
        step = 2;
        break;
    }

    popWithStep(step);
  };

  const renderTicket = useCallback<ListRenderItem<Ticket>>(({ item }) => {
    return (
      <Block
        flexDirection="row"
        alignItems="center"
        padding={12}
        justifyContent="space-between">
        <Block flex={1}>
          <Text
            text={item.TicketNumber as string}
            fontStyle="Body12Bold"
            colorTheme="neutral900"
          />
          <Text
            text={`${item.FullName}${
              item.Remark && item.Remark !== '' ? ` - ${item.Remark}` : ''
            }`}
            fontStyle="Body12Med"
            colorTheme="neutral600"
            numberOfLines={2}
            ellipsizeMode="tail"
          />
        </Block>
        <Block flex={0.5} alignItems="flex-end">
          <Text
            t18n={TicketTypeDetails[item.TicketType as TicketType]?.t18n}
            fontStyle="Body12Bold"
            colorTheme={
              TicketTypeDetails[item.TicketType as TicketType]?.colorTheme
            }
          />
          <Text
            text={`${item?.StartPoint}-${item?.EndPoint}`}
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
        </Block>
      </Block>
    );
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

  return (
    <Screen
      unsafe
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <NormalHeaderGradient
        gradientType="gra1"
        leftContent={<Block height={32} width={32} />}
        centerContent={
          <Text
            t18n="issue_ticket:completed"
            fontStyle="Title20Semi"
            colorTheme="white"
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Block width={358} height={80} alignItems="center">
          <Image
            source={images.airplane_vna}
            style={styles.img}
            resizeMode="cover"
          />
        </Block>

        <Text
          fontStyle="Title20Semi"
          colorTheme="primary900"
          textAlign="center">
          {title}{' '}
          <Text
            fontStyle="Title20Semi"
            colorTheme="success500"
            t18n="issue_ticket:success"
          />
        </Text>
        <Pressable
          hitSlop={HitSlop.Medium}
          style={{ alignItems: 'center' }}
          onPress={() => {
            Clipboard.setString(bookingDetail?.BookingCode ?? '');

            showToast({
              type: 'success',
              t18n: 'order_detail:copy_booking_code_success',
            });
          }}>
          <Block justifyContent="center" alignItems="center" rowGap={4}>
            <Text
              t18n="re_book:booking_code"
              fontStyle="Body12Reg"
              colorTheme="neutral600"
            />
            <Text
              text={bookingDetail?.BookingCode}
              fontStyle="Title20Bold"
              colorTheme={
                BookingStatusDetails[
                  bookingDetail?.BookingStatus as BookingStatus
                ]?.iconColorTheme
              }
            />
            <Block style={styles.copyIcon}>
              <Icon icon="fi_sr_copy_alt" size={16} colorTheme="neutral300" />
            </Block>
          </Block>
        </Pressable>
        {t18nAnnouncement && (
          <DescriptionsBooking t18n={t18nAnnouncement} colorTheme="neutral50" />
        )}

        <Block
          borderRadius={8}
          shadow="small"
          colorTheme="neutral100"
          borderColorTheme="neutral200"
          borderWidth={10}>
          <FlatList
            data={tickets}
            scrollEnabled={false}
            keyExtractor={(tk, index) => `${tk.TicketNumber}_${index}`}
            ItemSeparatorComponent={() => (
              <Separator type="horizontal" size={4} />
            )}
            renderItem={renderTicket}
          />
        </Block>
      </ScrollView>
      <Block style={styles.containerBottom}>
        {flightAction === 'TicketIssue' ? (
          <Block rowGap={10}>
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
                  text="Quản lý đặt chỗ"
                  buttonColorTheme="gra1"
                  textColorTheme="neutral10"
                  size="medium"
                  fullWidth
                  paddingVertical={12}
                  onPress={() => {}}
                />
              </Block>
            </Block>
          </Block>
        ) : (
          <Button
            fullWidth
            t18n="issue_ticket:closed"
            type="classic"
            textColorTheme="neutral900"
            onPress={() => {
              reset({
                index: 0,
                routes: [
                  {
                    name: APP_SCREEN.BOTTOM_TAB_NAV,

                    state: {
                      routes: [
                        {
                          name: APP_SCREEN.BOOKING,
                        },
                      ],
                    },
                  },
                ],
              });
            }}
          />
        )}
      </Block>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, shadows }, rt) => ({
  img: { width: scale(198), height: scale(62.29) },
  container: {
    backgroundColor: colors.neutral10,
  },
  containerBottom: {
    backgroundColor: colors.neutral10,
    borderTopWidth: scale(2),
    borderColor: colors.neutral20,
    paddingTop: scale(12),
    paddingHorizontal: scale(12),
    paddingBottom: rt.insets.bottom + scale(8),
    ...shadows.main,
  },
  contentContainer: {
    padding: scale(12),
    rowGap: scale(12),
  },
  copyIcon: {
    position: 'absolute',
    bottom: 6,
    right: -20,
  },
}));
