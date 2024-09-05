import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { InfoCredit } from './info-credit';

export const TopInfo = memo(() => {
  return <InfoCredit />;
}, isEqual);
