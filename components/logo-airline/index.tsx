import { LOGO_URL } from '@env';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

export type LogoAirlineProps = {
  size: number;
  radius?: number;
  airline: string;
};

export const LogoAirline = memo(
  ({ size, radius, airline }: LogoAirlineProps) => {
    return (
      <View
        style={{
          width: scale(size),
          height: scale(size),
          borderRadius: radius ? scale(radius) : undefined,
          overflow: 'hidden',
        }}>
        <SvgUri
          width={scale(size)}
          height={scale(size)}
          uri={LOGO_URL + airline + '.svg'}
        />
      </View>
    );
  },
  isEqual,
);
