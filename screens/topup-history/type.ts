import { SortType } from '@services/axios';
import { EntryItem } from '@services/axios/axios-data';

export type FilterName = keyof Pick<
  EntryItem,
  'PaymentMethod' | 'AccountId' | 'EntryType'
>;

export type OrderName = keyof Pick<EntryItem, 'CreatedDate'>;

export type Filter = {
  Name: FilterName;
  Value: string;
  Contain: boolean;
};

export type TopupFilterForm = {
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
