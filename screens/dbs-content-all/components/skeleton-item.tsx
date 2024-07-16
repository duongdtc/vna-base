import { Block } from '@vna-base/components';
import { useTheme } from '@theme';
import { WindowWidth, scale } from '@vna-base/utils';
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

type Props = {
  isNews?: boolean;
};

export const SkeletonItem = (props: Props) => {
  const { dark } = useTheme();
  const { isNews } = props;

  return (
    <Block colorTheme="neutral100" borderRadius={12} overflow="hidden">
      {isNews ? (
        <ContentLoader
          speed={1}
          width={(WindowWidth - 48) / 2}
          height={scale(176)}
          backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
          foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
          <Rect
            x={0}
            y={0}
            width={(WindowWidth - 48) / 2}
            height={scale(176)}
          />
        </ContentLoader>
      ) : (
        <ContentLoader
          speed={1}
          width={WindowWidth - 32}
          height={scale(170)}
          backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
          foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
          <Rect x={0} y={0} width={WindowWidth - 32} height={scale(170)} />
        </ContentLoader>
      )}
    </Block>
  );
};
