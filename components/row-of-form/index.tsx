/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import {
  ColorPicker,
  CountryPicker,
  DatePicker,
  Dropdown,
  Input,
  Radio,
  Switch,
} from './components';
import { RowItemControllerFormProps } from './type';
import { HTML } from './components/html';

export function RowOfForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: RowItemControllerFormProps<TFieldValues, TName>) {
  const { type, ...rest } = props;

  switch (type) {
    case 'dropdown':
      //@ts-ignore
      return <Dropdown<TFieldValues, TName> {...rest} />;

    case 'switch':
      return <Switch<TFieldValues, TName> {...rest} />;

    case 'radio':
      return <Radio<TFieldValues, TName> {...rest} />;

    case 'date-picker':
      //@ts-ignore
      return <DatePicker<TFieldValues, TName> {...rest} />;

    case 'date-time-picker':
      return (
        //@ts-ignore
        <DatePicker<TFieldValues, TName> type="date-time-picker" {...rest} />
      );

    case 'country-picker':
      //@ts-ignore
      return <CountryPicker<TFieldValues, TName> {...rest} />;

    case 'color-picker':
      //@ts-ignore
      return <ColorPicker<TFieldValues, TName> {...rest} />;

    case 'html':
      //@ts-ignore
      return <HTML<TFieldValues, TName> {...rest} />;

    default:
      //@ts-ignore
      return <Input<TFieldValues, TName> {...rest} />;
  }
}
