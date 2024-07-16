/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Dropdown, Input, Nav } from './components';
import { RowProps } from './type';

export const Row = memo((props: RowProps) => {
  const { type, ...rest } = props;

  switch (type) {
    case 'dropdown':
      //@ts-ignore
      return <Dropdown {...rest} />;

    // case 'switch':
    //   //@ts-ignore
    //   return <Switch {...rest} />;

    case 'nav':
      //@ts-ignore
      return <Nav {...rest} />;

    // case 'radio':
    //   return <Radio {...rest} />;

    // case 'date-picker':
    //   //@ts-ignore
    //   return <DatePicker {...rest} />;

    // case 'date-time-picker':
    //   return (
    //     //@ts-ignore
    //     <DatePicker type="date-time-picker" {...rest} />
    //   );

    // case 'country-picker':
    //   //@ts-ignore
    //   return <CountryPicker {...rest} />;

    default:
      //@ts-ignore
      return <Input {...rest} />;
  }
}, isEqual);
