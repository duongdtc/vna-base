import { I18nKeys } from '@vna-base/translations/locales';

export type DateRangePickerConfig = {
  t18nTitle: I18nKeys;
  allowToChooseNilDate?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  t18nDone?: I18nKeys;
  t18nCancel?: I18nKeys;
} & (RangePickerConfig | DatePickerConfig);

type RangePickerConfig = {
  mode: DateRangePickerMode.Range;
  allowDateRangeChanges?: boolean;
  selectMonthOnHeaderTap?: boolean;
  initialValue?: RangeDate;
};

type DatePickerConfig = {
  mode: DateRangePickerMode.Single;
  initialValue?: Date;
};

export enum DateRangePickerMode {
  Range = 'range',
  Single = 'single',
}

export type RangeDate = {
  from: Date;
  to: Date;
};

export type ConfigNativeModule = Omit<
  DateRangePickerConfig,
  'minimumDate' | 'maximumDate' | 'initialValue'
> & {
  minimumDate?: number;
  maximumDate?: number;
  initialValue?: number | { from: number; to: number };
};
