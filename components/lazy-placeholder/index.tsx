import { Block } from '@components/block';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { LazyPlaceholderProps } from './type';
import { useTheme } from '@theme';

export const LazyPlaceholder = ({
  backgroundColorTheme,
  colorTheme = 'primary500',
  size = 'large',
  height = 100,
  ...blockProps
}: LazyPlaceholderProps) => {
  const { colors } = useTheme();

  return (
    <Block
      height={height}
      justifyContent="center"
      alignItems="center"
      colorTheme={backgroundColorTheme}
      {...blockProps}>
      <ActivityIndicator size={size} color={colors[colorTheme]} />
    </Block>
  );
};
