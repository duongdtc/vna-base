import { Content } from '@services/axios/axios-data';
import { LanguageSystem, LanguageSystemDetail } from '@vna-base/utils';
import { Image } from 'react-native-image-crop-picker';

export type ConfigTicketForm = {
  template: string;
  mainColor: string;
  foreColor: string;
  PNRColor: string;
  logo: string | Image | undefined | null;
  showTicketNumber: boolean;
};

export type LanguageTabProps = ConfigTicketForm & {
  contents: Array<Content>;
  language: LanguageSystem;
} & LanguageSystemDetail;

export type PreviewTicketBottomSheetRef = {
  present: (data: ConfigTicketForm) => void;
};
