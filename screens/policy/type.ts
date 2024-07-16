import { SortType } from '@services/axios';
import { Policy } from '@services/axios/axios-data';

export type FilterName = keyof Pick<
  Policy,
  'AgentGroup' | 'AirGroup' | 'StartPoint' | 'EndPoint' | 'FareClassApply'
>;

export type OrderName = keyof Pick<
  Policy,
  'AgentGroup' | 'AirGroup' | 'System'
>;

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
};
