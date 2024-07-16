/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block } from '@vna-base/components/block';
import { getStyle } from '@theme';
import { HairlineWidth } from '@utils';
import React, { memo, useMemo, useState } from 'react';
import { LayoutRectangle } from 'react-native';
import { SeparatorProps } from './type';

export const Separator = memo(
  (props: SeparatorProps) => {
    const {
      type,
      height,
      width,
      colorTheme = 'neutral50',
      size = 2,
      usePercent = false,
      ...subProps
    } = props;

    const [dimension, setDimension] = useState<LayoutRectangle>();

    const styleContainer = useMemo(() => {
      const styles = [];
      if (type === 'horizontal') {
        styles.push({ width: '100%' });
      } else {
        styles.push({ height: '100%' });
      }

      const temp = getStyle({ height, width });

      return styles.concat(temp);
    }, [height, type, width]);

    return (
      <Block
        {...subProps}
        //@ts-ignore
        style={styleContainer}
        onLayout={e => {
          setDimension(e.nativeEvent.layout);
        }}>
        {type === 'vertical' ? (
          <Block
            width={HairlineWidth * size}
            height={usePercent ? '100%' : dimension?.height ?? 0}
            colorTheme={colorTheme}
          />
        ) : (
          <Block
            colorTheme={colorTheme}
            height={HairlineWidth * size}
            width={usePercent ? '100%' : dimension?.width ?? 0}
          />
        )}
      </Block>
    );
  },
  () => true,
);
