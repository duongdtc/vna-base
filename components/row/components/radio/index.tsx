/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, RadioButton, Text } from '@components';
import { CommonProps, Radio as RadioType } from '@components/row-of-form/type';
import { useTheme } from '@theme';
import React from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';

export function Radio<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  t18n,
  isRequire,
  revertValue = false,
  sizeDot = 14,
  hideBottomSheet,
  disable,
  titleFontStyle,
  colorTheme = 'neutral100',
}: RadioType & CommonProps<TFieldValues, TName>) {
  const { colors } = useTheme();
  const {
    field: { value, onChange },
  } = useController({
    control: control,
    name: name,
  });

  return (
    <Pressable
      disabled={disable || revertValue !== value}
      onPress={() => {
        onChange(!value);
        hideBottomSheet?.();
      }}
      style={{
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: colors[colorTheme],
      }}>
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
        <RadioButton
          sizeDot={sizeDot}
          value={revertValue !== value}
          disable
          opacity={disable ? 0.4 : 1}
        />
      </Block>
    </Pressable>
  );
}
