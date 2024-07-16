import { IconTypes } from '@assets/icon';
import { Charge, Passenger } from '@services/axios/axios-data';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { BookingStatus, Gender, PassengerType } from '@vna-base/utils';

export type FormBookingDetail = {
  BookingCode: string | null | undefined;
  BookingStatus: BookingStatus;
  Passengers: Array<
    Pick<
      Passenger,
      | 'PaxType'
      | 'Gender'
      | 'GivenName'
      | 'Surname'
      | 'BirthDate'
      | 'Membership'
      | 'DocumentNumb'
      | 'DocumentExpiry'
      | 'Nationality'
      | 'IssueCountry'
    >
  >;
};

export type TabContentType = {
  showTicketsTab: boolean;
};

export type BookingStatusDetail = {
  t18n: I18nKeys;
  key: BookingStatus;
  icon: IconTypes;
  iconColorTheme: keyof Colors;
};

export type PassengerTypeDetail = {
  t18n: I18nKeys;
  key: PassengerType;
};

export type GenderTypeDetail = {
  t18n: I18nKeys;
  key: Gender;
};

export type FeeModalRef = {
  show: (content?: Charge) => void;
};

export type FeeForm = Pick<
  Charge,
  | 'Id'
  | 'OrderId'
  | 'BookingId'
  | 'ChargeType'
  | 'PassengerId'
  | 'Amount'
  | 'Currency'
  | 'Remark'
  | 'ChargeValue'
  | 'StartPoint'
  | 'EndPoint'
  | 'PaxName'
> & {
  Route: string | null;
};

export type FlightPassengerWithCharge = Passenger & {
  ticketFare: number;
  ticketTax: number;
  serviceFee: number;
  discount: number;
};

export type FlightActionExpandParams = {
  bookingId: string;
  closeBottomSheet: () => void;
};
export type FlightActionBottomSheetRef = {
  present: (params: Omit<FlightActionExpandParams, 'closeBottomSheet'>) => void;
};
