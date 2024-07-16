import { Block } from '@vna-base/components';
import { useTheme } from '@theme';
import { WindowWidth, scale } from '@vna-base/utils';
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

export const SkeletonItem = () => {
  const { dark } = useTheme();

  return (
    <Block colorTheme="neutral100" padding={12}>
      <ContentLoader
        speed={1}
        width={WindowWidth - 48}
        height={scale(158)}
        backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
        foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
        <Rect x={0} y={0} width={WindowWidth - 144} height={scale(22)} />
        <Rect x={WindowWidth - 125} y={0} width={112} height={scale(22)} />

        <Rect x={0} y={36} width={16} height={18} />
        {/* <Rect x={20} y={36} width={106} height={18} /> */}
        <Rect x={20} y={36} width={90} height={18} />
        <Rect x={132} y={36} width={WindowWidth - 132} height={18} />

        <Rect x={0} y={62} width={16} height={18} />
        {/* <Rect x={20} y={62} width={106} height={18} /> */}
        <Rect x={20} y={62} width={90} height={18} />
        {/* <Rect x={132} y={62} width={WindowWidth - 132} height={18} /> */}
        <Rect x={132} y={62} width={70} height={18} />

        <Rect x={0} y={88} width={16} height={18} />
        {/* <Rect x={20} y={88} width={106} height={18} /> */}
        <Rect x={20} y={88} width={98} height={18} />
        <Rect x={132} y={88} width={WindowWidth - 132} height={18} />

        <Rect x={0} y={114} width={16} height={18} />
        {/* <Rect x={20} y={114} width={106} height={18} /> */}
        <Rect x={20} y={114} width={88} height={18} />
        {/* <Rect x={132} y={114} width={WindowWidth - 132} height={18} /> */}
        <Rect x={132} y={114} width={120} height={18} />

        <Rect x={0} y={140} width={16} height={18} />
        {/* <Rect x={20} y={140} width={106} height={18} /> */}
        <Rect x={20} y={140} width={86} height={18} />
        {/* <Rect x={132} y={140} width={WindowWidth - 132} height={18} /> */}
        <Rect x={132} y={140} width={100} height={18} />
      </ContentLoader>
    </Block>
  );
};
