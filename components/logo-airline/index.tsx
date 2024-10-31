import { images } from '@assets/image';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { Image } from '../image';

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
        <Image
          source={images.logo_vna}
          style={{ width: scale(size), height: scale(size) }}
        />
      </View>
    );
  },
  isEqual,
);
