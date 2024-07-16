import { IconTypes } from '@assets/icon';
import { Block, Icon, Text } from '@vna-base/components';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import React from 'react';

export const BalanceItem = ({
  icon,
  t18nTitle,
  value,
  valueColorTheme,
}: {
  icon: IconTypes;
  t18nTitle: I18nKeys;
  value: number;
  valueColorTheme: keyof Colors;
}) => {
  // render
  return (
    <Block
      paddingHorizontal={4}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center">
      <Block flexDirection="row" columnGap={2} alignItems="center">
        <Icon icon={icon} size={12} colorTheme="neutral800" />
        <Text t18n={t18nTitle} colorTheme="neutral800" fontStyle="Body12Reg" />
      </Block>
      <Text
        text={value.currencyFormat()}
        fontStyle="Body12Med"
        colorTheme={valueColorTheme}
      />
    </Block>
  );
};
