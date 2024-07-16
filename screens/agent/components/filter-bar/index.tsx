import { Block, Text } from '@vna-base/components';
import { translate } from '@vna-base/translations/translate';
import React from 'react';
import { FilterButton } from './filter-button';
import { SortButton } from './sort-button';

export const FilterBar = ({ total }: { total: number }) => {
  return (
    <Block paddingBottom={1}>
      <Block
        colorTheme="neutral100"
        paddingHorizontal={12}
        borderTopWidth={10}
        borderColorTheme="neutral200"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        shadow=".3"
        columnGap={12}>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text
            text={translate('common:total') + ':'}
            fontStyle="Body16Reg"
            colorTheme="neutral800"
          />
          <Text
            text={total?.toString()}
            fontStyle="Title16Bold"
            colorTheme="primary600"
          />
          <Text
            t18n="booking:customer"
            fontStyle="Body16Reg"
            colorTheme="neutral800"
          />
        </Block>
        <Block flexDirection="row" alignItems="center" columnGap={12}>
          <FilterButton />
          <SortButton />
        </Block>
      </Block>
    </Block>
  );
};
