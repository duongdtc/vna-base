import { IOSNativeProps } from '@react-native-community/datetimepicker';
import { I18nKeys } from '@vna-base/translations/locales';

export type DateTimePickerProps = Pick<
  IOSNativeProps,
  'maximumDate' | 'minimumDate' | 'locale'
> & {
  submit: (date: Date) => void;
  t18nTitle?: I18nKeys;
  onDismiss?: () => void;
};

export type DateTimePickerRef = {
  open: (params: { date: Date }) => void;
};
