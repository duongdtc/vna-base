import { bs, useStyles } from '@theme';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { ColorValue, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NormalHeaderType } from './type';

export const NormalHeader = memo((props: NormalHeaderType) => {
  const {
    leftContent,
    rightContent,
    centerContent,
    zIndex = 9,
    leftContentStyle,
    style,
    shadow,
    colorTheme,
    ...rest
  } = props;
  const { top } = useSafeAreaInsets();
  const {
    theme: { colors, shadows },
  } = useStyles();

  return (
    <View
      style={[
        {
          paddingTop: top,
          zIndex: zIndex,
          backgroundColor: (colorTheme
            ? colors[colorTheme]
            : undefined) as ColorValue,
        },
        !!shadow && shadows[shadow],
        style,
      ]}
      {...rest}>
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          bs.padding_12,
          bs.flexDirectionRow,
        ]}>
        <View style={leftContentStyle}>{leftContent}</View>
        <View
          style={[StyleSheet.absoluteFill, { zIndex: -1 }, bs.contentCenter]}>
          {centerContent}
        </View>
        <View>{rightContent}</View>
      </View>
    </View>
  );
}, isEqual);
