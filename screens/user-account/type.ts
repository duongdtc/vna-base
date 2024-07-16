import { SortType } from '@services/axios';
import { UserAccount } from '@services/axios/axios-data';

export type FilterAndUserAccountName = keyof Pick<
  UserAccount,
  | 'Index'
  | 'Username'
  | 'FullName'
  | 'UserGroupId'
  | 'Status'
  | 'Phone'
  | 'Email'
>;

export type OrderName = keyof Pick<
  UserAccount,
  'Username' | 'FullName' | 'LastLoginDate'
>;

export type FilterAndUserAccount = {
  Name: FilterAndUserAccountName;
  Value: string;
  Contain: boolean;
};

export type FilterForm = {
  GetAll: boolean;
  OrderBy: OrderName;
  SortType: SortType;
  Filter: Array<FilterAndUserAccount>;
};

export type FilterFormInBottomSheet = {
  Filter: Record<FilterAndUserAccountName, string | null>;
};
