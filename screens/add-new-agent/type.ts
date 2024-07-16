import { Agent } from '@services/axios/axios-data';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { Image } from 'react-native-image-crop-picker';

export type FormNewAgentType = Pick<
  Agent,
  | 'Active'
  | 'CustomerID'
  | 'AgentName'
  | 'AgentGroup'
  | 'AgentType'
  | 'Phone'
  | 'Email'
  | 'Contact'
  | 'OfficeId'
  | 'Address'
  | 'AllowSearch'
  | 'AllowBook'
  | 'AllowIssue'
  | 'AllowVoid'
  | 'UseB2B'
  | 'SISetId'
> & {
  Logo?: string | Image | null;
  Guarantee: string | null;
  CreditLimit: string | null;
};

export const listOptionUploadImg: Array<OptionData> = [
  {
    t18n: 'upload_file:take_picture',
    key: 'TAKE_PICTURE',
    icon: 'camera_fill',
  },
  {
    t18n: 'upload_file:pick_image',
    key: 'PICK_IMAGES',
    icon: 'image_fill',
  },
];
