import { OptionData } from '@vna-base/components/action-sheet/type';
import { UserAccount } from '@services/axios/axios-data';
import { Image } from 'react-native-image-crop-picker';

export type PersonalInfoForm = Pick<
  UserAccount,
  | 'Email'
  | 'FullName'
  | 'Username'
  | 'Phone'
  | 'UserGroupId'
  | 'Status'
  | 'Remark'
  | 'SISetId'
  | 'AgentId'
> & {
  Id: string;
  Photo: string | Image | undefined | null;
  AllowSearch: boolean;
  AllowBook: boolean;
  AllowIssue: boolean;
  AllowVoid: boolean;
  AllowApprove?: boolean;
};

export const listOptionItemSubAgtAcc: Array<OptionData> = [
  {
    t18n: 'booking:view_history',
    key: 'VIEW_HISTORY',
    icon: 'history_outline',
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
