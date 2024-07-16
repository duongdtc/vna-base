import { EmptyList } from '@vna-base/components';
import { FLightItemInResultScreen } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { NextStepText } from './next-step-text';

type Props = Pick<FLightItemInResultScreen, 'Type'>;

export const SeparatorListFlight = memo(({ Type }: Props) => {
  switch (Type) {
    case 'Continue':
      return <NextStepText />;

    case 'Empty':
      return (
        <EmptyList
          style={{ height: 500 }}
          image="img_empty_total"
          imageStyle={{ width: 234, height: 132 }}
        />
      );

    // default:
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   //@ts-ignore
    //   return <SeparatorMultiFlight type={Type} />;
  }
}, isEqual);
