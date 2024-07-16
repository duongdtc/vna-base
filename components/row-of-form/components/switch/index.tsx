/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Switch as SwitchBase, Text } from '@vna-base/components';
import {
  CommonProps,
  Switch as SwitchType,
} from '@vna-base/components/row-of-form/type';
import { getStyle, useTheme } from '@theme';
import React from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';

export function Switch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  t18n,
  isRequire,
  hideBottomSheet,
  disable,
  titleFontStyle,
  colorTheme = 'neutral100',
  paddingHorizontal = 16,
}: SwitchType & CommonProps<TFieldValues, TName>) {
  const { colors } = useTheme();
  const {
    field: { value, onChange },
  } = useController({
    control: control,
    name: name,
  });

  return (
    <Pressable
      disabled={disable}
      onPress={() => {
        onChange(!value);
        hideBottomSheet?.();
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
          {isRequire && (
            <Text text="*" fontStyle="Body16Reg" colorTheme="error500" />
          )}
        </Block>
        {/* @ts-ignore */}
        <SwitchBase value={value} disable opacity={disable ? 0.4 : 1} />
      </Block>
    </Pressable>
  );
}
