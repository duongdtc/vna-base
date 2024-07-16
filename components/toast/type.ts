import { IconTypes } from '@assets/icon';
import { I18nKeys } from '@vna-base/translations/locales';
import { ColorValue } from 'react-native';

export type NormalProps = {
  t18n?: I18nKeys;
  text?: string;
  color: ColorValue;
  icon: IconTypes;
};

type DefaultProps = {
  t18n?: I18nKeys;
  text?: string;
};

type ShowCustomToastArgs = {
  type: 'normal';
  onPress?: () => void;
  visibilityTime?: number;
} & NormalProps;

type ShowDefaultToastArgs = {
  type: 'error' | 'warning' | 'success';
  onPress?: () => void;
  visibilityTime?: number;
} & DefaultProps;

export type ShowToastArgs = ShowCustomToastArgs | ShowDefaultToastArgs;
