import { Block, Button } from '@vna-base/components';
import React, { memo } from 'react';
import { DotStarFilter } from './dot-star-filter';

type Props = {
  showFilterBottomSheet: () => void;
};

export const FilterButton = memo(
  ({ showFilterBottomSheet }: Props) => {
    return (
      <Block>
        <DotStarFilter />
        <Button
          leftIcon="filter_fill"
          leftIconSize={24}
          textColorTheme="neutral800"
          onPress={showFilterBottomSheet}
          padding={12}
        />
      </Block>
    );
  },
  () => true,
);
