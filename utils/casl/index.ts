import { UserPermission } from '@services/axios/axios-data';
import { Action, Rule, StringSubject } from '@services/casl/type';

/**
 * generate list rule
 * @param agentLevel eg: F1, F2, F3,....
 * @param list: list UserPermission from BE
 * @returns list Rule
 */
export function genRulesFromBE(
  list: Array<UserPermission>,
  { agentLevel, isSuperAdmin }: { agentLevel: string; isSuperAdmin: boolean },
) {
  // const { AgentCode } = getState('currentAccount').currentAccount.Agent!;

  let rules: Array<Rule> = [
    // {
    //   action: 'update',
    //   subject: 'Mission',
    //   conditions: {
    //     CreatedUserId: res.data.Item?.Id,
    //   },
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'FLIGHTSEARCH',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'ORDER',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'FLIGHTTICKET',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'SALES',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'USERACCOUNT',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'AGENT',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'FLIGHTPOLICY',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'ConfigTicket',
    // },
    // {
    //   action: 'VIEW',
    //   subject: 'ConfigEmail',
    // },
    // {
    //   action: 'INSERT',
    //   subject: 'BOOKING_FARE',
    //   conditions: {
    //     AgentCode,
    //   },
    // },
  ];

  switch (agentLevel) {
    case 'F1':
      break;

    default:
      rules = rules.concat([
        {
          action: 'view',
          subject: 'balance_custom',
        },
        {
          action: 'view',
          subject: 'agent_info_custom',
        },
      ]);

      break;
  }

  if (isSuperAdmin) {
    rules = rules.concat([
      { action: 'view', subject: 'booking' },
      { action: 'view', subject: 'agentgroup' },
      { action: 'view', subject: 'slideshow' },
      { action: 'view', subject: 'department' },
      { action: 'view', subject: 'ticket' },
      { action: 'view', subject: 'account' },
      { action: 'view', subject: 'currency' },
      { action: 'view', subject: 'signin' },
      { action: 'view', subject: 'office' },
      { action: 'view', subject: 'reportbooking' },
      { action: 'view', subject: 'member' },
      { action: 'view', subject: 'farerule' },
      { action: 'view', subject: 'subscription' },
      { action: 'view', subject: 'entryitem' },
      { action: 'view', subject: 'useraccount' },
      { action: 'view', subject: 'userpermission' },
      { action: 'view', subject: 'geocountry' },
      { action: 'view', subject: 'menugroup' },
      { action: 'view', subject: 'flight' },
      { action: 'view', subject: 'banner' },
      { action: 'view', subject: 'usergroup' },
      { action: 'view', subject: 'reportrequest' },
      { action: 'view', subject: 'configemail' },
      { action: 'view', subject: 'reportsearch' },
      { action: 'view', subject: 'siset' },
      { action: 'view', subject: 'tourcode' },
      { action: 'view', subject: 'reportticket' },
      { action: 'view', subject: 'blacklist' },
      { action: 'view', subject: 'paymethod' },
      { action: 'view', subject: 'airgroup' },
      { action: 'view', subject: 'airignore' },
      { action: 'view', subject: 'content' },
      { action: 'view', subject: 'paylogger' },
      { action: 'view', subject: 'airline' },
      { action: 'view', subject: 'geoairport' },
      { action: 'view', subject: 'preorder' },
      { action: 'view', subject: 'payment' },
      { action: 'view', subject: 'aircraft' },
      { action: 'view', subject: 'georegion' },
      { action: 'view', subject: 'geocity' },
      { action: 'view', subject: 'transaction' },
      { action: 'view', subject: 'order' },
      { action: 'view', subject: 'debt' },
      { action: 'view', subject: 'configticket' },
      { action: 'view', subject: 'agent' },
      { action: 'view', subject: 'category' },
      { action: 'view', subject: 'policy' },
    ]);
  }

  list.forEach(userPermission => {
    if (
      userPermission.UserModule?.Code !== '' &&
      userPermission.UserModule?.Code !== null
    ) {
      userPermission.Action?.substring(1, userPermission.Action.length - 1)
        .split('][')
        .forEach(ac => {
          rules.push({
            action: ac.toLocaleLowerCase() as Action,
            subject:
              userPermission.UserModule?.Code?.toLocaleLowerCase() as StringSubject,
          });
        });
    }
  });

  return rules;
}
