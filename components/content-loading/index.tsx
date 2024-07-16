import { Block } from '@components';
import { useTheme } from '@theme';
import { scale } from '@utils';
import React, { memo } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useStyles } from './styles';
import { ContentLoadingProps } from './type';
import isEqual from 'react-fast-compare';

export const ContentLoading = memo(({ width }: ContentLoadingProps) => {
  const styles = useStyles();
  const { dark } = useTheme();

  return (
    <Block style={styles.container}>
      <ContentLoader
        speed={1}
        width={width}
        height={scale(82)}
        backgroundColor={!dark ? '#EBF2FC' : '#2C3E50'}
        foregroundColor={!dark ? '#BDC3C7' : '#F6FCFF'}>
        <Rect x={0} y={0} rx={0} ry={0} width={width} height={scale(20)} />
        <Rect
          x={0}
          y={scale(32)}
          rx={0}
          ry={0}
          width={scale(100)}
          height={scale(18)}
        />
        <Rect
          x={scale(100 + 36)}
          y={scale(32)}
          rx={0}
          ry={0}
          width={width - scale(100 + 36)}
          height={scale(12)}
        />
        <Rect
          x={0}
          y={scale(66)}
          rx={0}
          ry={0}
          width={scale(120)}
          height={scale(16)}
        />
        <Rect
          x={scale(120 + 44)}
          y={scale(49)}
          rx={0}
          ry={0}
          width={width - scale(120 + 44)}
          height={scale(18)}
        />
        <Rect
          x={scale(120 + 56)}
          y={scale(72)}
          rx={0}
          ry={0}
          width={width - scale(120 + 56)}
          height={scale(12)}
        />
      </ContentLoader>
    </Block>
  );
}, isEqual);
