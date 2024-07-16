import {
  AdditionalInfoParams,
  BookingFlightDoneScreenParams,
  BookingDetailScreenParams,
  FareRuleParams,
  InfoTicketScreenParams,
  MoreOptionsParams,
  OrderDetailScreenParams,
  PreviewFareReportScreenParams,
  QuickInputScreenParams,
  RegisterNavigationParams,
  ResultSearchFlightParams,
  SelectSeatParam,
  TaxInfoParams,
  AgentDetailScreenParams,
  PersonalInfoScreenParams,
  ActionBookingScreenParams,
  SuccessScreenParams,
  CreditInfoScreenParams,
  PolicyDetailScreenParams,
  DepArrAreaScreenParams,
  DBSContentAllParams,
  DBSContentDetailParams,
  TitleAndRemarkOfTicketScreenParams,
  EditHTMLScreenParams,
  HeaderAndFooterOfEmailScreenParams,
  AddAncillaryScreenParams,
  AddPreSeatScreenParams,
  PermissionDeniedScreenParams,
  TopupDetailParams,
  BookingVersionDetailParams,
} from '@navigation/type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { scale } from '../scale';

export enum APP_SCREEN {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  ONBOARDING = 'ONBOARDING',
  BOTTOM_TAB_NAV = 'BOTTOM_TAB_NAV',
  HOME = 'HOME',
  BOOKING = 'BOOKING',
  REPORT = 'REPORT',
  ORDER = 'ORDER',
  PERSONAL = 'PERSONAL',
  SPECIALIZE_NEWS_ALL = 'SPECIALIZE_NEWS_ALL',
  BANNER_AND_NEWS_DETAIL = 'BANNER_AND_NEWS_DETAIL',
  SEARCH_FLIGHT = 'SEARCH_FLIGHT',
  RESULT_SEARCH_FLIGHT = 'RESULT_SEARCH_FLIGHT',
  RESULT_SEARCH_FLIGHT_BY_MONTH = 'RESULT_SEARCH_FLIGHT_BY_MONTH',
  MORE_OPTIONS_SEARCH_FLIGHT = 'MORE_OPTIONS_SEARCH_FLIGHT',
  FareRuleGet = 'FareRuleGet',
  PASSENGER_DETAIL = 'PASSENGER_DETAIL',
  ADDITIONAL_INFO = 'ADDITIONAL_INFO',
  SELECT_SEAT = 'SELECT_SEAT',
  INFO_TICKET = 'INFO_TICKET',
  TAX_INFO = 'TAX_INFO',
  QUICK_INPUT_SCREEN = 'QUICK_INPUT_SCREEN',
  USER_ACCOUNT = 'USER_ACCOUNT',
  PREVIEW_FARE_REPORT = 'PREVIEW_FARE_REPORT',
  ORDER_DETAIL = 'ORDER_DETAIL',
  BOOKING_FLIGHT_DONE = 'BOOKING_FLIGHT_DONE',
  BOOKING_DETAIL = 'BOOKING_DETAIL',
  BOOKING_VERSION_DETAIL = 'BOOKING_VERSION_DETAIL',
  AGENTS = 'AGENTS',
  AGENT_DETAIL = 'AGENT_DETAIL',
  ADD_NEW_AGENT = 'ADD_NEW_AGENT',
  SEARCH = 'SEARCH',
  EDIT_HTML = 'EDIT_HTML',
  RESET_PASS = 'RESET_PASS',
  AGENT_INFO = 'AGENT_INFO',
  PERSONAL_INFO = 'PERSONAL_INFO',
  BOOKING_ACTION_SUCCESS = 'BOOKING_ACTION_SUCCESS',
  ORDER_EMAIL = 'ORDER_EMAIL',
  FLIGHT_TICKET = 'FLIGHT_TICKET',
  NOT_FOUND = 'NOT_FOUND',
  BookingUpdate = 'BookingUpdate',
  TicketIssue = 'TicketIssue',
  TicketEMD = 'TicketEMD',
  TicketVoid = 'TicketVoid',
  TicketRfnd = 'TicketRfnd',
  BookingRebook = 'BookingRebook',
  BookingCancel = 'BookingCancel',
  EmailSend = 'EmailSend',
  SMSSend = 'SMSSend',
  CREDIT_INFO = 'CREDIT_INFO',
  CONFIG_TICKET = 'CONFIG_TICKET',
  CONFIG_EMAIL = 'CONFIG_EMAIL',
  POLICY = 'POLICY',
  POLICY_DETAIL = 'POLICY_DETAIL',
  DEP_ARR_AREA = 'DEP_ARR_AREA',
  DBS_CONTENT_ALL = 'DBS_CONTENT_ALL',
  DBS_CONTENT_DETAIL = 'DBS_CONTENT_DETAIL',
  TITLE_AND_REMARK_OF_TICKET = 'TITLE_AND_REMARK_OF_TICKET',
  HEADER_AND_FOOTER_OF_EMAIL = 'HEADER_AND_FOOTER_OF_EMAIL',
  PassengerUpdate = 'PassengerUpdate',
  PassengerSplit = 'PassengerSplit',
  PassportUpdate = 'PassportUpdate',
  SeatmapUpdate = 'SeatmapUpdate',
  MemberUpdate = 'MemberUpdate',
  CheckInOnline = 'CheckInOnline',
  FlightChange = 'FlightChange',
  UpdateContact = 'UpdateContact',
  FLIGHT_CHANGE_DETAIL = 'FLIGHT_CHANGE_DETAIL',
  TICKET_CHANGE_DETAIL = 'TICKET_CHANGE_DETAIL',
  AncillaryUpdate = 'AncillaryUpdate',
  ADD_ANCILLARY = 'ADD_ANCILLARY',
  ADD_PRE_SEAT = 'ADD_PRE_SEAT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  TOPUP = 'TOPUP',
  PAY = 'PAY',
  TOPUP_HISTORY = 'TOPUP_HISTORY',
  TOPUP_DETAIL = 'TOPUP_DETAIL',
  PAYMENT_HISTORY = 'PAYMENT_HISTORY',
  BOOKING_PRICING_COMPLETED = 'BOOKING_PRICING_COMPLETED',
  MENU = 'MENU',
}

export type RootStackParamList = {
  [APP_SCREEN.LOGIN]: undefined;
  [APP_SCREEN.SPLASH]: undefined;
  [APP_SCREEN.MENU]: undefined;
  [APP_SCREEN.REGISTER]: RegisterNavigationParams;
  [APP_SCREEN.HOME]: undefined;
  [APP_SCREEN.FORGOT_PASSWORD]: undefined;
  [APP_SCREEN.ONBOARDING]: undefined;
  [APP_SCREEN.BOTTOM_TAB_NAV]: undefined;
  [APP_SCREEN.BOOKING]: undefined;
  [APP_SCREEN.REPORT]: undefined;
  [APP_SCREEN.PERSONAL]: undefined;
  [APP_SCREEN.SEARCH_FLIGHT]: undefined;
  [APP_SCREEN.ORDER]: undefined;
  [APP_SCREEN.RESULT_SEARCH_FLIGHT]: ResultSearchFlightParams;
  [APP_SCREEN.RESULT_SEARCH_FLIGHT_BY_MONTH]: undefined;
  [APP_SCREEN.MORE_OPTIONS_SEARCH_FLIGHT]: MoreOptionsParams;
  [APP_SCREEN.FareRuleGet]: FareRuleParams;
  [APP_SCREEN.PASSENGER_DETAIL]: undefined;
  [APP_SCREEN.ADDITIONAL_INFO]: AdditionalInfoParams;
  [APP_SCREEN.SELECT_SEAT]: SelectSeatParam;
  [APP_SCREEN.INFO_TICKET]: InfoTicketScreenParams;
  [APP_SCREEN.TAX_INFO]: TaxInfoParams;
  [APP_SCREEN.QUICK_INPUT_SCREEN]: QuickInputScreenParams;
  [APP_SCREEN.USER_ACCOUNT]: undefined;
  [APP_SCREEN.PREVIEW_FARE_REPORT]: PreviewFareReportScreenParams;
  [APP_SCREEN.ORDER_DETAIL]: OrderDetailScreenParams;
  [APP_SCREEN.BOOKING_FLIGHT_DONE]: BookingFlightDoneScreenParams;
  [APP_SCREEN.BOOKING_DETAIL]: BookingDetailScreenParams;
  [APP_SCREEN.BOOKING_VERSION_DETAIL]: BookingVersionDetailParams;
  [APP_SCREEN.AGENTS]: undefined;
  [APP_SCREEN.AGENT_DETAIL]: AgentDetailScreenParams;
  [APP_SCREEN.ADD_NEW_AGENT]: undefined;
  [APP_SCREEN.SEARCH]: undefined;
  [APP_SCREEN.EDIT_HTML]: EditHTMLScreenParams;
  [APP_SCREEN.RESET_PASS]: undefined;
  [APP_SCREEN.AGENT_INFO]: undefined;
  [APP_SCREEN.PERSONAL_INFO]: PersonalInfoScreenParams;
  [APP_SCREEN.BOOKING_ACTION_SUCCESS]: SuccessScreenParams;
  [APP_SCREEN.ORDER_EMAIL]: undefined;
  [APP_SCREEN.FLIGHT_TICKET]: undefined;
  [APP_SCREEN.NOT_FOUND]: undefined;
  [APP_SCREEN.BookingUpdate]: ActionBookingScreenParams;
  [APP_SCREEN.TicketIssue]: ActionBookingScreenParams;
  [APP_SCREEN.TicketEMD]: ActionBookingScreenParams;
  [APP_SCREEN.TicketVoid]: ActionBookingScreenParams;
  [APP_SCREEN.TicketRfnd]: ActionBookingScreenParams;
  [APP_SCREEN.BookingRebook]: ActionBookingScreenParams;
  [APP_SCREEN.BookingCancel]: ActionBookingScreenParams;
  [APP_SCREEN.EmailSend]: ActionBookingScreenParams;
  [APP_SCREEN.PassengerUpdate]: ActionBookingScreenParams;
  [APP_SCREEN.PassengerSplit]: ActionBookingScreenParams;
  [APP_SCREEN.PassportUpdate]: ActionBookingScreenParams;
  [APP_SCREEN.SeatmapUpdate]: ActionBookingScreenParams;
  [APP_SCREEN.AncillaryUpdate]: ActionBookingScreenParams;
  [APP_SCREEN.MemberUpdate]: ActionBookingScreenParams;
  [APP_SCREEN.CheckInOnline]: ActionBookingScreenParams;
  [APP_SCREEN.SMSSend]: ActionBookingScreenParams;
  [APP_SCREEN.FlightChange]: ActionBookingScreenParams;
  [APP_SCREEN.UpdateContact]: ActionBookingScreenParams;
  [APP_SCREEN.FLIGHT_CHANGE_DETAIL]: undefined;
  [APP_SCREEN.TICKET_CHANGE_DETAIL]: undefined;
  [APP_SCREEN.CREDIT_INFO]: CreditInfoScreenParams;
  [APP_SCREEN.CONFIG_TICKET]: undefined;
  [APP_SCREEN.CONFIG_EMAIL]: undefined;
  [APP_SCREEN.POLICY]: undefined;
  [APP_SCREEN.POLICY_DETAIL]: PolicyDetailScreenParams | undefined;
  [APP_SCREEN.DEP_ARR_AREA]: DepArrAreaScreenParams;
  [APP_SCREEN.DBS_CONTENT_ALL]: DBSContentAllParams;
  [APP_SCREEN.DBS_CONTENT_DETAIL]: DBSContentDetailParams;
  [APP_SCREEN.TITLE_AND_REMARK_OF_TICKET]: TitleAndRemarkOfTicketScreenParams;
  [APP_SCREEN.HEADER_AND_FOOTER_OF_EMAIL]: HeaderAndFooterOfEmailScreenParams;
  [APP_SCREEN.ADD_ANCILLARY]: AddAncillaryScreenParams;
  [APP_SCREEN.ADD_PRE_SEAT]: AddPreSeatScreenParams;
  [APP_SCREEN.PERMISSION_DENIED]: PermissionDeniedScreenParams | undefined;
  [APP_SCREEN.TOPUP]: undefined;
  [APP_SCREEN.PAY]: undefined;
  [APP_SCREEN.TOPUP_HISTORY]: undefined;
  [APP_SCREEN.TOPUP_DETAIL]: TopupDetailParams;
  [APP_SCREEN.PAYMENT_HISTORY]: undefined;
  [APP_SCREEN.BOOKING_PRICING_COMPLETED]: undefined;
  [APP_SCREEN.SPECIALIZE_NEWS_ALL]: DBSContentAllParams;
  [APP_SCREEN.BANNER_AND_NEWS_DETAIL]: DBSContentDetailParams;
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export const BOTTOM_TAB_HEIGHT = scale(50);
