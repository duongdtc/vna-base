/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BarChart, Block } from '@vna-base/components';
import { MinPrice } from '@services/axios/axios-ibe';
import dayjs from 'dayjs';
import React from 'react';

export const Chart = ({
  minPrices,
  onPressBar,
}: {
  minPrices: Array<MinPrice>;
  onPressBar: (index: number) => void;
}) => {
  const _data = minPrices.map(minPrice => ({
    value:
      minPrice.ListFlightFare!.findMin('FareInfo.TotalFare').FareInfo!
        .TotalFare!,
    DD: dayjs(minPrice.DepartDate).format('DD'),
    dd: dayjs(minPrice.DepartDate).format('dd'),
  }));

  return (
    <Block paddingLeft={12} paddingRight={4}>
      <BarChart data={_data} onPressBar={onPressBar} />
    </Block>
  );
};
