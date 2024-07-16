import { Block } from '@vna-base/components';
import { useTheme } from '@theme';
import { WindowWidth } from '@vna-base/utils';
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

export const Skeleton = () => {
  const { dark } = useTheme();

  return (
    <Block padding={12} colorTheme="neutral100">
      <ContentLoader
        speed={1}
        width={WindowWidth - 24}
        height={86}
        backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
        foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
        <Rect x={0} y={0} width={200} height={38} />
        <Rect x={WindowWidth - 24 - 100} y={0} width={100} height={20} />
        <Rect x={0} y={50} width={140} height={36} />
        <Rect x={WindowWidth - 24 - 100} y={50} width={100} height={36} />
        {/* <Rect x={0} y={98} width={160} height={12} />
        <Rect
          x={WindowWidth - 24 - 140}
          y={98}
          rx={0}
          ry={0}
          width={140}
          height={12}
        /> */}
      </ContentLoader>
    </Block>
  );
};
