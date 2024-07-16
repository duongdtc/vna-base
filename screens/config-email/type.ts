import { Content, Email } from '@services/axios/axios-data';
import { LanguageSystem, LanguageSystemDetail, TicketMimeType } from '@vna-base/utils';
import { Image } from 'react-native-image-crop-picker';

export type ConfigEmailForm = Pick<
  Email,
  | 'MailAddress'
  | 'EnableSSL'
  | 'Host'
  | 'MailServer'
  | 'Password'
  | 'SenderName'
  | 'CCEmail'
> & {
  Port: string;
  template: string;
  showPrice: boolean;
  showHeader: boolean;
  showFooter: boolean;
  showPNR: boolean;
  individualTicket: boolean;
  ticketType: TicketMimeType;
  includeETicket: boolean;
  logo: string | Image | undefined | null;
};

export type LanguageTabProps = ConfigEmailForm & {
  contents: Array<Content>;
  language: LanguageSystem;
} & LanguageSystemDetail;

export type PreviewEmailBottomSheetRef = {
  present: (data: ConfigEmailForm) => void;
};
