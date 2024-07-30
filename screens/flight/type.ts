import { IconTypes } from '@assets/icon';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Airport, Discount, Route } from '@redux/type';
import {
  AirOption,
  Ancillary,
  Cabin,
  FareOption,
  FareRule,
  Flight as FlightIbe,
  OptionGroup,
  RuleGroup,
  Seat,
} from '@services/axios/axios-ibe';
import { CountryCode } from '@services/realm/models';
import { FlashList } from '@shopify/flash-list';
import { Colors, FontStyle } from '@theme/type';
import { I18nKeys } from '@translations/locales';
import { DateRangePickerMode, RangeDate } from '@vna-base/components';
import {
  BookFlight,
  FareType,
  Gender,
  PassengerSearchType,
  PassengerType,
  System,
} from '@vna-base/utils';
import { StyleProp, ViewStyle } from 'react-native';
import { ICalendarEventBase } from 'react-native-big-calendar';
import { SharedValue } from 'react-native-reanimated';
import { HotelDetail, RoomDetail } from './list-hotel/dummy';

// economy - Phổ thông
// business - Thương gia
// first - Hạng nhất
export enum SeatClassEnum {
  ECONOMY = 'economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

export enum OptionFlightEnum {
  STRAIGHT = 'Straight',
  NEARBY = 'Nearby',
}

export type SearchForm = {
  Passengers: Passengers;
  Flights: Array<FlightInput>;
  SeatClass: SeatClassEnum | null;
  Straight: boolean;
  Nearby: boolean;
  ByMonth: boolean;
  Type: 'OneStage' | 'RoundStage' | 'MultiStage';

  PassengerSearchType: PassengerSearchType | null;
  FareType: FareType | null;
  Corporation: string;
};

export type Passengers = {
  Adt: number;
  Chd?: number;
  Inf?: number;
};

export type FlightInput = {
  airport: AirportFlight;
  date: DateFlight;
};

export type AirportFlight = {
  takeOff: Flight | undefined;
  landing: Flight | undefined;
};

export type Flight = {
  NameVi: string;
  NameEn: string;
  Code: string;
  CityNameVi: string;
  CityNameEn?: string;
  CountryNameVi: string;
  CountryNameEn?: string;
  CountryCode: CountryCode;
};

export type DateFlight = {
  departureDay: Date;
  backDay?: Date;
};

export type SystemDetail = {
  key: System;
  t18n: I18nKeys;
  /**
   * discount code select
   */
  SystemDiscount?: Discount;
  /**
   * discount code input
   */
  UserDiscount?: string;

  priority: number;

  colorTheme: Colors;

  domestic?: boolean;
};

export type FormFlightProp = {
  style?: StyleProp<ViewStyle>;
  index: number;
  onDelete?: () => void;
  roundTrip?: boolean;
  selectBackDayDone?: () => void;
};

export type AirportPickerProps = {
  style?: StyleProp<ViewStyle>;
  index: number;
};

export interface ModalAirportPickerRef
  extends Pick<BottomSheetModal, 'dismiss' | 'close'> {
  present: (data: {
    t18nTitle: I18nKeys;
    dataItemIgnore?: Flight;
    onSubmit: (data: Airport) => void;
  }) => void;
}

export type PassengerPickerProps = {
  style?: ViewStyle;
};

export type CustomNumberInputProps = {
  value: number | undefined;
  onChangeValue: (val: number) => void;
  max: number;
  min: number;
  t18nTitle?: I18nKeys | undefined;
  t18nSubTitle?: I18nKeys | undefined;
};

export type OptionSearch = {
  icon: IconTypes;
  t18n: I18nKeys;
  key: OptionFlightEnum;
};

export type DatePickerProps = {
  style?: StyleProp<ViewStyle>;
  index: number;
  roundTrip?: boolean;
  selectBackDayDone?: () => void;
};

export type SubmitButtonProps = {
  style?: StyleProp<ViewStyle>;
  callback?: (byMont?: boolean) => void;
};

export type MoreOptionButtonProps = {
  textColorTheme: Colors;
  onPress: () => void;
};

export type OptionsForm = Pick<
  SearchForm,
  | 'Nearby'
  | 'Straight'
  | 'SeatClass'
  | 'PassengerSearchType'
  | 'Corporation'
  | 'FareType'
>;

export type ModalMonthPickerProps = {
  handleDone: (result: RangeDate, isBackDay: boolean) => void;
};

export type ModalBaggagePickerProps = {
  onDone: (data: {
    baggage: Ancillary;
    passengerIndex: number;
    flightIndex: number;
  }) => void;
};
export type WaitingRoomPickerProps = {
  onDone: (data: { waitingRoom: WaitingRoom; flightIndex: number }) => void;
};

export type ShuttleCarPickerProps = {
  onDone: (data: {
    shuttleCar: ShuttleCar;
    flightIndex: number;
    airportIdx: number;
  }) => void;
};

export type ModalServicePickerProps = {
  onDone: (data: {
    services: Array<Ancillary>;
    passengerIndex: number;
    flightIndex: number;
    segmentIndex: number;
  }) => void;
};

export type ModalMonthPickerRef = {
  present: (data: {
    t18nTitle: I18nKeys;
    initialValue: Pick<RangeDate, 'from'> & { to?: Date };
    minDate?: Date;
    mode: DateRangePickerMode;
    isBackDay?: boolean;
  }) => void;
};

export type ModalBaggagePickerRef = {
  present: (data: {
    selected: string | null | undefined;
    passengerIndex: number;
    flightIndex: number;
  }) => void;
};

export type WaitingRoomPickerRef = {
  present: (data: {
    selected: string | null | undefined;
    flightIndex: number;
  }) => void;
};

export type ShuttleCarPickerRef = {
  present: (data: {
    selected: string | null | undefined;
    flightIndex: number;
    airportIdx: number;
  }) => void;
};

export type ModalServicePickerRef = {
  present: (data: {
    listSelected: Array<string> | null | undefined;
    passengerIndex: number;
    segmentIndex: number;
    flight: FlightOfPassengerForm & { index: number };
  }) => void;
};

export type MinFareFilter = {
  TotalFare: number;
  PriceAdt: number;
  BaseFare: number;
};

type FareRangeFilter = {
  TotalFare: { max: number; min: number };
  PriceAdt: { max: number; min: number };
  BaseFare: { max: number; min: number };
};

export type FareFilter = {
  /**
   * Tổng giá vé cho tất cả hành khách
   */
  TotalFare: number;
  /**
   * giá + thuế phí cho 1 ng lớn
   */
  PriceAdt: number;
  /**
   * Giá cơ bản cho 1 người lớn
   */
  BaseFare: number;
};

export type FilterForm = {
  // OrderField: 'Fare' | 'DepartDate' | 'ArriveDate' | 'Airline';
  // OrderType: 'Asc' | 'Desc';
  /**
   * TotalFare: giá tổng
   * BaseFare: giá cơ bản cho 1 ng lớn
   * PriceAdt: giá + thuế phí cho 1 ng lớn
   */
  Fare: keyof FareFilter;
  FareRange: { range: [v1: number, v2: number]; fare: FareRangeFilter };
  // Airline: Array<{ key: string; selected: boolean; minFare: MinFareFilter }>;
  System: Array<SystemDetail & { selected: boolean }>;
  SeatClass: Array<{ key: string; selected: boolean; minFare: MinFareFilter }>;
  StopNum: Array<{
    key: 'NonStop' | 'OneStop' | 'MultiStop';
    t18n: I18nKeys;
    selected: boolean;
  }>;
  DepartTimeRange: Route & {
    range: [v1: number, v2: number];
  };
  DepartTimeSlot: Route & {
    slots: [v1: boolean, v2: boolean, v3: boolean, v4: boolean];
  };
  Duration: {
    range: [v1: number, v2: number];
    duration: {
      max: number;
      min: number;
    };
  };
  DepartTimeType: 'DepartTimeRange' | 'DepartTimeTimeSlot';
};

export type Sort = {
  OrderField: 'Fare' | 'DepartDate' | 'ArriveDate' | 'Airline';
  OrderType: 'Asc' | 'Desc';
  // nếu lọc theo giá thì cần truyền fare type, mặc định là TotalFare
  FareType?: keyof FareFilter;
};

export type FlightItemProps = {
  index: number;
  style?: StyleProp<ViewStyle>;
  item: AirOptionCustom;
  onPressItem: (item: AirOptionCustom, flightOptionIndex: number) => void;
  onSelectItem?: (
    airOption: AirOption,
    flightOptionIndex: number,
    fareOptionIndex: number,
  ) => void;
};

export type SelectedFlightItemProps = {
  item: AirOptionCustom;
  index: number;
  reselect: (index: number) => void;
  onPressItem: (
    airOption: AirOptionCustom,
    flightOptionIndex: number,
    fareOptionIndex: number,
  ) => void;
};

export type BottomSheetContentFlightRef = {
  expand: (data?: {
    airOption: AirOptionCustom;
    fareType?: keyof FareFilter;
    customFeeTotalType?: keyof FareFilter | 'Total';
    indexs?: { stageIndex: number; flightOptionIndex: number };
  }) => void;
  present: (data?: {
    airOption: AirOptionCustom;
    fareType?: keyof FareFilter;
    customFeeTotalType?: keyof FareFilter | 'Total';
    indexs?: { stageIndex: number; flightOptionIndex: number };
  }) => void;
  close: () => void;
  dismiss: () => void;
};

export type FareItemProps = {
  data: RuleGroup;
  index?: number;
};

export type StageFareItemProps = {
  data: FareRule;
  type: 'Custom' | 'Terminal';
  startPoint: string | null | undefined;
  endPoint: string | null | undefined;
};

export type AirOptionCustom = AirOption &
  Omit<OptionGroup, 'ListAirOption'> & {
    selected?: boolean;
    verifySession?: string;
  };

export type RangeSelectorTimeProps = Route & {
  range: Array<number>;
  /**
   * Min value of slider
   * @default 0
   */
  lowerBound?: number;

  /**
   * Max value of slider
   * @default 100
   */
  upperBound?: number;

  /**
   * Default value of range slider
   */
  initialRange: [v1: number, v2: number];

  /**
   * Event when range slider change value
   * @default undefined
   */
  onChangeRange: (changed: ArgsChangeRange) => void;

  /**
   * Smallest Unit of Measurement
   * @default undefined
   */
  smallestUnit?: number;
};

export type TimeSlotProps = Route & {
  slots: [v1: boolean, v2: boolean, v3: boolean, v4: boolean];
  /**
   * Event when range slider change value
   * @default undefined
   */
  onChangeRange: (i: number) => void;
};

export type RangeSelectorFareProps = Pick<
  RangeSelectorTimeProps,
  'initialRange' | 'onChangeRange' | 'smallestUnit'
> & { fare: { max: number; min: number }; customFee: number };

export type RangeSelectorDurationProps = Pick<
  RangeSelectorTimeProps,
  'initialRange' | 'onChangeRange' | 'smallestUnit'
> & { duration: { max: number; min: number } };

export type ArgsChangeRange = {
  lower: number;
  upper: number;
};

export type SearchFormProps = {
  sharedValue?: SharedValue<number>;
  callbackSubmit?: (byMonth?: boolean) => void;
  initPassengers?: Passengers;
  initSystem?: System;
  /**
   * @default false
   */
  hidePassengers?: boolean;
  /**
   * @default false
   */
  hideBookingSystems?: boolean;
  /**
   * @default false
   */
  disableMultiStage?: boolean;
  /**
   * @default false
   */
  disableRoundStage?: boolean;
  Footer?: React.ReactNode;
};

export type AirportPickerContext = {
  showModalAirportPicker: (data: {
    t18nTitle: I18nKeys;
    dataItemIgnore?: Flight | undefined;
    onSubmit: (data: Airport) => void;
  }) => void;
  closeModalAirportPicker: () => void;
};

export type FormInfoFlightRef = {
  present: (data?: { flight: any; index?: number }) => void;
};

export type Passport = {
  DocumentCode?: string;
  DocumentExpiry?: Date;
  Nationality?: CountryCode;
  IssueCountry?: CountryCode;
};

export type AdditionalPassengerInfoForm = Passport & {
  ListMembership: Array<{ Airline: string; MembershipID: string }>;
};

export type Passenger = {
  FullName: string;
  Surname: string;
  GivenName: string;
  Birthday: Date;
  Gender: Gender;
  Type: PassengerType;
  Index: number;
  PreSeats: Array<Array<Seat | null | undefined>>;
  Baggages: Array<Ancillary>;
  Services: Array<Array<Array<Ancillary>>>;

  Title?: string;

  Passport?: Passport;
  ListMembership: Array<{ Airline: string; MembershipID: string }>;
  AdditionalInfo?: AdditionalPassengerInfoForm | null;
};

export type FlightOfPassengerForm = FlightIbe & {
  FareOption: FareOption | undefined;
  AirlineOptionId: number;
  FlightOptionId: number;
  System: string;
  verified?: boolean;
};

export type TaxInfo = {
  CompanyName: string;
  TIN: string;
  ZIP: string;
  CountryCode?: CountryCode;
  City: string;
  Address: string;
  ReceiverInfo: {
    FullName: string;
    PhoneNumber: string;
    CountryCode: CountryCode;
    Email: string;
    Address: string;
    Note: string;
  };
};

export type ContactInfo = {
  CountryCode: CountryCode;
  PhoneNumber: string;
  Email: string;
  FullName: string;
  Address: string;
  Note?: string;
  // SendSystemEmail: boolean;
  // SendAirlineEmail: boolean;
  TaxInfo?: TaxInfo;
};

export type SubmitOption = {
  /**
   * Đặt và xuất vé luôn
   */
  OrderAndTicketIssuance: boolean;
  /**
   * Đặt riêng từng chặng
   */
  BookEachLegSeparately: boolean;
  /**
   * Tự động lấy giá thấp nhất
   */
  AutomaticallyFetchTheLowestPrice: boolean;
  /**
   * Tự động xuất vé khi đến hạn
   */
  AutomaticallyIssueTicketsUponExpiration: boolean;
  /**
   * Nhận thông báo biến động giá
   */
  ReceivePriceFluctuationNotifications: boolean;
};

export type ShuttleCar = {
  title: string;
  value: string;
  image: string;
  capacity: number;
  description: string;
  price: number;
};

export type Hotel = {
  hotel: HotelDetail | null;
  room: RoomDetail | null;
};

export type WaitingRoom = {
  value: string;
  price: number;
  img: string;
  title: string;
};

export type PassengerForm = {
  Passengers: Array<Passenger>;
  FLights: Array<FlightOfPassengerForm>;
  TotalFareFlight: number;
  ContactInfo: ContactInfo;
  TabIndex: number;
  SplitFullName: boolean;
  SubmitOption: SubmitOption;

  VerifiedSessions: Array<string>;

  Insurance: string | null;

  ShuttleCars: Array<Array<ShuttleCar>>;
  Hotels: Array<Array<Hotel>>;
  WaitingRooms: Array<WaitingRoom>;
};

export enum SeatType {
  WL = 'WindowLeft',
  WR = 'WindowRight',
  WN = 'WindowNull',
  EWL = 'ExitWindowLeft',
  EWR = 'ExitWindowRight',
  S = 'Seat',
  A = 'Aisle',
  AN = 'AisleNull',
  CLN = 'ColumnName',
  N = 'NULL',
}

export type MappedCabin = Omit<Cabin, 'ListColumn' | 'ListRow'> & {
  ListSeat: Array<Seat & { SeatType: SeatType }>;
  NumColumns: number;
};

export type SeatProps = {
  item: Seat & { SeatType: SeatType };
  selectedIndex: number;
  styles: any;
  isSelectForCurrentPassenger: boolean;
  disable: boolean;
  onSelectSeat: (seat: Seat | null, passengerIndex?: number) => void;
};

export type PassengerProps = {
  selecting: boolean;
  selectedSeat: Seat | null | undefined;
  index: number;
  fullName: string;
  setSelectingPassenger: (idx: number | null) => void;
};

export type ModalSubmitProps = {
  onSubmit: () => void;
  onCancel?: () => void;
};

export type ModalSubmitRef = {
  show: () => void;
};

export type ModalConfirmFinishedProps = {
  onSubmit: () => void;
  onViewOrder: () => void;
};

export type ModalConfirmFinishedRef = {
  show: (data?: { success: boolean; type: BookFlight }) => void;
};

export enum ApplyPassengerFee {
  PerPassenger,
  All,
}

export enum ApplyFlightFee {
  PerSegment,
  All,
}

export type CustomFeeForm = Record<keyof typeof PassengerType, string> & {
  applyFLight: ApplyFlightFee;
  applyPassenger: ApplyPassengerFee;
};

export type EventResultFlightType = ICalendarEventBase & {
  price?: number;
  colorTheme?: Colors;
  fontStyle?: FontStyle;
};

export type ResultMonthFilterForm = {
  Airline: string | null;
};

export type FLightItemInResultScreen = (AirOption | AirOptionCustom) & {
  Type?: 'RoundStage' | 'MultiStage' | 'Continue' | 'Empty';
};

export type ListFlightRef = { scrollToTop: () => void };

export type FilterContextType = {
  listFlightRef: React.RefObject<FlashList<FLightItemInResultScreen>>;
  filterFlight: (customFilterForm?: FilterForm | null) => void;

  selectedFlights: Array<AirOptionCustom>;
  setSelectedFlights: (data: Array<AirOptionCustom>) => void;
  listFlight: Array<FLightItemInResultScreen>;
  minimize: boolean;
  showBottomSheet: () => void;
  /**
   * hiển thị bottom sheet để xem chi tiết
   * @param item toàn bộ data của item
   * @param flightOptionIndex index củ flight option được chọn
   * @param stageIndex stage index của item đang xem (sử dụng khi xem chi tiết item đã được select)
   */
  showDetailAirOption: (
    item: AirOption,
    flightOptionIndex?: number,
    stageIndex?: number,
  ) => void;
  onSelectItem: (
    airOption: AirOption,
    flightOptionIndex: number,
    fareOptionIndex: number,
  ) => Promise<void>;
  onReselectItem: (i: number) => void;
};
