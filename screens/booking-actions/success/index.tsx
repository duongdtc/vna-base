/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
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
import { navigate, popWithStep } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  selectFlightActionsByBookingId,
  selectLanguage,
} from '@vna-base/redux/selector';
import { Ticket } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import {
  BookingStatus,
  BookingStatusDetails,
  dispatch,
  HitSlop,
  TicketType,
  TicketTypeDetails,
} from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { useObject } from '@services/realm/provider';
import { bookingActions } from '@vna-base/redux/action-slice';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const Success = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.BOOKING_ACTION_SUCCESS
>) => {
  const { flightAction, t18nAnnouncement, tickets, bookingId } = route.params;
  const styles = useStyles();

  const actions = useSelector(selectFlightActionsByBookingId(bookingId));
  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );
  const Lng = useSelector(selectLanguage);

  const isShowRemark = flightAction !== 'TicketIssue';

  const title = useMemo(() => {
    const flAction = actions?.find(ac => ac.Feature?.Code === flightAction);

    return Lng === 'en' ? flAction?.Feature?.NameEn : flAction?.Feature?.NameVi;
  }, [Lng, actions, flightAction]);

  const goBack = () => {
    dispatch(
      bookingActions.getBookingByIdOrBookingCode(
        {
          id: bookingId,
          bookingCode: bookingDetail!.BookingCode!,
          system: bookingDetail!.System!,
          surname: bookingDetail?.Passengers[0]?.Surname,
        },
        {
          force: true,
        },
      ),
    );

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
    console.log('🚀 ~ item:', item);
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
            text={`${item?.StartPoint?.Code}-${item?.EndPoint?.Code}`}
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
        </Block>
      </Block>
    );
  }, []);

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
          {'Xuất vé'}{' '}
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
              text={'5XGQTY'}
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
        <Button
          fullWidth
          t18n="issue_ticket:closed"
          type="classic"
          textColorTheme="neutral900"
          onPress={() => {
            navigate(APP_SCREEN.SEARCH_FLIGHT);
          }}
        />
      </Block>
    </Screen>
  );
};
