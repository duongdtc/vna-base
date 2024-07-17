import { FilterFormUserGroup } from '@vna-base/screens/agent-detail/type';
import { FilterForm as AgentFilterForm } from '@vna-base/screens/agent/type';
import { FilterForm as BookingFilterForm } from '@vna-base/screens/booking/type';
import { FilterForm as FlightTicketFilterForm } from '@vna-base/screens/flight-ticket/type';
import {
  AirOptionCustom,
  CustomFeeForm,
  FilterForm,
  Flight,
  PassengerForm,
  ResultMonthFilterForm,
  SearchForm,
  Sort,
} from '@vna-base/screens/flight/type';
import { FilterForm as OrderFilterForm } from '@vna-base/screens/order/type';
import { TransactionStatus } from '@vna-base/screens/pay/hooks/use-handle-topup-mqtt';
import { PaymentHistoryFilterForm } from '@vna-base/screens/payment-history/type';
import { FilterForm as PolicyFilterForm } from '@vna-base/screens/policy/type';
import { TopupFilterForm } from '@vna-base/screens/topup-history/type';
import { FilterForm as UserAccountFilterForm } from '@vna-base/screens/user-account/type';
import {
  Account as AccountAxios,
  Action,
  Activity,
  ActivityLst,
  Agent as AgentAxios,
  AgentGroup as AgentGroupAxios,
  AgentLst,
  AgentType as AgentTypeAxios,
  AgentTypeLst,
  AirGroup as AirGroupAxios,
  Booking,
  Charge,
  Contact,
  Content,
  Document,
  Email,
  Employee,
  EntryType as EntryTypeAxios,
  Eticket,
  HistoryDetail,
  HistoryLst,
  Office as OfficeAxios,
  Order,
  Payment,
  PayMethod,
  Policy,
  Remark,
  ReportLst,
  SISet as SISetAxios,
  Ticket,
  // TicketLst,
  UserAccount,
  UserAccountLst,
  UserGroup as UserGroupAxios,
  UserGroupLst,
  UserModule,
  UserPermission,
} from '@services/axios/axios-data';
import {
  Content as DBSContent,
  ContentLst,
  EmailModel,
  ETicket,
} from '@services/axios/axios-email';
import {
  AirOption,
  Ancillary,
  Booking as BookingIbe,
  ExchangeTicketRes,
  FareRule,
  FlightFare,
  MinFare,
  MinPrice,
  OptionGroup,
  RefundDoc,
  SeatMap,
} from '@services/axios/axios-ibe';
import { Rule } from '@services/casl/type';
import {
  AirportRealm,
  CountryRealm,
  RegionRealm,
} from '@services/realm/models';
import { ThemeType } from '@theme';
import { ThemeOptions } from '@theme/type';
import { I18nKeys } from '@translations/locales';
import {
  FareCode,
  LanguageSystem,
  LanguageSystemDetail,
  System,
} from '@vna-base/utils';
import * as Keychain from 'react-native-keychain';
import { Language } from '@translations/type';

export interface IAppState {
  language: Language | undefined;

  internetState: boolean;

  theme: ThemeType;

  themeOption: ThemeOptions;

  supportedBiometryType: Keychain.BIOMETRY_TYPE | null;
}

export interface AuthenticationState {
  token: string | undefined;
}

export type BalanceInfo = {
  balance: number;
  creditLimit: number;
};

export interface CurrentAccountState {
  currentAccount: UserAccount;
  errorMsgResetPass?: I18nKeys;
  /**
   * danh sách system mà người dùng có thể search
   */
  listSystem: Array<System>;
  /**
   * hiển thị số dư tài khoản
   */
  isShowBalance: boolean;

  balanceInfo: BalanceInfo;
}

export type Region = Omit<RegionRealm, 'Airport' | 'HighLight'>;

export type Airport = AirportRealm & {
  Country: CountryRealm;
};
export interface FlightLocationState {
  searchArea: {
    areas: Array<Region>;
    loadMore: boolean;
  };
  isLoadingSearchArea: boolean;
}

export type Discount = {
  title: string;
  describe: string;
  code: string;
};

export interface FlightBookingFormState {
  /**
   * key là số thứ tự của flight
   */
  baggages: Record<string, Array<Ancillary>>;
  services: Record<string, Array<Ancillary>>;
  seatMaps: Record<string, Array<SeatMap>>;
  isLoadingSeatMaps: boolean;
  isLoadingAncillaries: boolean;
  passengersForm?: Pick<
    PassengerForm,
    'ContactInfo' | 'Passengers' | 'SubmitOption'
  > | null;
  quickInfoPassengers: string;

  /**
   * dùng trong phần đổi chuyến bay - AddAncillaryScreen
   * QHHANSGN202405120606202405150830
   */
  encodeFlightInfoAncillary: string | null;
  /**
   * dùng trong phần đổi chuyến bay - AddPreSeatScreen
   * QHHANSGN202405120606202405150830
   */
  encodeFlightInfoPreSeat: string | null;
}
export type CACode = {
  title: string;
  describe: string;
  code: string;
};
export interface FlightSearchState {
  notification: any;
  CACodes: Array<CACode>;
  searchForm: SearchForm;
  routes: Array<Route>;
}

export interface FlightResultState {
  filterForms: Array<FilterForm> | null;
  listGroup: Array<OptionGroup>;
  multiFlights: Array<AirOption>;
  currentStage: number;
  isCryptic: boolean;
  sort: Sort;
  session: string;
  fareRule: { type: 'Custom' | 'Terminal'; list: Array<FareRule> } | null;
  listSelectedFlight: Array<AirOptionCustom>;
  verifiedFlights: Array<FlightFare>;
  isLoadingVerifiedFlights: boolean;
  minFares: Array<Array<{ minFare: MinFare | null; date: Date }>>;
  customFeeTotal: CustomFeeTotal &
    CustomFeeForm & {
      disable?: boolean;
    };

  searchDone: boolean;
}

export interface FlightMonthState {
  viewChart: boolean;
  stage0: Array<MinPrice>;
  stage1: Array<MinPrice>;
  stage2: Array<MinPrice>;
  stage3: Array<MinPrice>;
  filterForm: ResultMonthFilterForm;
  airlines: Array<string>;
}

export type CustomFeeTotal = {
  /**
   * Tổng tất cả các chuyến bay
   */
  Total: number;
  /**
   * Tổng giá vé cho 1 chuyến bay
   */
  TotalFare: number;
  /**
   * Giá cơ bản cho 1 người lớn (luôn bằng 0) cho 1 chuyến bay
   */
  BaseFare: number;
  /**
   * giá + thuế phí cho 1 ng lớn cho 1 chuyến bay
   */
  PriceAdt: number;
  /**
   * giá + thuế phí cho 1 ng lớn cho tất cả các chuyến bay
   */
  PriceAdtForAll: number;
  /**
   * giá + thuế phí cho 1 trẻ em cho 1 chuyến bay
   */
  PriceChd: number;
  /**
   * giá + thuế phí cho 1 trẻ sơ sinh cho 1 chuyến bay
   */
  PriceInf: number;
};

export type Process = { total: number; processed: number };

export interface IFileState {
  process: Array<Process>;
}

export type Route = {
  Leg: number;
  StartPoint: Flight;
  EndPoint: Flight;
  DepartDate: Date;
};

export interface PermissionsState {
  isLoadedPermission: boolean;
  permission: Array<Rule> | null;
  listPermissionAccount: Array<UserPermission>;
  allPermissions: Array<UserPermission>;
}

export type ModuleSideBar = UserModule & { children: Array<ModuleSideBar> };

export interface ModuleState {
  all: Array<UserModule>;
  sideBar: Array<ModuleSideBar>;
}

export type ListData = {
  // mảng các id của phần tử
  list: Array<string>;
  pageIndex: number;
  totalPage: number;
};

export interface OrderState {
  resultFilter: ListData;
  filterForm: OrderFilterForm | null;
  loadingFilter: boolean;
  viewingOrderId: string | null;
  historyGetDetail: Record<string, number>;

  listRemark: Array<Remark>;
  resultListActivity: Omit<
    HistoryLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
}

export interface PolicyState {
  resultFilter: {
    list: Array<Policy>;
    pageIndex: number;
    totalPage: number;
    totalItem: number;
  };
  filterForm: PolicyFilterForm | null;
  isLoadingFilter: boolean;
  policyDetail: Policy;
}

export type ListDataFlightTicket = {
  // mảng các id của phần tử
  list: Array<string>;
  pageIndex: number;
  totalPage: number;
};
export interface FlightTicketState {
  resultFilter: ListDataFlightTicket;
  filterForm: FlightTicketFilterForm | null;
  isLoadingFilter: boolean;
}

export interface BookingState {
  resultFilter: ListData;
  filterForm: BookingFilterForm | null;
  loadingFilter: boolean;
  viewingBookingId: string | null;

  loadingBookings: Record<string, boolean>;
  historyGetDetail: Record<string, number>;

  viewingBookingVersion: Booking | null;
}

export interface AccountsState {
  List: Array<UserAccount>;
  All: Record<string, UserAccount>;
}

export interface ConfigPaymentState {
  payMethods: Record<string, PayMethod>;
}

export interface ChargeState {
  charges: Array<Charge>;
  // key là orderId, value là thời gian lấy charges dạng unix
  historyGetChargesByOrderId: Record<string, number>;
  isLoadingCharge: boolean;
}

export type AgentType = AgentTypeAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};

export type AgentGroup = AgentGroupAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};

export type Agent = AgentAxios & {
  key: string;
  t18n: I18nKeys;
};

export type Account = AccountAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};

export interface AgentState {
  resultFilter: Omit<
    AgentLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
  filterForm: AgentFilterForm | null;
  loadingFilter: boolean;
  loadingLoadMore: boolean;
  listAgentType: Omit<
    AgentTypeLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
  allAgentType: Record<string, AgentType>;
  allAgentGroup: Record<string, AgentGroup>;
  allAgent: Record<string, Agent>;
  resultAgentDetail: AgentAxios;
}

export interface FlightReportState {
  resultListFlightReport: Omit<
    ReportLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
}

export interface UserSubAgentState {
  List: Array<UserAccount>;
  userSubAgents: UserAccount;
}

export interface ContactState {
  List: Array<Contact>;
  Contact: Contact;
}

export interface DocumentState {
  List: Array<Document>;
  Document: Document;
}

export interface EmailState {
  email: EmailModel;
  isLoadingEmail: boolean;
  eTickets: Record<string, Array<ETicket>>;
  isLoadingETicket: boolean;
}

export type FareCodeDetail = {
  Code: FareCode;
  Name: string;
  /**
   * if true, user can not change or delete this Fare
   */
  isLock?: boolean;
  /**
   * if true, user can change or add this fee in fee modal
   */
  canAddInFeeModal?: boolean;

  t18n?: I18nKeys;
};

export type BookingActionState = {
  actions: Record<string, Array<Action>>;
  loadings: Record<string, boolean>;

  /**
   * key là số thứ tự của flight
   */
  isLoadingAncillaries: boolean;
  baggages: Record<string, Array<Ancillary>>;
  services: Record<string, Array<Ancillary>>;
  isLoadingSeatMaps: boolean;
  seatMaps: Record<string, Array<SeatMap>>;

  priceChangeFlight: {
    fee: number;
    newPrice: number;
  };

  currentFeature: { featureId: string; bookingId: string };

  RefundDoc: Array<RefundDoc>;
  sessionRefund?: string;
  sessionExchangeTicket?: string;

  pricesExchangeTicket: Pick<
    ExchangeTicketRes,
    | 'Penalty'
    | 'Different'
    | 'OldPrice'
    | 'NewPrice'
    | 'TotalPrice'
    | 'PaidAmount'
  >;

  bookingPricingComplete: BookingIbe;
};

export type UserGroup = UserGroupAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};

export interface UserGroupState {
  resultListUserGroup: Omit<
    UserGroupLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
  filterForm: FilterFormUserGroup | null;
  loadingFilter: boolean;
  UserGroup: UserGroupAxios;
  allUserGroups: Record<string, UserGroup>;
}

export type AirGroup = AirGroupAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};

export interface AirGroupState {
  allAirGroups: Record<string, AirGroup>;
}

export interface ConfigEmailState {
  configEmail: Email;
  languages: Record<
    LanguageSystem,
    LanguageSystemDetail & { contents: Array<Content> }
  >;
  /**
   * key này là dạng TEMP1_vn
   */
  templates: Record<string, string | null | undefined>;
}

export interface ConfigTicketState {
  configTicket: Eticket;
  languages: Record<
    LanguageSystem,
    LanguageSystemDetail & { contents: Array<Content> }
  >;
  /**
   * key này là dạng TEMP1_vn
   */
  templates: Record<string, ETicket>;
}

export interface UserAccountState {
  userAccounts: Record<string, UserAccount>;
  resultFilter: Omit<
    UserAccountLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
  filterForm: UserAccountFilterForm | null;
  loadingFilter: boolean;
  loadingLoadMore: boolean;
}

export type Office = OfficeAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};

export interface OfficeState {
  allOffice: Record<string, Office>;
}

export interface ActivityState {
  resultFilterActivity: Omit<
    ActivityLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
  ActivityByAgent: Array<Activity>;
}

export interface EmployeeState {
  AllEmployeeOfCurrentAccount: Array<Employee>;
  AllEmployeeOfAgent: Array<Employee>;
}

export type UploadFileResponse = {
  Message: string;
  StatusCode: string;
  Success: boolean;
  FileUrl: string;
};

export interface HistoryState {
  isLoadingListHistory: boolean;
  listHistory: Omit<
    HistoryLst,
    'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
  >;
  historyDetails: Record<string, HistoryDetail>;
}

export type SISetType = SISetAxios & {
  description: string;
  key: string;
  t18n: I18nKeys;
};
export interface SISetState {
  listSISet: SISetAxios[] | null;
  allSISet: Record<string, SISetType>;
}

export interface DBSContentState {
  SpecializedNews: Pick<ContentLst, 'List' | 'PageIndex' | 'TotalPage'>;
  OutStandingPolicy: Pick<ContentLst, 'List' | 'PageIndex' | 'TotalPage'>;
  loadingSpecializeNews: boolean;
  loadingPolicy: boolean;
  detailContent: Record<string, DBSContent>;
}

export interface ContentState {
  contents: Array<Content>;
}

export type EntryType = EntryTypeAxios & {
  key: string;
  t18n: I18nKeys;
};

export interface TopupState {
  resultFilter: ListData;
  filterForm: TopupFilterForm | null;
  loadingFilter: boolean;
  allType: Record<string, EntryType>;
}

export interface CommonSearch {
  resultSearch: {
    Booking: Array<Booking>;
    Order: Array<Order>;
    Ticket: Array<Ticket>;
  };
  loadingSearch: boolean;
}

export interface BankState {
  QR: { path: string; bank: string; amount: number; randomCode: string | null };

  accounts: Record<string, Account>;

  accountsOfParent: Record<string, Account>;

  transactionStatus: TransactionStatus | null;
}

export interface PaymentState {
  ListPaymentExpense: Array<Payment>;
  ListPaymentReceive: Array<Payment>;
  resultFilter: ListData;
  filterForm: PaymentHistoryFilterForm | null;
  loadingFilter: boolean;
}

export interface SplashState {
  isMounted: boolean;
}
