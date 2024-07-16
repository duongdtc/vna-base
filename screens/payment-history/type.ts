import { SortType } from '@services/axios';
import { Payment } from '@services/axios/axios-data';

export type FilterName = keyof Pick<
  Payment,
  'Title' | 'PaidAgent' | 'Airline' | 'System' | 'TicketType'
>;

export type OrderName = keyof Pick<Payment, 'Index'>;

export type Filter = {
  Name: FilterName;
  Value: string;
  Contain: boolean;
};

export type PaymentHistoryFilterForm = {
  GetAll: boolean;
  OrderBy: OrderName;
  SortType: SortType;
  Filter: Array<Filter>;
  Range: {
    from: Date;
    to: Date;
  };
};

export type FilterFormInBottomSheet = {
  Filter: Record<FilterName, string | null>;
};
