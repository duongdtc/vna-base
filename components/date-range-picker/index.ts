/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DateRangePickerModule } from '@native-module';
import { translate } from '@translations/translate';
import { StorageKey, getState, load } from '@vna-base/utils';
import dayjs from 'dayjs';
import { Platform } from 'react-native';
import { DateRangePickerConfig, DateRangePickerMode, RangeDate } from './type';

export const DateRangePicker = {
  present: (
    config: DateRangePickerConfig,
    handleDone?: ((value: RangeDate) => void) | ((value: Date) => void),
    // dismissHandler?: () => void,
  ) => {
    const minimumDate = config.minimumDate
      ? dayjs(config.minimumDate).valueOf()
      : undefined;

    const maximumDate = config.maximumDate
      ? dayjs(config.maximumDate).valueOf()
      : undefined;

    let initialValue: number | { from: number; to: number } | undefined;
    if (config.initialValue) {
      if (config.mode === DateRangePickerMode.Range) {
        initialValue = {
          from: dayjs(config.initialValue.from).valueOf(),
          // eslint-disable-next-line no-nested-ternary
          to: config.initialValue.to
            ? dayjs(config.initialValue.to).valueOf()
            : Platform.OS === 'android'
            ? 0
            : dayjs(config.initialValue.from).valueOf(),
        };
      } else {
        initialValue = dayjs(config.initialValue).valueOf();
      }
    }

    const _handleDone = (result: any) => {
      if (result?.from) {
        //@ts-ignore
        handleDone?.({ from: new Date(result.from), to: new Date(result.to) });
      } else {
        //@ts-ignore
        handleDone?.(new Date(result));
      }
    };

    DateRangePickerModule.present(
      {
        ...config,
        title: translate(config.t18nTitle),
        textDone: config.t18nDone ? translate(config.t18nDone) : undefined,
        textCancel: translate(config.t18nCancel),
        minimumDate,
        maximumDate,
        initialValue,
        language: load(StorageKey.LANGUAGE),
        dark: getState('app').theme === 'dark',
      },
      _handleDone,
      // dismissHandler,
    );
  },
};
