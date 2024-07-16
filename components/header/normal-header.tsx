import { bs } from '@theme';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { StyleSheet, View } from 'react-native';
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
    ...rest
  } = props;
  const { top } = useSafeAreaInsets();

  return (
    <View style={[{ paddingTop: top, zIndex: zIndex }, style]} {...rest}>
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
