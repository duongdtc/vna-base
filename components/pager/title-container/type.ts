import { I18nKeys } from '@vna-base/translations/locales';

export type TitleContainerProps = {
  titles: Array<{ t18n: I18nKeys; disable?: boolean }>;
  onClick: (i: number) => void;
  widthTab: number;
};

export type TitleContainerRef = {
  changeTab: (index: number) => void;
};
