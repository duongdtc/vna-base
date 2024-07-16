import { LinearGradient, NormalHeader } from '@components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { StyleSheet, View } from 'react-native';
import { NormalHeaderType } from './type';

export const NormalHeaderGradient = memo(
  (
    props: NormalHeaderType & {
      gradientType?:
        | 'gra1'
        | 'gra2'
        | 'gra3'
        | 'gra4'
        | 'gra5'
        | 'gra6'
        | 'graPre'
        | 'graSuc';
    },
  ) => {
    const { gradientType = 'gra3', ...rest } = props;

    return (
      <View style={{ zIndex: 9 }}>
        <LinearGradient
          type={gradientType}
          style={StyleSheet.absoluteFillObject}
        />
        <NormalHeader {...rest} />
      </View>
    );
  },
  isEqual,
);
