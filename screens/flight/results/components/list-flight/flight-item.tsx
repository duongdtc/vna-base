/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { selectIsCryptic } from '@redux-selector';

import { FlightItemProps } from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { MinimizeSingleFlightItem } from './minimize-single-flight-item';
import { SingleFlightItem } from './single-flight-item';

export const FlightItem = memo((props: FlightItemProps) => {
  const isCryptic = useSelector(selectIsCryptic);

  if (isCryptic) {
    return <MinimizeSingleFlightItem {...props} />;
  }

  return <SingleFlightItem {...props} />;
}, isEqual);
