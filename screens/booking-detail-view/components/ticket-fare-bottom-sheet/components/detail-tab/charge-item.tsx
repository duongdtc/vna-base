import { Block, Separator, Text } from '@vna-base/components';
import { Charge } from '@services/axios/axios-data';
import React from 'react';

type ChargeItemProps = Charge;

export const ChargeItem = (item: ChargeItemProps) => {
  if (!item.ChargeType) {
    return null;
  }

  return (
    <Block paddingHorizontal={16} paddingVertical={12} colorTheme="neutral100">
      <Block flexDirection="row" alignItems="center" columnGap={8}>
        <Block flex={1}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              text={item.PaxName?.toUpperCase()}
              fontStyle="Body12Med"
              colorTheme="neutral900"
              numberOfLines={1}
              ellipsizeMode="middle"
            />
            {item.ChargeValue && (
              <>
                <Separator type="vertical" size={3} colorTheme="neutral200" />
                <Block flexShrink={1}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    text={item.ChargeValue as string}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                </Block>
              </>
            )}
          </Block>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            {item.StartPoint && (
              <>
                <Text
                  text={`${item.StartPoint} - ${item.EndPoint}`}
                  fontStyle="Body12Bold"
                  colorTheme="success500"
                />
                <Separator type="vertical" size={3} colorTheme="neutral200" />
              </>
            )}
            <Text
              text={item.ChargeType as string}
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
          </Block>
        </Block>
        <Block alignItems="flex-end">
          <Block flexDirection="row" alignItems="center" columnGap={8}>
            <Text
              text={item.Amount?.currencyFormat()}
              fontStyle="Body14Bold"
              colorTheme="price"
            />
            {/* <Button
              hitSlop={HitSlop.Large}
              leftIcon="edit_2_outline"
              leftIconSize={16}
              textColorTheme="neutral900"
              onPress={() => {
                showFeeModal(item as Charge);
              }}
              disabled
              // disabled={FareCodeDetails[item.ChargeType as FareCode].isLock}
              padding={4}
            />
            <Button
              hitSlop={HitSlop.Large}
              leftIcon="trash_2_outline"
              leftIconSize={16}
              textColorTheme={
                FareCodeDetails[item.ChargeType as FareCode].isLock
                  ? 'neutral900'
                  : 'error500'
              }
              onPress={showConfirm}
              disabled
              // disabled={FareCodeDetails[item.ChargeType as FareCode].isLock}
              padding={4}
            /> */}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
