import { Block, Text } from '@vna-base/components';
import { Charge } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';

export type Props = {
  flightCharge: Charge;
  // modalFeeRef: React.RefObject<ModalFeeRef>;
  // onDelete: () => void;
};

export const ItemCharge = memo((props: Props) => {
  const {
    flightCharge,
    //  modalFeeRef,
    // onDelete,
  } = props;

  return (
    <Block key={flightCharge.Id} paddingHorizontal={16}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Block flex={1}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              t18n={flightCharge.PaxName as I18nKeys}
              fontStyle="Body12Med"
              colorTheme="neutral900"
            />
            {flightCharge.ChargeValue && (
              <Block height={'70%'} width={1} colorTheme="neutral200" />
            )}
            {flightCharge.ChargeValue && (
              <Text
                text={flightCharge.ChargeValue as string}
                fontStyle="Body12Reg"
                colorTheme="neutral800"
              />
            )}
          </Block>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Block flexDirection="row" alignItems="center">
              <Text
                text={`${flightCharge.StartPoint} - ${flightCharge.EndPoint}`}
                fontStyle="Body12Bold"
                colorTheme="success500"
              />
            </Block>
            <Block height={'70%'} width={1} colorTheme="neutral200" />
            <Text
              text={flightCharge.ChargeType as string}
              fontStyle="Body12Reg"
              colorTheme="neutral900"
            />
          </Block>
        </Block>
        <Block flex={1} alignItems="flex-end">
          <Block flexDirection="row" alignItems="center" columnGap={8}>
            <Text
              text={flightCharge.Amount?.currencyFormat()}
              fontStyle="Body14Bold"
              colorTheme="price"
            />
            {/* <Button
              hitSlop={HitSlop.Large}
              leftIcon="edit_2_outline"
              leftIconSize={16}
              textColorTheme="neutral900"
              onPress={() => {
                modalFeeRef.current?.show(flightCharge);
              }}
              disabled
              // disabled={
              //   FareCodeDetails[flightCharge.ChargeType as FareCode].isLock
              // }
              padding={4}
            />
            <Button
              hitSlop={HitSlop.Large}
              leftIcon="trash_2_outline"
              leftIconSize={16}
              textColorTheme={
                FareCodeDetails[flightCharge.ChargeType as FareCode].isLock
                  ? 'neutral900'
                  : 'error500'
              }
              onPress={onDelete}
              disabled
              // disabled={
              //   FareCodeDetails[flightCharge.ChargeType as FareCode].isLock
              // }
              padding={4}
            /> */}
          </Block>
        </Block>
      </Block>
    </Block>
  );
}, isEqual);
