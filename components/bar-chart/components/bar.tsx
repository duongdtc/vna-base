import { Block } from '@components/block';
import { Text } from '@components/text';
import React from 'react';
import { Pressable } from 'react-native';
import { BarProps } from '../type';
import { WIDTH_BAR, WIDTH_BAR_CONTAINER } from '..';
import { abbreviationFare } from '@utils';

export const Bar = ({
  onPress,
  index,
  colorTheme,
  DD,
  dd,
  height,
  value,
}: BarProps) => {
  return (
    <Pressable
      style={{ alignItems: 'center', justifyContent: 'flex-end' }}
      onPress={() => {
        onPress(index);
      }}>
      <Text
        text={abbreviationFare(value)}
        colorTheme="neutral700"
        fontStyle="Body10Semi"
      />
      <Block
        colorTheme={colorTheme}
        width={WIDTH_BAR}
        marginHorizontal={8}
        height={height}
      />
      <Block
        borderBottomRadius={4}
        colorTheme="primary50"
        width={WIDTH_BAR_CONTAINER - 4}
        paddingTop={2}
        paddingBottom={2}>
        <Text
          text={DD}
          textAlign="center"
          colorTheme="neutral900"
          fontStyle="Body14Semi"
        />
        <Text
          text={dd}
          textAlign="center"
          colorTheme="neutral700"
          fontStyle="Capture11Bold"
        />
      </Block>
    </Pressable>
  );
};
