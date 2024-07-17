import { I18nKeys } from '@translations/locales';
import { GradientProps } from '@vna-base/components/linear-gradient/type';

export type TitleContainerProps = {
  titles: Array<{ t18n: I18nKeys; disable?: boolean }>;
  onClick: (i: number) => void;
  widthTab: number;
} & Pick<GradientProps, 'type'>;

export type TitleContainerRef = {
  changeTab: (index: number) => void;
};
