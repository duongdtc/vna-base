import { SortType } from '@services/axios';
import { Content } from '@services/axios/axios-email';

export type FilterAndOrderName = keyof Pick<
  Content,
  | 'Id'
  | 'Index'
  | 'AgentId'
  // | 'Contact'
  | 'CategoryId'
  | 'CreatedDate'
>;

export type OrderName = keyof Pick<
  Content,
  | 'Id'
  | 'Index'
  | 'AgentId'
  // | 'Contact'
  | 'CategoryId'
  | 'CreatedDate'
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
