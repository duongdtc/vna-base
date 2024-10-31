import { FlightOfPassengerForm, Hotel } from '@vna-base/screens/flight/type';
import { Service } from '.';
import { I18nKeys } from '@translations/locales';
import { Ancillary } from '@services/axios/axios-ibe';
import { IconTypes } from '@assets/icon';

export type ItemContainerProps = Pick<Service, 't18nTitle'> & {
  renderSegment?: boolean;
  defaultClose?: boolean;
  disabled?: boolean;
  t18nEmpty?: I18nKeys;
  services?: Record<string, any>;
  loading?: boolean;
  icon?: IconTypes;
  renderServiceItem: (data: {
    passengerIndex: number;
    flightIndex: number;
    isOneway: boolean;
    segmentIndex?: number;
  }) => JSX.Element;
};

export type NewItemContainerProps = Pick<Service, 't18nTitle'> & {
  renderSegment?: boolean;
  defaultClose?: boolean;
  disabled?: boolean;
  renderEndpoint: boolean;
  icon?: IconTypes;
  renderServiceItem: (data: {
    flightIndex: number;
    airportIdx: number;
  }) => JSX.Element;
};

export type BaggageItemProps = {
  passengerIndex: number;
  flightIndex: number;
  isOneway: boolean;
  onPress: (data: {
    selected: string | undefined | null;
    passengerIndex: number;
    flightIndex: number;
  }) => void;
};

export type WaitingRoomItemProps = {
  flightIndex: number;

  onPress: (data: {
    selected: string | undefined | null;
    flightIndex: number;
  }) => void;
};

export type ShuttleCarItemProps = {
  flightIndex: number;
  airportIdx: number;
  onPress: (data: {
    selected: string | undefined | null;
    flightIndex: number;
    airportIdx: number;
  }) => void;
};

export type HotelItemProps = {
  flightIndex: number;
  airportIdx: number;
  onPress: (data: {
    selected: Hotel | null;
    flightIndex: number;
    airportIdx: number;
  }) => void;
};

export type SeatItemProps = {
  passengerIndex: number;
  flightIndex: number;
  segmentIndex: number;
  isOneway: boolean;
};

export type ServiceItemProps = {
  type: 'OthersService' | 'Food' | 'Drink' | 'Entertainment' | 'Beauty';
  passengerIndex: number;
  segmentIndex: number;
  flightIndex: number;
  isOneway: boolean;
  onPress: (data: {
    listSelected: Array<string> | undefined | null;
    passengerIndex: number;
    segmentIndex: number;
    flight: FlightOfPassengerForm & { index: number };
  }) => void;
};

export type ModalShuttleCarPickerRef = {
  present: (data: {
    listSelected: Array<string> | null | undefined;
    passengerIndex: number;
    segmentIndex: number;
    flight: FlightOfPassengerForm & { index: number };
  }) => void;
};

export type ModalShuttleCarPickerProps = {
  onDone: (data: {
    services: Array<Ancillary>;
    passengerIndex: number;
    flightIndex: number;
    segmentIndex: number;
  }) => void;
};
