import { Policy } from '@services/axios/axios-data';

export type PolicyDetailForm = Pick<
  Policy,
  | 'Active'
  | 'ServiceFeeFormula'
  | 'StartPoint'
  | 'EndPoint'
  | 'AgentGroup'
  | 'AirGroup'
  | 'System'
  | 'Currency'
  | 'FareClassApply'
> & {
  ServiceFeeADT: string;
  ServiceFeeCHD: string;
  ServiceFeeINF: string;
};
