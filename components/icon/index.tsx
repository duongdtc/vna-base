import React, { useMemo } from 'react';
import { StyleProp, TouchableOpacity } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { useStyles } from '@theme';
import { IconProps } from './type';
import { icons } from '@vna-base/assets/icon';

const SIZE = 24;

export const Icon = ({
  icon,
  color,
  colorTheme,
  onPress,
  size = SIZE,
  resizeMode = 'contain',
}: IconProps) => {
  // state

  const {
    theme: { colors },
  } = useStyles();

  // style
  const style = useMemo<StyleProp<ImageStyle>>(
    () => [{ width: size, height: size }],
    [size],
  );

  // render
  return (
    <TouchableOpacity
      disabled={typeof onPress !== 'function'}
      onPress={onPress}>
      <FastImage
        style={style}
        tintColor={colorTheme ? colors[colorTheme] : color}
        resizeMode={resizeMode}
        source={icons[icon]}
      />
    </TouchableOpacity>
  );
};
