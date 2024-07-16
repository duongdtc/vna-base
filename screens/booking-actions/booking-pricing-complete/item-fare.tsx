/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Block, Separator, Text } from '@vna-base/components';
import { arrFees } from '@vna-base/screens/flight/info-ticket/components/type';
import { FarePax } from '@services/axios/axios-ibe';
import { I18nKeys } from '@translations/locales';
import cloneDeep from 'lodash.clonedeep';
import React from 'react';

type Props = {
  infoPax: FarePax;
};

export const ItemFareInfo = (props: Props) => {
  const { infoPax } = props;

  const _infoPax = cloneDeep(infoPax);

  let _renderPaxType: I18nKeys = 'flight:adult';

  switch (_infoPax.PaxType) {
    case 'CHD':
      _renderPaxType = 'flight:children';
      break;
    case 'INF':
      _renderPaxType = 'flight:infant';
      break;
  }

  const _renderTitleFee = (codeFee: string) => {
    return arrFees.find(f => f.code === codeFee)?.t18n;
  };

  return (
    <Block
      borderRadius={12}
      padding={12}
      overflow="hidden"
      shadow="small"
      colorTheme="neutral100"
      borderColorTheme="neutral200"
      borderWidth={10}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n={_renderPaxType}
          fontStyle="Title16Bold"
          colorTheme="primary500"
        />
        <Block
          flexDirection="row"
          alignItems="center"
          paddingHorizontal={8}
          paddingVertical={4}
          columnGap={2}
          borderRadius={4}
          colorTheme="primary500">
          <Text
            fontStyle="Body12Reg"
            colorTheme="neutral100"
            t18n="input_info_passenger:count"
          />
          <Text
            fontStyle="Body14Semi"
            colorTheme="neutral100"
            text={String(_infoPax.PaxNumb ?? 0)}
          />
        </Block>
      </Block>
      <Separator type="horizontal" marginVertical={16} />
      {infoPax.ListFareItem?.map((item, index) => {
        return (
          <Block
            key={index}
            flexDirection="row"
            alignItems="center"
            marginTop={index !== 0 ? 12 : 0}
            justifyContent="space-between">
            <Text
              fontStyle="Body14Reg"
              colorTheme="neutral800"
              t18n={_renderTitleFee(item.Code!)}
            />
            <Text
              fontStyle="Body14Semi"
              colorTheme="neutral900"
              text={item.Amount?.currencyFormat() as string}
            />
          </Block>
        );
      })}
      <Block
        flexDirection="row"
        alignItems="center"
        marginTop={12}
        justifyContent="space-between">
        <Text
          fontStyle="Body14Semi"
          colorTheme="neutral800"
          t18n="input_info_passenger:total_one_passenger"
        />
        <Text
          fontStyle="Body14Semi"
          colorTheme="price"
          text={(_infoPax.TotalFare ?? 0).currencyFormat()}
        />
      </Block>
    </Block>
  );
};
