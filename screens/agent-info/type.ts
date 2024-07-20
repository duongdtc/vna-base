export type FormAgentInfoType = {
  IATANumber?: string | null;
  GeneralTab: {
    CustomerID?: string | null;
    AgentCode?: string | null;
    Phone?: string | null;
    Email?: string | null;
    Address?: string | null;
  };
  CompanyInfo?: {
    Company?: string | null;
  };
};
