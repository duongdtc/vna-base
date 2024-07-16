/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Switch as SwitchBase, Text } from '@components';
import { CommonProps, Switch as SwitchType } from '@components/row/type';
import { getStyle, useTheme } from '@theme';
import React from 'react';
import { Pressable } from 'react-native';

export function Switch({
  value,
  t18n,
  disable,
  titleFontStyle,
  colorTheme = 'neutral100',
  paddingHorizontal = 16,
  onChange,
}: SwitchType & CommonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      disabled={disable}
      onPress={() => {
        onChange?.(!value);
      }}
      style={[
        {
          paddingVertical: 20,
          backgroundColor: colors[colorTheme],
        },
        getStyle({ paddingHorizontal }),
      ]}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text
            t18n={t18n}
            fontStyle={titleFontStyle ?? 'Body16Reg'}
            colorTheme="neutral900"
          />
        </Block>
        {/* @ts-ignore */}
        <SwitchBase value={value} disable opacity={disable ? 0.4 : 1} />
      </Block>
    </Pressable>
  );
}
