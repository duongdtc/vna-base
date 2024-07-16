import { OptionData } from '@vna-base/action-sheet/type';
import { SortType } from '@services/axios';
import {
  Activity,
  Employee,
  FlightReport,
  UserGroup,
} from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { Image } from 'react-native-image-crop-picker';

export type InfoConfigtab = {
  AllowBook?: boolean;
  AllowIssue?: boolean;
  AllowSearch?: boolean;
  AllowVoid?: boolean;
  SISetId?: string | null;
};

export type InfoGeneraltab = {
  Active?: boolean;
  CustomerID?: string | null;
  AgentName?: string | null;
  AgentGroup?: string | null;
  AgentType?: string | null;
  Phone?: string | null;
  Email?: string | null;
  Contact?: string | null;
  ExpiryDate?: Date | null;
  OfficeId?: string | null;
  Address?: string | null;
  Logo?: string | Image | null;
};

export type CompanyInfo = {
  Company?: string | null;
  TaxCode?: string | null;
  BankNumb?: string | null;
  BankName?: string | null;
  StartupDate?: Date | null;
  ContractDate?: Date | null;
};

export type FormAgentDetail = {
  GeneralTab?: InfoGeneraltab;
  CompanyInfo?: CompanyInfo;
  ConfigTab?: InfoConfigtab;
};

export type OrderByFlReport = keyof Pick<
  FlightReport,
  | 'ReportDate'
  | 'SearchTotal'
  | 'SearchMin'
  | 'SearchDay'
  | 'SearchMonth'
  | 'OrderTotal'
>;

type FilterNameFlReport = keyof Pick<
  FlightReport,
  | 'ReportDate'
  | 'SearchTotal'
  | 'SearchMin'
  | 'SearchDay'
  | 'SearchMonth'
  | 'OrderTotal'
>;

export type FilterFlReport = {
  Name: FilterNameFlReport;
  Value: string;
  Contain: boolean;
};

export type FilterFormFLReport = {
  OrderBy: OrderByFlReport;
  SortType: SortType;
  Filter: Array<FilterFlReport>;
  GetAll: boolean;
  AgentId: string;
  Mode?: string;
};

export enum ListKeyFlReport {
  ORDERS = 'ORDERS',
  SALES = 'SALES',
  SEARCH = 'SEARCH',
  RESERVE = 'RESERVE',
  ISSUE_TICKET = 'ISSUE_TICKET',
}

export type ReportAgt = {
  key: ListKeyFlReport;
  t18n: I18nKeys;
  totalCount: string;
  currency: I18nKeys;
};

export const listOption: Array<OptionData> = [
  {
    t18n: 'order_detail:view_history',
    key: 'VIEW_ACTIVITY',
    icon: 'history_outline',
  },
  {
    t18n: 'add_new_agent:delete_agent',
    key: 'DELETE_AGENT',
    icon: 'trash_2_fill',
  },
];

export type OrderByUG = keyof Pick<
  UserGroup,
  'Code' | 'Name' | 'ParentId' | 'Level' | 'Description' | 'Visible'
>;

type FilterNameUG = keyof Pick<
  UserGroup,
  'Code' | 'Name' | 'ParentId' | 'Level' | 'Description' | 'Visible'
>;

export type FilterUG = {
  Name: FilterNameUG;
  Value: string;
  Contain: boolean;
};

export type FilterFormUserGroup = {
  OrderBy: OrderByUG;
  SortType: SortType;
  Filter: Array<FilterUG>;
};

export const listOptionItemSubAgtAcc: Array<OptionData> = [
  {
    t18n: 'agent_detail:edit_info_sub_agt_acc',
    key: 'EDIT_INFO',
    icon: 'edit_2_fill',
  },
  {
    t18n: 'agent_detail:reset_pass_sub_agt_acc',
    key: 'RESET_PASS',
    icon: 'refresh_fill',
  },
  {
    t18n: 'agent_detail:delete_sub_agt_acc',
    key: 'DELETE',
    icon: 'trash_2_fill',
  },
];

export type OrderByActivity = keyof Pick<
  Activity,
  'EmployeeId' | 'Title' | 'CreatedDate'
>;

type FilterNameActivity = keyof Pick<
  Activity,
  'EmployeeId' | 'Title' | 'CreatedDate'
>;

export type FilterActivity = {
  Name: FilterNameActivity;
  Value: string;
  Contain: boolean;
};

export type FilterFormActivity = {
  OrderBy: OrderByActivity;
  SortType: SortType;
  Filter: Array<FilterActivity>;
};

export type OrderByEmployee = keyof Pick<
  Employee,
  'Id' | 'AgentId' | 'FullName'
>;

type FilterNameEmployee = keyof Pick<Employee, 'Id' | 'AgentId' | 'FullName'>;

export type FilterEmployee = {
  Name: FilterNameEmployee;
  Value: string;
  Contain: boolean;
};

export type FilterFormEmployee = {
  OrderBy: OrderByEmployee;
  SortType: SortType;
  Filter: Array<FilterEmployee>;
};
