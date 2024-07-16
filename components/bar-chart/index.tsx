import { Block } from '@vna-base/components/block';
import { useTheme } from '@theme';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { G, Line, Svg } from 'react-native-svg';
import { Bar } from './components';
import { BarChartProps } from './type';

export const WIDTH_BAR_CONTAINER = 44;
export const WIDTH_BAR = 28;
const NUM_DASH_LINE = 4;
const MAX_HEIGHT_BAR = 225;
const MARGIN_TOP_DASH_LINE = 60;
const FOOTER_HEIGHT = 34;

export const BarChart = memo((props: BarChartProps) => {
  const { colors } = useTheme();
  const { data, onPressBar } = props;

  const width = WIDTH_BAR_CONTAINER * data.length;

  const basePosition = MAX_HEIGHT_BAR;

  const maxValue = data.findMax('value').value;
  const minValue = data.findMin('value').value;

  const renderItem: ListRenderItem<{
    value: number;
    DD: string;
    dd: string;
  }> = ({ item, index }) => {
    const _height = Math.floor((MAX_HEIGHT_BAR * item.value) / maxValue);
    const isMin = minValue === item.value;

    return (
      <Bar
        {...item}
        index={index}
        onPress={onPressBar}
        colorTheme={isMin ? 'success500' : 'info500'}
        height={_height}
      />
    );
  };

  return (
    <Block paddingBottom={16}>
      <Block>
        <Block
          height={MAX_HEIGHT_BAR}
          position="absolute"
          zIndex={-1}
          style={{ top: MARGIN_TOP_DASH_LINE - FOOTER_HEIGHT }}
          left={0}>
          <Svg height={MAX_HEIGHT_BAR} width={width}>
            <G>
              {[...new Array(NUM_DASH_LINE + 1)].map((_, i) => {
                const y = (basePosition / NUM_DASH_LINE) * i;
                return (
                  <Line
                    key={Math.random()}
                    x1={0}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke={colors.neutral200}
                    strokeDasharray="10, 6"
                    strokeWidth={1}
                  />
                );
              })}
            </G>
          </Svg>
        </Block>
        <FlatList
          style={{ height: MAX_HEIGHT_BAR + MARGIN_TOP_DASH_LINE }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
        />
        {/* <Block
          height={height + 34}
          flexDirection="row"
          alignItems="flex-end"></Block> */}
      </Block>
    </Block>
  );
}, isEqual);
