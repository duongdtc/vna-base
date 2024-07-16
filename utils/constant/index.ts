import { IconTypes } from '@assets/icon';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { FareCodeDetail } from '@redux/type';
import {
  BookingStatusDetail,
  GenderTypeDetail,
  PassengerTypeDetail,
} from '@vna-base/screens/booking-detail/type';
import {
  FareFilter,
  OptionFlightEnum,
  OptionSearch,
  SeatClassEnum,
  SubmitOption,
  SystemDetail,
} from '@vna-base/screens/flight/type';
import { OrderStatusDetail } from '@vna-base/screens/order/type';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { WindowWidth } from '@vna-base/utils/scale';
import { StyleSheet } from 'react-native';

const HairlineWidth = Math.min(StyleSheet.hairlineWidth, 0.333);

export type TypeDetail<T> = {
  key: T;
  t18n: I18nKeys;
};

enum FareType {
  PUBLIC_FARE = 'PUBLIC_FARE',
  NEGOTIATION = 'NEGOTIATION',
}
const FareTypeDetails: Record<FareType, TypeDetail<FareType>> = {
  [FareType.PUBLIC_FARE]: {
    key: FareType.PUBLIC_FARE,
    t18n: 'Public Fare' as I18nKeys,
  },
  [FareType.NEGOTIATION]: {
    key: FareType.NEGOTIATION,
    t18n: 'Negotiation/ Private Fare' as I18nKeys,
  },
};

const ActiveOpacity = 0.8;
const MinScaleButton = 0.96;
const HitSlop = {
  Large: 16,
  LargeInset: { top: 16, bottom: 16, left: 16, right: 16 },
  Medium: 8,
  MediumInset: { top: 8, bottom: 8, left: 8, right: 8 },
  Small: 4,
  SmallInset: { top: 4, bottom: 4, left: 4, right: 4 },
};
const DisableOpacity = 0.4;
const MaxStageSearch = 4;

const ModalWidth = WindowWidth - 48;
const ModalMinWidth = 342;
const ModalPaddingHorizontal = 24;

enum ObjectField {
  Footer = 'Footer',
  Header = 'Header',
  Remark = 'Remark',
}

enum SnapPoint {
  Full = '95%',
  Half = '70%',
  '65%' = '65%',
  '60%' = '60%',
  '50%' = '50%',
  '40%' = '40%',
  '30%' = '30%',
  '20%' = '20%',
}

const NameSys = 'Datacom \n System Management';

enum System {
  VN = 'VN',
  VJ = 'VJ',
  VU = 'VU',
  QH = 'QH',
  '1G' = '1G',
  '1A' = '1A',
  '1B' = '1B',
  FO = 'FO',
  TR = 'TR',
  JQ = 'JQ',
  AK = 'AK',
}

const SystemDetails: Record<System, SystemDetail> = {
  [System.VN]: {
    key: System.VN,
    t18n: 'common:vn',
    priority: 10,
    colorTheme: 'VN',
    domestic: true,
  },
  [System.VJ]: {
    key: System.VJ,
    t18n: 'common:vj',
    priority: 9,
    colorTheme: 'VJ',
    domestic: true,
  },
  [System.VU]: {
    key: System.VU,
    t18n: 'common:vu',
    priority: 8,
    colorTheme: 'VU',
    domestic: true,
  },
  [System.QH]: {
    key: System.QH,
    t18n: 'common:qh',
    priority: 7,
    colorTheme: 'QH',
    domestic: true,
  },
  [System['1G']]: {
    key: System['1G'],
    t18n: 'common:1g',
    priority: 6,
    colorTheme: '1G',
  },
  [System['1A']]: {
    key: System['1A'],
    t18n: 'common:1a',
    priority: 5,
    colorTheme: '1A',
  },
  [System['1B']]: {
    key: System['1B'],
    t18n: 'common:1b',
    priority: 4,
    colorTheme: '1B',
  },
  [System.FO]: {
    key: System.FO,
    t18n: 'common:fo',
    priority: 3,
    colorTheme: 'FO',
  },
  [System.TR]: {
    key: System.TR,
    t18n: 'common:tr',
    priority: 2,
    colorTheme: 'FO',
  },
  [System.JQ]: {
    key: System.JQ,
    t18n: 'common:jq',
    priority: 1,
    colorTheme: 'price',
  },
  [System.AK]: {
    key: System.AK,
    t18n: 'common:ak',
    priority: 0,
    colorTheme: '1B',
  },
};

const ListFlightOptions: Array<OptionSearch> = [
  {
    t18n: 'flight:fly_straight',
    icon: 'navigation_2_fill',
    key: OptionFlightEnum.STRAIGHT,
  },
  {
    t18n: 'flight:nearby_airport',
    icon: 'share_fill',
    key: OptionFlightEnum.NEARBY,
  },
];

const ListSeatClass: Array<OptionData<SeatClassEnum>> = [
  {
    t18n: 'common:all',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    key: null,
  },
  {
    t18n: 'flight:general',
    key: SeatClassEnum.ECONOMY,
  },
  {
    t18n: 'flight:merchant',
    key: SeatClassEnum.BUSINESS,
  },
  {
    t18n: 'flight:first_class',
    key: SeatClassEnum.FIRST,
  },
];

const ListFareFilter: Array<{
  key: keyof FareFilter;
  t18n: I18nKeys;
}> = [
  {
    key: 'TotalFare',
    t18n: 'flight:total_fare_for_all_passenger',
  },
  {
    key: 'BaseFare',
    t18n: 'flight:basic_one_adult',
  },
  {
    key: 'PriceAdt',
    t18n: 'flight:tax_one_adult',
  },
];

const ListFieldSort: Array<{
  key: 'Fare' | 'DepartDate' | 'ArriveDate' | 'Airline';
  t18n: I18nKeys;
  icon: IconTypes;
}> = [
  {
    key: 'Airline',
    t18n: 'flight:airline',
    icon: 'tail_fill',
  },
  {
    key: 'DepartDate',
    t18n: 'flight:departure_time',
    icon: 'plane_up_fill',
  },
  {
    key: 'ArriveDate',
    t18n: 'flight:arrive_time',
    icon: 'plane_down_fill',
  },
  {
    key: 'Fare',
    t18n: 'flight:fare',
    icon: 'pantone_fill',
  },
];

enum FeaturesEnum {
  QuickServiceFee = 'QuickServiceFee',
  DownloadQuote = 'DownloadQuote',
}

const ListFeature: Array<OptionData> = [
  {
    key: FeaturesEnum.QuickServiceFee,
    t18n: 'flight:quick_service_fee',
    icon: 'edit_2_fill',
  },
  {
    key: FeaturesEnum.DownloadQuote,
    t18n: 'flight:download_quote',
    icon: 'pricetag_fill',
  },
];

enum ListOptionDownloadQuoteEnum {
  Text = 'Text',
  Image = 'Image',
}

const ListOptionDownloadQuote: Array<OptionData> = [
  {
    key: ListOptionDownloadQuoteEnum.Text,
    t18n: 'flight:download_quote_text',
    icon: 'text_fill',
  },
  {
    key: ListOptionDownloadQuoteEnum.Image,
    t18n: 'flight:download_quote_image',
    icon: 'image_fill',
  },
];

enum Gender {
  Female,
  Male,
}

const GenderTypeDetails: Record<Gender, GenderTypeDetail> = {
  [Gender.Female]: {
    key: Gender.Female,
    t18n: 'input_info_passenger:female',
  },
  [Gender.Male]: {
    key: Gender.Male,
    t18n: 'input_info_passenger:male',
  },
};

enum PassengerType {
  'ADT' = 'ADT',
  'CHD' = 'CHD',
  'INF' = 'INF',
}

const PassengerTypeDetails: Record<PassengerType, PassengerTypeDetail> = {
  ADT: {
    key: PassengerType.ADT,
    t18n: 'flight:adult',
  },
  CHD: {
    key: PassengerType.CHD,
    t18n: 'flight:children',
  },
  INF: {
    key: PassengerType.INF,
    t18n: 'flight:infant',
  },
};

enum BookFlight {
  KeepSeat,
  IssueTicket,
}

const MaxLengthFullName = 100;
const MaxLengthAddress = 100;

const SubmitOptions: Array<{
  key: keyof SubmitOption;
  t18n: I18nKeys;
}> = [
  {
    key: 'OrderAndTicketIssuance',
    t18n: 'input_info_passenger:order_and_ticket_issuance',
  },
  {
    key: 'BookEachLegSeparately',
    t18n: 'input_info_passenger:book_each_leg_separately',
  },
  {
    key: 'AutomaticallyFetchTheLowestPrice',
    t18n: 'input_info_passenger:automatically_fetch_the_lowest_price',
  },
  {
    key: 'AutomaticallyIssueTicketsUponExpiration',
    t18n: 'input_info_passenger:automatically_issue_tickets_upon_expiration',
  },
  {
    key: 'ReceivePriceFluctuationNotifications',
    t18n: 'input_info_passenger:receive_price_fluctuation_notifications',
  },
];

const typeGenderMale = ['mr', 'mstr'];

const typeGenderFemale = ['ms', 'mss', 'mrs', 'miss'];

const typePassengerWithGender: {
  key: number;
  des_t18n: I18nKeys | undefined;
  t18n: I18nKeys | undefined;
  subData: {
    key: number;
    t18n: I18nKeys | undefined;
  }[];
}[] = [
  {
    key: 1,
    t18n: 'input_info_passenger:type_passenger_with_gender',
    des_t18n: undefined,
    subData: [
      { key: 1, t18n: 'input_info_passenger:mr' },
      { key: 2, t18n: 'input_info_passenger:ms' },
      { key: 3, t18n: 'input_info_passenger:mstr' },
      { key: 4, t18n: 'input_info_passenger:miss' },
    ],
  },
  {
    key: 2,
    t18n: 'input_info_passenger:define_dob',
    des_t18n: 'input_info_passenger:des_define_dob',
    subData: [],
  },
  {
    key: 3,
    t18n: 'input_info_passenger:example',
    des_t18n: 'input_info_passenger:des_example',
    subData: [],
  },
];

const HourSlot = [
  ['00:00', '05:59'],
  ['06:00', '11:59'],
  ['12:00', '17:59'],
  ['18:00', '23:59'],
];

enum OrderStatus {
  NEW = 'NEW',
  DOING = 'DOING',
  PAID = 'PAID',
  DONE = 'DONE',
  CLOSED = 'CLOSED',
}

enum BookingStatus {
  OK = 'OK',
  FAIL = 'FAIL',
  TICKETED = 'TICKETED',
  CANCELED = 'CANCELED',
  PROCESSING = 'PROCESSING',
  WL = 'WL',
}

const BookingStatusDetails: Record<BookingStatus, BookingStatusDetail> = {
  OK: {
    t18n: 'booking:booking_ok',
    key: BookingStatus.OK,
    icon: 'checkmark_circle_fill',
    iconColorTheme: 'success500',
  },
  FAIL: {
    t18n: 'booking:booking_failed',
    key: BookingStatus.FAIL,
    icon: 'alert_triangle_fill',
    iconColorTheme: 'warning500',
  },
  TICKETED: {
    t18n: 'booking:booking_ticketed',
    key: BookingStatus.TICKETED,
    icon: 'ticket_double_fill',
    iconColorTheme: 'info500',
  },
  CANCELED: {
    t18n: 'booking:booking_canceled',
    key: BookingStatus.CANCELED,
    icon: 'close_circle_fill',
    iconColorTheme: 'error500',
  },
  PROCESSING: {
    t18n: 'booking:booking_processing',
    key: BookingStatus.PROCESSING,
    icon: 'clock_fill',
    iconColorTheme: 'info500',
  },
  WL: {
    t18n: 'booking:booking_waiting',
    key: BookingStatus.WL,
    icon: 'layers_fill',
    iconColorTheme: 'neutral500',
  },
};

const OrderStatusDetails: Record<OrderStatus, OrderStatusDetail> = {
  [OrderStatus.NEW]: {
    t18n: 'order:new_order',
    key: OrderStatus.NEW,
    icon: 'flash_fill',
    iconColorTheme: 'info500',
    colorTheme: 'info50',
  },
  [OrderStatus.DOING]: {
    t18n: 'order:processing',
    key: OrderStatus.DOING,
    icon: 'alert_circle_fill',
    iconColorTheme: 'warning500',
    colorTheme: 'warning50',
  },
  [OrderStatus.PAID]: {
    t18n: 'order:paid',
    key: OrderStatus.PAID,
    icon: 'credit_card_fill',
    iconColorTheme: 'primary500',
    colorTheme: 'primary50',
  },
  [OrderStatus.DONE]: {
    t18n: 'order:completed',
    key: OrderStatus.DONE,
    icon: 'checkmark_circle_fill',
    iconColorTheme: 'success500',
    colorTheme: 'success50',
  },
  [OrderStatus.CLOSED]: {
    t18n: 'order:closed',
    key: OrderStatus.CLOSED,
    icon: 'close_fill',
    iconColorTheme: 'error500',
    colorTheme: 'error50',
  },
};

enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  DEBT = 'debt',
}

export type PaymentStatusDetail = {
  t18n: I18nKeys;
  key: PaymentStatus;
  icon: IconTypes;
  iconColorTheme: keyof Colors;
};

const PaymentStatusDetails: Record<PaymentStatus, PaymentStatusDetail> = {
  [PaymentStatus.UNPAID]: {
    t18n: 'common:unpaid',
    key: PaymentStatus.UNPAID,
    icon: 'alert_circle_fill',
    iconColorTheme: 'error500',
  },
  [PaymentStatus.DEBT]: {
    t18n: 'common:debt',
    key: PaymentStatus.DEBT,
    icon: 'clock_fill',
    iconColorTheme: 'warning500',
  },
  [PaymentStatus.PAID]: {
    t18n: 'common:paid',
    key: PaymentStatus.PAID,
    icon: 'checkmark_circle_fill',
    iconColorTheme: 'success500',
  },
};

enum PaymentMethod {}

export type PaymentMethodDetail = {
  t18n: I18nKeys;
  key: PaymentMethod;
  icon: IconTypes;
  iconColorTheme: keyof Colors;
};

const PaymentMethodDetails: Record<PaymentMethod, PaymentMethodDetail> = {};

enum Pronoun {
  MR = 'MR',
  MRS = 'MRS',
  MS = 'MS',
}

export type PronounDetail = {
  t18n: I18nKeys;
  key: Pronoun;
};

const PronounDetails: Record<Pronoun, PronounDetail> = {
  [Pronoun.MR]: {
    key: Pronoun.MR,
    t18n: 'order_detail:mr',
  },
  [Pronoun.MRS]: {
    key: Pronoun.MRS,
    t18n: 'order_detail:mrs',
  },
  [Pronoun.MS]: {
    key: Pronoun.MS,
    t18n: 'order_detail:ms',
  },
};

const PAGE_SIZE_BOOKING = 15;
const PAGE_SIZE_ORDER = 15;
const PAGE_SIZE_AGENT = 10;
const PAGE_SIZE_USER_GROUP = 20;
const PAGE_SIZE_USER_ACCOUNT = 10;
const PAGE_SIZE_DBS_CONTENT = 10;
const PAGE_SIZE_TRANSACTION_HISTORY = 10;

enum FareCode {
  TICKET_FARE = 'TICKET_FARE',
  TICKET_VAT = 'TICKET_VAT',
  TICKET_TAX = 'TICKET_TAX',
  SERVICE_FEE = 'SERVICE_FEE',
  DISCOUNT = 'DISCOUNT',
  ANCILLARY_FEE = 'ANCILLARY_FEE',
  PRESEAT_FEE = 'PRESEAT_FEE',
  BAGGAGE_FEE = 'BAGGAGE_FEE',
  TICKET_FEE = 'TICKET_FEE',
  ISSUE_FEE = 'ISSUE_FEE',
  MARKUP_FEE = 'MARKUP_FEE',
}

const FareCodeDetails: Record<FareCode, FareCodeDetail> = {
  ANCILLARY_FEE: {
    Code: FareCode.ANCILLARY_FEE,
    Name: 'Ancillary Fee',
  },
  BAGGAGE_FEE: {
    Code: FareCode.BAGGAGE_FEE,
    Name: 'Baggage Fee',
  },
  DISCOUNT: {
    Code: FareCode.DISCOUNT,
    Name: 'Discount Fee',
    canAddInFeeModal: true,
    t18n: 'common:discount',
  },
  ISSUE_FEE: {
    Code: FareCode.ISSUE_FEE,
    Name: 'Issue Fee',
  },
  MARKUP_FEE: {
    Code: FareCode.MARKUP_FEE,
    Name: 'Markup Fee',
  },
  PRESEAT_FEE: {
    Code: FareCode.PRESEAT_FEE,
    Name: 'Preseat Fee',
  },
  SERVICE_FEE: {
    Code: FareCode.SERVICE_FEE,
    Name: 'Service Fee',
    canAddInFeeModal: true,
    t18n: 'common:service_fee',
  },
  TICKET_FARE: {
    Code: FareCode.TICKET_FARE,
    Name: 'Ticket Fare',
    isLock: true,
  },
  TICKET_FEE: {
    Code: FareCode.TICKET_FEE,
    Name: 'Ticket Fee',
    isLock: true,
  },
  TICKET_TAX: {
    Code: FareCode.TICKET_TAX,
    Name: 'Ticket Tax',
    isLock: true,
  },
  TICKET_VAT: {
    Code: FareCode.TICKET_VAT,
    Name: 'Ticket VAT',
    isLock: true,
  },
};

const OptionPassengersInFeeModal: Array<any> = [
  {
    key: null,
    t18n: 'order_detail:all',
    description: 'ALL',
  },
  {
    key: 'ALL',
    t18n: 'order_detail:apply_per_passenger',
    description: 'PAX',
  },
];

const OptionRoutesInFeeModal: Array<any> = [
  {
    key: null,
    t18n: 'order_detail:all',
  },
];

enum Currency {
  VND = 'VND',
  USD = 'USD',
}
export type CurrencyDetail = {
  key: Currency;
  t18n: I18nKeys;
  symbol: I18nKeys;
};

const CurrencyDetails: Record<Currency, CurrencyDetail> = {
  [Currency.VND]: {
    key: Currency.VND,
    t18n: 'VND' as I18nKeys,
    symbol: 'VND' as I18nKeys,
  },
  [Currency.USD]: {
    key: Currency.USD,
    t18n: 'USD' as I18nKeys,
    symbol: 'USD' as I18nKeys,
  },
};

enum TicketMimeType {
  PDF = 'pdf',
  JPG = 'jpg',
  HTML = 'html',
}
export type TicketMimeTypeDetail = {
  key: TicketMimeType;
  t18n: I18nKeys;
};

const TicketMimeTypeDetails: Record<TicketMimeType, TicketMimeTypeDetail> = {
  [TicketMimeType.PDF]: {
    key: TicketMimeType.PDF,
    t18n: 'common:pdf_type',
  },
  [TicketMimeType.JPG]: {
    key: TicketMimeType.JPG,
    t18n: 'common:jpg_type',
  },
  [TicketMimeType.HTML]: {
    key: TicketMimeType.HTML,
    t18n: 'common:html_type',
  },
};

enum EmailType {
  ORDER_INFO = 'OrderInfo',
  ORDER_PAID = 'OrderPaid',
  ORDER_CONFIRM = 'OrderConfirm',
  ORDER_CANCEL = 'OrderCancel',
}

export type EmailTypeDetail = {
  key: EmailType;
  t18n: I18nKeys;
  icon: IconTypes;
  iconColorTheme: keyof Colors;
};

const EmailTypeDetails: Record<EmailType, EmailTypeDetail> = {
  [EmailType.ORDER_INFO]: {
    key: EmailType.ORDER_INFO,
    t18n: 'common:order_info',
    icon: 'alert_circle_fill',
    iconColorTheme: 'info500',
  },
  [EmailType.ORDER_PAID]: {
    key: EmailType.ORDER_PAID,
    t18n: 'common:order_paid',
    icon: 'checkmark_circle_fill',
    iconColorTheme: 'success500',
  },
  [EmailType.ORDER_CONFIRM]: {
    key: EmailType.ORDER_CONFIRM,
    t18n: 'common:order_confirm',
    icon: 'ticket_fill',
    iconColorTheme: 'primary500',
  },
  [EmailType.ORDER_CANCEL]: {
    key: EmailType.ORDER_CANCEL,
    t18n: 'common:order_cancel',
    icon: 'close_circle_fill',
    iconColorTheme: 'error500',
  },
};

enum MailServer {
  GOOGLE = 'GOOGLE',
  OUTLOOK = 'OUTLOOK',
  YAHOO = 'YAHOO',
  OTHER = 'OTHER',
}

export type MailServerDetail = {
  key: MailServer;
  t18n: I18nKeys;
  host?: string;
  port?: number;
  ssl?: boolean;
};

const MailServerDetails: Record<MailServer, MailServerDetail> = {
  [MailServer.GOOGLE]: {
    key: MailServer.GOOGLE,
    t18n: 'config_email:google',
    host: 'smtp.gmail.com',
    port: 587,
    ssl: true,
  },
  [MailServer.OUTLOOK]: {
    key: MailServer.OUTLOOK,
    t18n: 'config_email:outlook',
    host: 'smtp.live.com',
    port: 465,
    ssl: true,
  },
  [MailServer.YAHOO]: {
    key: MailServer.YAHOO,
    t18n: 'config_email:yahoo',
    host: 'smtp.mail.yahoo.com',
    port: 465,
    ssl: true,
  },
  [MailServer.OTHER]: {
    key: MailServer.OTHER,
    t18n: 'config_email:other',
  },
};

enum TypeOfTrip {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
}

export type TypeOfTripDetail = {
  t18n: I18nKeys;
  key?: TypeOfTrip;
};

const TypeOfTripDetails: Record<TypeOfTrip, TypeOfTripDetail> = {
  [TypeOfTrip.DOMESTIC]: {
    t18n: 'common:domestic',
    key: TypeOfTrip.DOMESTIC,
  },
  [TypeOfTrip.INTERNATIONAL]: {
    t18n: 'common:international',
    key: TypeOfTrip.INTERNATIONAL,
  },
};

enum ObjectHistoryTypes {
  AGENT = 'Agent',
  BOOKING = 'Booking',
  ORDER = 'Order',
  CONFIG_EMAIL = 'ConfigEmail',
  USER_ACCOUNT = 'UserAccount',
  CONFIG_TICKET = 'ConfigTicket',
}

/**
 * Ngôn ngữ dùng trong hệ thống dbs ví dụ ngôn ngữ hiển thị trong email hoặc ticket
 */
enum LanguageSystem {
  VI = 'vi',
  EN = 'en',
  JP = 'jp',
  KR = 'kr',
  CN = 'cn',
}
/**
 * Ngôn ngữ dùng trong gửi email thao tác bôking
 */
enum LanguageEmailBooking {
  VI = 'vi',
  EN = 'en',
}

export type LanguageSystemDetail = {
  key: LanguageSystem;
  t18n: I18nKeys;
};

const LanguageSystemDetails: Record<LanguageSystem, LanguageSystemDetail> = {
  [LanguageSystem.VI]: {
    key: LanguageSystem.VI,
    t18n: 'common:vi',
  },
  [LanguageSystem.EN]: {
    key: LanguageSystem.EN,
    t18n: 'common:en',
  },
  [LanguageSystem.JP]: {
    key: LanguageSystem.JP,
    t18n: 'common:jp',
  },
  [LanguageSystem.KR]: {
    key: LanguageSystem.KR,
    t18n: 'common:kr',
  },
  [LanguageSystem.CN]: {
    key: LanguageSystem.CN,
    t18n: 'common:cn',
  },
};

enum TopupMethod {
  // Chuyển khoản tự động
  BANK = 'BANK',
  // tiền mặt
  CASH = 'CASH',
  // côrng thanh toán
  GATE = 'GATE',
  // Chuyển khoản thủ công
  MANUAL = 'MANUAL',
  // KHasc
  OTHER = 'OTHER',
}

export type TopupMethodDetail = {
  key: TopupMethod;
  t18n: I18nKeys;
};

const TopupMethodDetails: Record<TopupMethod, TopupMethodDetail> = {
  [TopupMethod.BANK]: {
    key: TopupMethod.BANK,
    t18n: 'transaction_history:bank',
  },
  [TopupMethod.CASH]: {
    key: TopupMethod.CASH,
    t18n: 'transaction_history:cash',
  },
  [TopupMethod.GATE]: {
    key: TopupMethod.GATE,
    t18n: 'transaction_history:gate',
  },
  [TopupMethod.MANUAL]: {
    key: TopupMethod.MANUAL,
    t18n: 'transaction_history:cash',
  },
  [TopupMethod.OTHER]: {
    key: TopupMethod.OTHER,
    t18n: 'common:other',
  },
};

export type TicketType = 'OPEN' | 'EMD' | 'VOID' | 'EXCH' | 'RFND' | 'USED';

const TicketType: Record<TicketType, TicketType> = {
  OPEN: 'OPEN',
  EMD: 'EMD',
  VOID: 'VOID',
  EXCH: 'EXCH',
  RFND: 'RFND',
  USED: 'USED',
};

export type TicketTypeDetail = {
  key: TicketType;
  t18n: I18nKeys;
  colorTheme: keyof Colors;
  bgColorTheme: keyof Colors;
};

const TicketTypeDetails: Record<TicketType, TicketTypeDetail> = {
  OPEN: {
    key: 'OPEN',
    t18n: 'OPEN' as I18nKeys,
    colorTheme: 'success500',
    bgColorTheme: 'success50',
  },
  VOID: {
    key: 'VOID',
    t18n: 'VOID' as I18nKeys,
    colorTheme: 'neutral500',
    bgColorTheme: 'neutral50',
  },
  RFND: {
    key: 'RFND',
    t18n: 'RFND' as I18nKeys,
    colorTheme: 'error500',
    bgColorTheme: 'error50',
  },
  EXCH: {
    key: 'EXCH',
    t18n: 'EXCH' as I18nKeys,
    colorTheme: 'info500',
    bgColorTheme: 'info50',
  },
  USED: {
    key: 'USED',
    t18n: 'USED' as I18nKeys,
    colorTheme: 'secondary500',
    bgColorTheme: 'secondary50',
  },
  EMD: {
    key: 'EMD',
    t18n: 'EMD' as I18nKeys,
    colorTheme: 'warning500',
    bgColorTheme: 'warning50',
  },
};

enum TicketTypePayment {
  OPEN = 'OPEN',
  EMD = 'EMD',

  OTHER = 'OTHER',
}

export type TicketTypePaymentDetail = {
  key: TicketTypePayment;
  t18n: I18nKeys;
};

const TicketTypePaymentDetails: Record<
  TicketTypePayment,
  TicketTypePaymentDetail
> = {
  [TicketTypePayment.OPEN]: {
    key: TicketTypePayment.OPEN,
    t18n: 'common:ticket',
  },
  [TicketTypePayment.EMD]: {
    key: TicketTypePayment.EMD,
    t18n: 'EMD' as I18nKeys,
  },
  [TicketTypePayment.OTHER]: {
    key: TicketTypePayment.OTHER,
    t18n: 'common:other',
  },
};

export type TicketStatus =
  | 'OPEN'
  | 'EMD'
  | 'VOID'
  | 'EXCHANGE'
  | 'REFUND'
  | 'USED';

const TicketStatus: Record<TicketStatus, TicketStatus> = {
  OPEN: 'OPEN',
  EMD: 'EMD',
  VOID: 'VOID',
  EXCHANGE: 'EXCHANGE',
  REFUND: 'REFUND',
  USED: 'USED',
};

export type TicketStatusDetail = {
  key: TicketStatus;
  t18n: I18nKeys;
  colorTheme: keyof Colors;
};

const TicketStatusDetails: Record<TicketStatus, TicketStatusDetail> = {
  OPEN: {
    key: 'OPEN',
    t18n: 'OPEN' as I18nKeys,
    colorTheme: 'success50',
  },
  VOID: {
    key: 'VOID',
    t18n: 'VOID' as I18nKeys,
    colorTheme: 'neutral50',
  },
  REFUND: {
    key: 'REFUND',
    t18n: 'REFUND' as I18nKeys,
    colorTheme: 'error50',
  },
  EXCHANGE: {
    key: 'EXCHANGE',
    t18n: 'EXCHANGE' as I18nKeys,
    colorTheme: 'info50',
  },
  USED: {
    key: 'USED',
    t18n: 'USED' as I18nKeys,
    colorTheme: 'secondary50',
  },
  EMD: {
    key: 'EMD',
    t18n: 'EMD' as I18nKeys,
    colorTheme: 'warning50',
  },
};

enum GetFlightReportMode {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
}

enum ServiceFeeFormula {
  ADD_DIRECTLY = 0,
  PERCENTAGE_ABOVE_BASE_PRICE = 1,
  PERCENT_OF_TOTAL_PRICE = 2,
}

export type ServiceFeeFormulaDetail = {
  key: ServiceFeeFormula;
  t18n: I18nKeys;
};

const ServiceFeeFormulaDetails: Record<
  ServiceFeeFormula,
  ServiceFeeFormulaDetail
> = {
  [ServiceFeeFormula.ADD_DIRECTLY]: {
    key: ServiceFeeFormula.ADD_DIRECTLY,
    t18n: 'policy:add_directly',
  },
  [ServiceFeeFormula.PERCENTAGE_ABOVE_BASE_PRICE]: {
    key: ServiceFeeFormula.PERCENTAGE_ABOVE_BASE_PRICE,
    t18n: 'policy:percentage_above_base_price',
  },
  [ServiceFeeFormula.PERCENT_OF_TOTAL_PRICE]: {
    key: ServiceFeeFormula.PERCENT_OF_TOTAL_PRICE,
    t18n: 'policy:percent_of_total_price',
  },
};

// --- dùng cho chính sách nổi bật ở màn home---
export const ItemWidth = WindowWidth * 0.8;
export const SeparatorWidth = 16;

// là phần mà khi vuốt item flatlist theo paging interval thì dừng lại ở điểm có thể
//  nhìn thấy item đó và 1 phần của item sau nó
export const SnapInterval = SeparatorWidth + ItemWidth;

// ---------------------------------------------

const TEMPLATE_E_TICKET = {
  Temp1: 'Temp1',
  Temp2: 'Temp2',
};

const TEMPLATE_EMAIL = {
  Temp1: 'Temp1',
  Temp2: 'Temp2',
};

const WIDTH_OF_PRINTER_PAGE = 576;

export type CheckInOnlineSystem = System.VN | System.VJ | System.QH | System.VU;

const CHECK_IN_ONLINE_URL: Record<CheckInOnlineSystem, string> = {
  [System.VN]:
    'https://www.vietnamairlines.com/vn/vi/buy-tickets-other-products/booking-and-manage-bookings/check-in',
  [System.VJ]: 'https://www.vietjetair.com/vi/checkin',
  [System.QH]:
    'https://bambooairways.com/vn/vi/travel-info/check-in/online-check-in',
  [System.VU]: 'https://booking.vietravelairlines.com/vi/checkin',
};

const ANCILLARY_TYPE = {
  BAGGAGE: 'BAGGAGE',
  PRESEAT: 'PRESEAT',
  OTHER: 'OTHER',
};

enum PassengerSearchType {
  VISIT_FAMILY = 'VISIT_FAMILY',
  STUDENT = 'STUDENT',
  LABOR = 'LABOR',
  SEA_MAN = 'SEA_MAN',
  EMIGRANT = 'EMIGRANT',
  SENIOR_CITIZEN = 'SENIOR_CITIZEN',
  YOUTH = 'YOUTH',
}

const PassengerSearchTypeDetails: Record<
  PassengerSearchType,
  TypeDetail<PassengerSearchType>
> = {
  [PassengerSearchType.VISIT_FAMILY]: {
    key: PassengerSearchType.VISIT_FAMILY,
    t18n: 'Visit Family and Relation' as I18nKeys,
  },
  [PassengerSearchType.STUDENT]: {
    key: PassengerSearchType.STUDENT,
    t18n: 'Student' as I18nKeys,
  },
  [PassengerSearchType.LABOR]: {
    key: PassengerSearchType.LABOR,
    t18n: 'Labor' as I18nKeys,
  },
  [PassengerSearchType.SEA_MAN]: {
    key: PassengerSearchType.SEA_MAN,
    t18n: 'Seaman' as I18nKeys,
  },
  [PassengerSearchType.EMIGRANT]: {
    key: PassengerSearchType.EMIGRANT,
    t18n: 'Emigrant' as I18nKeys,
  },
  [PassengerSearchType.SENIOR_CITIZEN]: {
    key: PassengerSearchType.SENIOR_CITIZEN,
    t18n: 'Senior Citizen' as I18nKeys,
  },
  [PassengerSearchType.YOUTH]: {
    key: PassengerSearchType.YOUTH,
    t18n: 'Youth' as I18nKeys,
  },
};

export const SeatClassDetails: Record<
  SeatClassEnum,
  TypeDetail<SeatClassEnum>
> = {
  [SeatClassEnum.ECONOMY]: {
    t18n: 'flight:general',
    key: SeatClassEnum.ECONOMY,
  },
  [SeatClassEnum.BUSINESS]: {
    t18n: 'flight:merchant',
    key: SeatClassEnum.BUSINESS,
  },
  [SeatClassEnum.FIRST]: {
    t18n: 'flight:first_class',
    key: SeatClassEnum.FIRST,
  },
};
export const FlightOptionDetails: Record<
  OptionFlightEnum,
  TypeDetail<OptionFlightEnum>
> = {
  [OptionFlightEnum.STRAIGHT]: {
    t18n: 'flight:fly_straight',
    key: OptionFlightEnum.STRAIGHT,
  },
  [OptionFlightEnum.NEARBY]: {
    t18n: 'flight:nearby_airport',
    key: OptionFlightEnum.NEARBY,
  },
};

export {
  ActiveOpacity,
  NameSys,
  System,
  DisableOpacity,
  MaxStageSearch,
  SnapPoint,
  Gender,
  GenderTypeDetails,
  PassengerType,
  PassengerTypeDetails,
  SystemDetails,
  ListFlightOptions,
  ListSeatClass,
  ListFareFilter,
  ListFieldSort,
  MaxLengthFullName,
  MaxLengthAddress,
  SubmitOptions,
  HitSlop,
  typeGenderMale,
  typeGenderFemale,
  typePassengerWithGender,
  HourSlot,
  BookFlight,
  ListFeature,
  ListOptionDownloadQuote,
  BookingStatusDetails,
  PAGE_SIZE_BOOKING,
  PAGE_SIZE_ORDER,
  PAGE_SIZE_AGENT,
  PAGE_SIZE_USER_GROUP,
  PAGE_SIZE_USER_ACCOUNT,
  PAGE_SIZE_DBS_CONTENT,
  PAGE_SIZE_TRANSACTION_HISTORY,
  FareCode,
  OptionPassengersInFeeModal,
  OptionRoutesInFeeModal,
  TypeOfTripDetails,
  TypeOfTrip,
  FareCodeDetails,
  FeaturesEnum,
  ListOptionDownloadQuoteEnum,
  BookingStatus,
  OrderStatusDetails,
  OrderStatus,
  PaymentStatus,
  PaymentStatusDetails,
  PaymentMethod,
  PaymentMethodDetails,
  EmailType,
  LanguageSystem,
  LanguageSystemDetails,
  CurrencyDetails,
  Currency,
  TicketMimeTypeDetails,
  TicketMimeType,
  EmailTypeDetails,
  MinScaleButton,
  ModalWidth,
  ModalMinWidth,
  ModalPaddingHorizontal,
  ObjectHistoryTypes,
  GetFlightReportMode,
  PronounDetails,
  Pronoun,
  TicketType,
  TicketTypeDetails,
  TicketStatus,
  TicketStatusDetails,
  MailServer,
  MailServerDetails,
  ServiceFeeFormula,
  ServiceFeeFormulaDetails,
  TEMPLATE_E_TICKET,
  ObjectField,
  WIDTH_OF_PRINTER_PAGE,
  TEMPLATE_EMAIL,
  LanguageEmailBooking,
  CHECK_IN_ONLINE_URL,
  ANCILLARY_TYPE,
  TopupMethodDetails,
  TopupMethod,
  HairlineWidth,
  TicketTypePayment,
  TicketTypePaymentDetails,
  FareTypeDetails,
  FareType,
  PassengerSearchTypeDetails,
  PassengerSearchType,
};
