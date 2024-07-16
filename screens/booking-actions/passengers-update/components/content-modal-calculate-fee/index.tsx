import { Block, LazyPlaceholder, Text } from '@vna-base/components';
import { selectIsLoadingPriceChangeFlight } from '@redux-selector';
import { CurrencyDetails, WindowWidth } from '@vna-base/utils';
import React from 'react';
import { useSelector } from 'react-redux';

export const ContentModalCalculateFee = () => {
  const isLoading = useSelector(selectIsLoadingPriceChangeFlight);

  if (isLoading) {
    return <LazyPlaceholder height={78} />;
  }

  return (
    <Block
      colorTheme="neutral100"
      borderRadius={12}
      paddingHorizontal={12}
      rowGap={12}
      width={WindowWidth - 48}
      alignSelf="center">
      <Block paddingHorizontal={12}>
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:be_rfnded"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text text="0" fontStyle="Body14Semi" colorTheme="success500" />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:fee_rfnd"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text text="0" fontStyle="Body14Semi" colorTheme="error500" />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:total_rfnd"
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
          <Text fontStyle="Title16Bold" colorTheme="success500">
            {'0 '}
            <Text
              t18n={CurrencyDetails.VND.symbol}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Text>
        </Block>
      </Block>
    </Block>
  );
};
