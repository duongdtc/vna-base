import { I18nKeys } from '@translations/locales';
import { DatePickerProps } from 'react-native-date-picker';

export type DatePickerCustomProp = Pick<
  DatePickerProps,
  'maximumDate' | 'minimumDate'
> & {
  submit: (date: Date) => void;
  t18nTitle: I18nKeys;
  onDismiss?: () => void;
};

export type DatePickerRef = {
  open: (params: { date?: Date }) => void;
};
