import { I18nKeys } from '@translations/locales';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
export type Scene = {
  tabKey: string;
  child: (props?: ViewProps) => JSX.Element;
};

export type SceneWithTitle = {
  tabKey: string;
  t18n: I18nKeys;
  child: (props?: ViewProps) => JSX.Element;
  disable?: boolean;
};

export interface PagerProps<T = Scene> {
  initTab?: number;
  renderScene: Array<T>;
  style?: StyleProp<ViewStyle> | undefined;
  onChangeTab?: (i: number) => void;
}

export type PagerRef = {
  changeTab: (index: number) => void;
};
