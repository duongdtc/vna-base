import { I18nKeys } from '@translations/locales';
import { RoomEnum } from '../dummy';

export type Item = {
  t18n: I18nKeys;
  key: RoomEnum;
  image?: string;
  description1?: string | null;
  description2?: string | null;
  description3?: string | null;
  price?: number;
  people?: string;
  acreage?: string;
};

export type ModalPickerRef = {
  present: (key: RoomEnum | undefined) => void;
};

export type ModalPickerProps = {
  handleDone: (key: RoomEnum) => void;
  t18nTitle: I18nKeys;
  snapPoints?: (string | number)[] | undefined;
  data: Array<Item>;
  hasDescription?: boolean;
  showCloseButton?: boolean;
  showIndicator?: boolean;
};
