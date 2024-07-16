import { SortType } from '@services/axios';
import { Booking } from '@services/axios/axios-data';

export type FilterAndOrderName = keyof Pick<
  Booking,
  | 'Airline'
  | 'BookingCode'
  | 'BookingStatus'
  | 'OrderCode'
  | 'System'
  | 'Itinerary'
  | 'StartPoint'
  | 'EndPoint'
  | 'DepartDate'
  | 'FlightType'
  | 'PaxName'
  | 'PaxSumm'
  | 'BookingDate'
  | 'ExpirationDate'
  | 'TimePurchase'
  | 'NetPrice'
  | 'TotalPrice'
  | 'Profit'
  | 'Currency'
  | 'FareClass'
  | 'FareBasis'
  | 'ContactPhone'
  | 'ContactEmail'
  | 'SubAgName'
  | 'AgentName'
  // | 'ResponseTime'
  // | 'ErrorMessage'
  | 'CreatedUser'
>;

export type FilterAndOrder = {
  Name: FilterAndOrderName;
  Value: string;
  Contain: boolean;
};

export type FilterFormInBottomSheet = {
  GetAll: boolean;
  OrderBy: FilterAndOrderName;
  SortType: SortType;
  Filter: Record<FilterAndOrderName, string | null>;
};

export type FilterForm = {
  GetAll: boolean;
  OrderBy: FilterAndOrderName;
  SortType: SortType;
  Filter: Array<FilterAndOrder>;
  Range: {
    from: Date;
    to: Date;
  };
};
