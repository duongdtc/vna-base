/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, Switch as SwitchBase, Text } from '@vna-base/components';
import {
  CommonProps,
  Switch as SwitchType,
} from '@vna-base/components/row/type';
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
  leftIcon,
  leftIconColorTheme = 'neutral100',
  leftIconSize = 24,
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
          {leftIcon && (
            <Icon
              icon={leftIcon}
              size={leftIconSize}
              colorTheme={leftIconColorTheme}
            />
          )}
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
