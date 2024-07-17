import * as AuthenticationActions from './authentication';
import * as AppActions from './app';
import * as FileActions from './file';
import * as PermissionActions from './permissions';
import * as ModuleActions from './module';
import * as FlightSearchActions from './flight-search';
import * as FlightResultActions from './flight-result';
import * as FlightResultMonthActions from './flight-result-month';
import * as FlightBookingFormActions from './flight-booking-form';
import * as OrderActions from './order';
import * as AccountActions from './accounts';
import * as ConfigPaymentActions from './config-payment';
import * as ChargeActions from './charge';
import * as BookingActions from './bookings';
import * as AgentActions from './agent';
import * as FlightReportActions from './flight-report';
import * as UserSubAgentActions from './user-sub-agent';
import * as ContactActions from './contact';
import * as DocumentActions from './document';
import * as BookingActionActions from './booking-action';
import * as userGroupActions from './user-group';
import * as officeActions from './office';
import * as emailActions from './email';
import * as activityActions from './activity';
import * as employeeActions from './employee';
import * as historyActions from './history';
import * as userAccountActions from './user-account';
import * as flightTicketActions from './flight-ticket';
import * as sisetActions from './SISet';
import * as configEmailActions from './config-email';
import * as policyActions from './policy';
import * as airGroupActions from './air-group';
import * as dbsContentActions from './dbs-content';
import * as configTicketActions from './config-ticket';
import * as contentActions from './content';
import * as topupActions from './topup';
import * as currentAccountActions from './current-account';
import * as commonSearchActions from './common-search';
import * as bankActions from './bank';
import * as paymentActions from './payment';

const Actions = {
  ...AuthenticationActions,
  ...AppActions,
  ...FileActions,
  ...PermissionActions,
  ...ModuleActions,
  ...FlightSearchActions,
  ...FlightResultActions,
  ...FlightBookingFormActions,
  ...OrderActions,
  ...AccountActions,
  ...ConfigPaymentActions,
  ...FlightResultMonthActions,
  ...ChargeActions,
  ...BookingActions,
  ...AgentActions,
  ...FlightReportActions,
  ...UserSubAgentActions,
  ...ContactActions,
  ...DocumentActions,
  ...BookingActionActions,
  ...userGroupActions,
  ...officeActions,
  ...emailActions,
  ...activityActions,
  ...employeeActions,
  ...historyActions,
  ...userAccountActions,
  ...flightTicketActions,
  ...sisetActions,
  ...configEmailActions,
  ...policyActions,
  ...airGroupActions,
  ...dbsContentActions,
  ...configTicketActions,
  ...contentActions,
  ...topupActions,
  ...currentAccountActions,
  ...commonSearchActions,
  ...bankActions,
  ...paymentActions,
};

export default Actions;
