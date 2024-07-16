import { Block } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { InfoCredit } from './info-credit';
import { ListReportAgent } from './list-report-agent';

export const TopInfo = memo(() => {
  return (
    <Block>
      <InfoCredit />
      <ListReportAgent />
    </Block>
  );
}, isEqual);
