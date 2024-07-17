/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Block, Separator, Text } from '@vna-base/components';
import { selectCustomFeeTotal, selectLanguage } from '@vna-base/redux/selector';
import { ApplyFlightFee, ApplyPassengerFee } from '@vna-base/screens/flight/type';
import { FareOption, FarePax } from '@services/axios/axios-ibe';
import { I18nKeys } from '@translations/locales';
import { convertStringToNumber, PassengerType } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { arrFees } from './type';

type Props = {
  infoPax: FarePax;
  widthItem: number | undefined;
  listFareItem: Array<string>;
};

export const ItemTicketInfo = (props: Props) => {
  const { infoPax, widthItem, listFareItem } = props;
  const lng = useSelector(selectLanguage);

  const customFee = useSelector(selectCustomFeeTotal);

  const _listFareItem = [...listFareItem];
  const _infoPax = cloneDeep(infoPax);
  let totalCustomFee = 0;

  if (
    customFee &&
    customFee[infoPax.PaxType as keyof typeof PassengerType] !== '' &&
    customFee[infoPax.PaxType as keyof typeof PassengerType] !== '0' &&
    customFee.applyFLight !== ApplyFlightFee.All
  ) {
    _listFareItem.push('CUSTOM_FEE');

    if (customFee.applyPassenger === ApplyPassengerFee.PerPassenger) {
      totalCustomFee =
        convertStringToNumber(
          customFee[infoPax.PaxType as keyof typeof PassengerType],
        ) * (_infoPax.ListFareInfo?.length ?? 1);
    } else {
      totalCustomFee = Math.round(
        convertStringToNumber(
          customFee[infoPax.PaxType as keyof typeof PassengerType],
        ) / (_infoPax.PaxNumb ?? 1),
      );
    }

    _infoPax.ListFareItem?.push({
      Amount: totalCustomFee,
      Code: 'CUSTOM_FEE',
    });
  }

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

  const calSeatLeftText = useCallback(
    (fo: FareOption) => {
      if ((fo.Availability ?? 0) > 0) {
        return (
          <Text
            fontStyle="Capture11Reg"
            colorTheme="neutral800"
            textAlign="center">
            {lng === 'vi' ? 'Còn ' : ''}
            <Text
              text={Number(
                fo.Availability,
                // fo.ListFarePax![0].ListFareInfo![0].Availability,
              ).toString()}
              fontStyle="Capture11Bold"
              colorTheme="primary500"
            />
            {lng === 'vi' ? ' chỗ' : ' seats left'}
          </Text>
        );
      }

      if (!fo.Unavailable && fo.Availability === 0) {
        return (
          <Text
            textAlign="center"
            fontStyle="Capture11Reg"
            colorTheme="neutral800"
            t18n="common:available_seat"
          />
        );
      }

      return (
        <Text
          fontStyle="Capture11Reg"
          colorTheme="error500"
          t18n="common:no_seats_available"
          textAlign="center"
        />
      );
    },
    [lng],
  );

  return (
    <Block
      colorTheme="neutral100"
      padding={12}
      borderRadius={10}
      width={widthItem ?? undefined}
      minWidth={320}>
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
            colorTheme="neutral100_old"
            t18n="input_info_passenger:count"
          />
          <Text
            fontStyle="Body14Semi"
            colorTheme="neutral100_old"
            text={String(_infoPax.PaxNumb ?? 0)}
          />
        </Block>
      </Block>
      <Separator type="horizontal" marginVertical={16} />
      {_listFareItem.map((key, index) => {
        const i = _infoPax.ListFareItem!.findIndex(
          fareItem => fareItem.Code === key,
        );
        if (i === -1) {
          return (
            <Block key={index} marginTop={index !== 0 ? 12 : 0} height={19} />
          );
        }

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
              t18n={_renderTitleFee(_infoPax.ListFareItem![i].Code!)}
            />
            <Text
              fontStyle="Body14Semi"
              colorTheme="neutral900"
              text={
                _infoPax.ListFareItem![i].Amount?.currencyFormat() as string
              }
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
          text={((_infoPax.TotalFare ?? 0) + totalCustomFee).currencyFormat()}
        />
      </Block>
      <Separator type="horizontal" marginVertical={16} />
      {_infoPax.ListFareInfo?.map((inf, idx) => {
        return (
          <Block key={idx}>
            {idx !== 0 && <Separator type="horizontal" marginVertical={16} />}
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Text
                fontStyle="Body14Semi"
                colorTheme="primary900"
                text={inf.StartPoint + ' -> ' + inf.EndPoint}
              />
              {calSeatLeftText(inf)}
            </Block>
            <Separator type="horizontal" marginVertical={16} />
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-around">
              <Block
                flex={1}
                borderRightWidth={5}
                paddingRight={12}
                rowGap={8}
                borderColorTheme="neutral50">
                <Block
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                    t18n="flight:hand_baggage"
                  />
                  <Text
                    fontStyle="Body14Semi"
                    colorTheme="primary900"
                    text={
                      (inf.HandBaggage !== ('' || null)
                        ? inf.HandBaggage
                        : 'N/A') as string
                    }
                  />
                </Block>
                <Block
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                    t18n="flight:free_baggage"
                  />
                  <Text
                    fontStyle="Body14Semi"
                    colorTheme="primary900"
                    text={
                      (inf.FreeBaggage !== ('' || null)
                        ? inf.FreeBaggage
                        : 'N/A') as string
                    }
                  />
                </Block>
              </Block>

              <Block
                flex={1}
                paddingLeft={12}
                borderLeftWidth={5}
                rowGap={8}
                borderColorTheme="neutral50">
                <Block
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                    t18n="flight:fare_class"
                  />
                  <Block width={'60%'}>
                    <Text
                      numberOfLines={1}
                      fontStyle="Body14Semi"
                      colorTheme="primary900"
                      text={
                        (inf.FareClass !== ('' || null)
                          ? inf.FareClass
                          : 'N/A') as string
                      }
                    />
                  </Block>
                </Block>
                <Block
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                    t18n="flight:type_price"
                  />
                  <Block width={'60%'}>
                    <Text
                      numberOfLines={1}
                      fontStyle="Body14Semi"
                      colorTheme="primary900"
                      text={
                        (inf.FareBasis !== ('' || null)
                          ? inf.FareBasis
                          : 'N/A') as string
                      }
                    />
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        );
      })}
    </Block>
  );
};
