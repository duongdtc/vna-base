import { Block, Text } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FilterButton } from './filter-button';
import { SortButton } from './sort-button';
import { translate } from '@vna-base/translations/translate';
import { useSelector } from 'react-redux';
import { selectResultFilterPolicy } from '@vna-base/redux/selector';

type Props = { showFilterBottomSheet: () => void };

export const FilterBar = memo(({ showFilterBottomSheet }: Props) => {
  const { totalItem } = useSelector(selectResultFilterPolicy);

  return (
    <Block borderTopWidth={3} borderColorTheme="neutral200" paddingBottom={2}>
      <Block colorTheme="neutral100" flexDirection="row" alignItems="center">
        <Block flex={1} paddingLeft={12}>
          <Text fontStyle="Body16Reg" colorTheme="neutral800">
            {translate('policy:total')}
            {': '}
            <Text
              fontStyle="Title16Bold"
              colorTheme="primary600"
              text={totalItem.toString()}
            />{' '}
            {translate('policy:items')}
          </Text>
        </Block>
        <FilterButton showFilterBottomSheet={showFilterBottomSheet} />
        <SortButton />
      </Block>
    </Block>
  );
}, isEqual);
