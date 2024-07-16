import { SortType } from '@services/axios';
import { Ticket } from '@services/axios/axios-data';

export type FilterName = keyof Pick<
  Ticket,
  | 'TicketType'
  | 'BookingCode'
  | 'TicketNumber'
  | 'FullName'
  | 'IssueUser'
  | 'AgentId'
>;

export type OrderName = keyof Pick<Ticket, 'IssueDate'>;

export type Filter = {
  Name: FilterName;
  Value: string;
  Contain: boolean;
};

export type FilterFormInBottomSheet = {
  Filter: Record<FilterName, string | null>;
};

export type FilterForm = {
  GetAll: boolean;
  OrderBy: OrderName;
  SortType: SortType;
  Filter: Array<Filter>;
  Range: {
    from: Date;
    to: Date;
  };
};
