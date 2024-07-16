import { Block } from '@vna-base/components';
import { useTheme } from '@theme';
import { scale, WindowWidth } from '@vna-base/utils';
import React, { memo } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import isEqual from 'react-fast-compare';

export const Skeleton = memo(() => {
  const { dark } = useTheme();

  return (
    <Block colorTheme="neutral100" paddingVertical={12} paddingHorizontal={16}>
      <ContentLoader
        speed={1}
        width={WindowWidth - 24}
        height={scale(62)}
        backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
        foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
        <Rect x={0} y={0} width={120} height={18} />
        <Rect x={WindowWidth - 24 - 96} y={3} width={96} height={12} />
        <Rect x={0} y={30} width={28} height={28} />
        <Rect x={36} y={26} width={186} height={16} />
        <Rect x={36} y={44} width={100} height={18} />

        <Rect x={WindowWidth - 24 - 96} y={28} width={96} height={16} />
        <Rect x={WindowWidth - 24 - 96} y={48} width={150} height={12} />
      </ContentLoader>
    </Block>
  );
}, isEqual);
