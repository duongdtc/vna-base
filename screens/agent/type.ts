import { SortType } from '@services/axios';
import { Agent, SISet } from '@services/axios/axios-data';

export type FilterAndOrderName = keyof Pick<
  Agent,
  | 'CustomerID'
  | 'AgentCode'
  | 'AgentName'
  // | 'Contact'
  | 'Phone'
  | 'Email'
  // | 'Address'
  | 'AgentGroup'
  | 'AgentType'
  | 'Active'
>;

export type OrderName = keyof Pick<
  Agent,
  'CreatedDate' | 'CustomerID' | 'AgentCode' | 'AgentName'
>;

export type FilterAndOrder = {
  Name: FilterAndOrderName;
  Value: string;
  Contain: boolean;
};

export type FilterForm = {
  GetAll: boolean;
  OrderBy: OrderName;
  SortType: SortType;
  Filter: Array<FilterAndOrder>;
};

export type FilterFormInBottomSheet = {
  Filter: Record<FilterAndOrderName, string | null>;
};

export const statusActive: Record<any, any> = {
  true: {
    key: 'true',
    t18n: 'agent:opened',
    icon: 'checkmark_circle_fill',
    iconColorTheme: 'success500',
  },
  false: {
    key: 'false',
    t18n: 'agent:closed',
    icon: 'close_circle_fill',
    iconColorTheme: 'error500',
  },
};

export type OrderNameSISet = keyof Pick<
  SISet,
  'Id' | 'AgentId' | 'Code' | 'Name'
>;

export type FilterAndSISet = {
  Name: OrderNameSISet;
  Value: string;
  Contain: boolean;
};

export type SISetForm = {
  GetAll: boolean;
  OrderBy: OrderNameSISet;
  SortType: SortType;
  Filter: Array<FilterAndSISet>;
};
