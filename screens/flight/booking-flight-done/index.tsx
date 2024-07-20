/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { LOGO_URL } from '@env';
import { reset } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavToOrderDetail } from '@screens/flight/booking-flight-done/footer';
import { MoreActionButton } from '@screens/flight/booking-flight-done/more-action';
import { Booking, Order, OrderRes } from '@services/axios/axios-data';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
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
import {
  BookFlight,
  getState,
  HitSlop,
  load,
  resetSearchFlight,
  save,
  StorageKey,
  validResponse,
} from '@vna-base/utils';
import { createBookingFromAxios } from '@vna-base/utils/realm/bookings';
import { AxiosResponse } from 'axios';
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
import { UpdateMode } from 'realm';
import { PassengerForm } from '../type';
import { useStyles } from './styles';

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
      // const response = await Data.orderOrderGetOrderCreate({
      //   Id: orderInfo.OrderId,
      //   Forced: true,
      // });

      const response = await fakeOrderDetail();

      if (validResponse(response)) {
        setOrderDetail(response.data.Item as Order);
        save(StorageKey.DETAIL_ORDER_BOOKING, {
          price: response.data.Item?.TotalPrice,
          bookingCode: response.data.Item?.Bookings?.[0]?.BookingCode,
          bookingId: response.data.Item?.Bookings[0].Id,
        });
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
        gradientType="gra1"
        centerContent={
          <Text t18n="common:done" fontStyle="Title20Semi" colorTheme="white" />
        }
        rightContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="home_fill"
            leftIconSize={24}
            textColorTheme="white"
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

async function fakeOrderDetail(): Promise<AxiosResponse<OrderRes, any>> {
  try {
    const bookingForm = load(StorageKey.FORM_BOOKING) as PassengerForm;
    const price = load(StorageKey.PRICE_BOOK) ?? 0;
    const { routes } = getState('flightSearch');

    const booking = {
      AgentCode: null,
      AgentName: null,
      SubAgId: null,
      SubAgCode: null,
      SubAgName: null,
      CreatedUser: null,
      CreatedAvar: null,
      OrderCode: null,
      BookingImage: null,
      ListAirline: null,
      ListAirport: null,
      ListAircraft: null,
      Id: String.prototype.randomUniqueId(),
      Index: 6910,
      OfficeId: null,
      AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
      ListParent: null,
      OrderId: '61E58773-65BD-4F06-98E9-482BD338C365',
      CreatedBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
      BookingCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      BookingStatus: 'OK',
      BookingDate: '2024-07-19T10:06:34.003',
      ExpirationDate: '2024-07-19T22:06:00',
      TimePurchase: '2024-07-19T22:06:00',
      System: 'VN',
      Airline: 'VN',
      Leg: 0,
      Itinerary: 1,
      StartPoint: routes[0].StartPoint.Code,
      EndPoint: routes[0].EndPoint.Code,
      DepartDate: dayjs(routes[0].DepartDate).toString(),
      ReturnDate: null,
      Message: null,
      Latency: 10.3096807,
      Pcc: null,
      SignIn: 'VNA00017',
      Adt: 1,
      Chd: 0,
      Inf: 0,
      TotalPrice: price,
      NetPrice: 2340000,
      Profit: 100000,
      Currency: 'VND',
      EquivCurrency: 'VND',
      CurrencyRate: 1,
      FareClass: 'N',
      FareBasis: 'NPXVNF',
      Promo: false,
      AutoIssue: false,
      AccountCode: null,
      Tourcode: null,
      CACode: null,
      FlightType: 'domestic',
      FlightInfo: 'VN-HANSGN-22/07/2024',
      PaxName:
        bookingForm.Passengers[0].FullName !== ''
          ? bookingForm.Passengers[0].FullName
          : `${bookingForm.Passengers[0].Surname} ${bookingForm.Passengers[0].GivenName}`,
      PaxSumm: '1 ADT',
      MultiCity: false,
      RoundTrip: false,
      ContactTitle: '',
      ContactName: '',
      ContactArea: '+84',
      ContactPhone: bookingForm.ContactInfo.PhoneNumber ?? '',
      ContactEmail: bookingForm.ContactInfo.Email ?? '',
      ContactAddress: '',
      AgentPhone: null,
      AgentEmail: null,
      FareRule: 'DTC117',
      PNRImage: 'DTC117',
      Visible: true,
      ParentId: null,
      ParentPNR: null,
      NdcCode: null,
      Ancillaries: [],
      Charges: [],
      FareInfos: [],
      Flights: [
        {
          Id: 8323,
          BookingId: 'BB4BE6C2-3D4E-4ADA-B3BB-2F11A3079BDD',
          Leg: 0,
          FlightId: '2',
          Airline: 'VN',
          Operator: 'VN',
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-22T17:00:00',
          ArriveDate: '2024-07-22T19:15:00',
          FlightNumber: '217',
          StopNum: 0,
          Duration: 135,
          Booking: null,
          Segments: [
            {
              Id: 9505,
              FlightId: 8323,
              Leg: 0,
              SegmentId: '1',
              Airline: 'VN',
              Operator: 'VN',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              DepartDate: '2024-07-22T17:00:00',
              ArriveDate: '2024-07-22T19:15:00',
              FlightNumber: '217',
              FlightsMiles: 0,
              MarriageGrp: null,
              Duration: 135,
              Equipment: '359',
              StartTerminal: '1',
              EndTerminal: '1',
              HasStop: false,
              StopPoint: null,
              StopTime: 0,
              Status: 'HK',
              FareClass: 'N',
              FareBasis: 'NPXVNF',
              Flight: null,
            },
          ],
        },
      ],
      Order: null,
      Passengers: [
        {
          Id: '7FBA0F43-63E5-41B5-816C-0F71CE1459FD',
          Index: 9277,
          BookingId: 'BB4BE6C2-3D4E-4ADA-B3BB-2F11A3079BDD',
          PaxIndex: 1,
          ParentId: null,
          PaxType: 'ADT',
          GivenName: 'NGO',
          Surname: 'HAI',
          Title: 'MR',
          Gender: 1,
          NameId: '2',
          BirthDate: null,
          Nationality: null,
          IssueCountry: null,
          DocumentType: null,
          DocumentNumb: null,
          DocumentExpiry: null,
          Membership: '',
          Visible: true,
          Ancillaries: [],
          Booking: null,
          Charges: [],
          Tickets: [],
        },
      ],
      Tickets: [],
    };

    realmRef.current?.write(() => {
      createBookingFromAxios(booking, UpdateMode.All);
    });

    return {
      data: {
        Item: {
          AgentCode: 'DC10899',
          AgentName: 'Demo agent',
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Tran Khanh Hung',
          CreatedAvar: 'https://cdn1.datacom.vn/images/avatar/e1wydzxd.jpg',
          MonitorUser: 'Tran Khanh Hung',
          Payable: price,
          TotalEquiv: 0,
          ListAirline: [
            {
              Code: 'VN',
              AirGroup: 'VNA',
              NameVi: 'Vietnam Airlines',
              NameEn: 'Vietnam Airlines',
              NameZh: null,
              NameKo: '베트남 항공',
              NameJa: 'ベトナム航空',
              AirMaps: [],
            },
          ],
          ListAirport: [
            {
              CityName: null,
              CountryName: null,
              RegionName: null,
              RegionCode: null,
              Code: 'HAN',
              CityCode: 'HAN',
              NameVi: 'Sân bay Nội Bài',
              NameEn: 'Noi Bai International Airport',
              NameZh: null,
              NameKo: '노이 바이 국제공항',
              NameJa: 'ノイバイ国際空港',
              Timezone: '+07:00',
              Order: 121,
              CityCodeNavigation: {
                Code: 'HAN',
                CountryCode: 'VN',
                NameVi: 'Hà Nội',
                NameEn: 'Hanoi',
                NameZh: null,
                NameKo: '하노이',
                NameJa: 'ハノイ',
                CountryCodeNavigation: {
                  Code: 'VN',
                  RegionCode: 'VN',
                  NameVi: 'Việt Nam',
                  NameEn: 'Vietnam',
                  NameZh: null,
                  NameKo: '베트남',
                  NameJa: 'ベトナム社会主義共和国',
                  Description: null,
                  DialCode: '+84',
                  GeoCities: [null],
                  GeoMaps: [],
                },
                GeoAirports: [null],
              },
            },
            {
              CityName: null,
              CountryName: null,
              RegionName: null,
              RegionCode: null,
              Code: 'SGN',
              CityCode: 'SGN',
              NameVi: 'Sân bay Tân Sơn Nhất',
              NameEn: 'Tan Son Nhat International Airport',
              NameZh: null,
              NameKo: '탄손 낫 국제공항',
              NameJa: 'タンソンニャット国際空港',
              Timezone: '+07:00',
              Order: 120,
              CityCodeNavigation: {
                Code: 'SGN',
                CountryCode: 'VN',
                NameVi: 'Hồ Chí Minh',
                NameEn: 'Ho Chi Minh City',
                NameZh: null,
                NameKo: '호치민시',
                NameJa: 'ホーチミン',
                CountryCodeNavigation: {
                  Code: 'VN',
                  RegionCode: 'VN',
                  NameVi: 'Việt Nam',
                  NameEn: 'Vietnam',
                  NameZh: null,
                  NameKo: '베트남',
                  NameJa: 'ベトナム社会主義共和国',
                  Description: null,
                  DialCode: '+84',
                  GeoCities: [null],
                  GeoMaps: [],
                },
                GeoAirports: [null],
              },
            },
          ],
          ListAircraft: [],
          Id: '61E58773-65BD-4F06-98E9-482BD338C365',
          Index: 6923,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          CreatedBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
          MonitorBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
          OrderType: 'flight',
          OrderStatus: 'NEW',
          CreatedDate: dayjs().toString(),
          ContactTitle: '',
          ContactName: bookingForm.ContactInfo.FullName ?? '',
          ContactArea: '+84',
          ContactPhone: bookingForm.ContactInfo.PhoneNumber ?? '',
          ContactEmail: bookingForm.ContactInfo.Email ?? '',
          ContactAddress: bookingForm.ContactInfo.Address ?? '',
          ContactRemark: bookingForm.ContactInfo.Note ?? '',
          PaymentMethod: '',
          PaymentGateway: '',
          PaymentExpiry: dayjs().add(9, 'h').toString(),
          PaymentDate: null,
          PaymentStatus: 'unpaid',
          FlightBooking: 'VN:5OCE35',
          FlightSystem: 'VN',
          FlightInfo: 'VN-HANSGN-22/07/2024',
          FlightType: 'domestic',
          PaxName: 'HAI NGO',
          PaxSumm: '1 ADT',
          TotalPrice: price,
          NetPrice: price,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          PaidAmt: 0,
          PaidCur: null,
          Language: 'vi',
          IPAddress: '192.168.68.62',
          Checked: false,
          Locked: false,
          Message: null,
          Visible: true,
          Bookings: [booking],
          Charges: [
            {
              Id: 32400,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: '61E58773-65BD-4F06-98E9-482BD338C365',
              BookingId: 'BB4BE6C2-3D4E-4ADA-B3BB-2F11A3079BDD',
              PassengerId: '7FBA0F43-63E5-41B5-816C-0F71CE1459FD',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 1639000,
              Currency: 'VND',
              ChargeType: 'TICKET_FARE',
              ChargeValue: 'NPXVNF',
              PaxName: 'HAI NGO',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32401,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: '61E58773-65BD-4F06-98E9-482BD338C365',
              BookingId: 'BB4BE6C2-3D4E-4ADA-B3BB-2F11A3079BDD',
              PassengerId: '7FBA0F43-63E5-41B5-816C-0F71CE1459FD',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 701000,
              Currency: 'VND',
              ChargeType: 'TICKET_TAX',
              ChargeValue: null,
              PaxName: 'HAI NGO',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32402,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: '61E58773-65BD-4F06-98E9-482BD338C365',
              BookingId: 'BB4BE6C2-3D4E-4ADA-B3BB-2F11A3079BDD',
              PassengerId: '7FBA0F43-63E5-41B5-816C-0F71CE1459FD',
              AncillaryId: null,
              PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
              TicketId: null,
              Amount: 100000,
              Currency: 'VND',
              ChargeType: 'SERVICE_FEE',
              ChargeValue: null,
              PaxName: 'HAI NGO',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              IsPolicy: true,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
          ],
          Invoices: [],
          Remarks: [],
          Tickets: [],
        },
        StatusCode: '000',
        Success: true,
        Expired: false,
        Message: null,
        Language: 'vi',
        CustomProperties: null,
      },
    };
  } catch (error) {
    console.log('🚀 ~ fakeOrderDetail ~ error:', error);
  }
}
