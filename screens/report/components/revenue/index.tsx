import { Block, Icon, Separator, Text } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useStyles } from './styles';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import dayjs from 'dayjs';
import { WindowWidth, abbreviationFare } from '@vna-base/utils';
import { useTheme } from '@theme';

const data: Array<{ revenue: number; date: string }> = [
  {
    revenue: 3_950_000,
    date: '2024-03-15T09:35:07.744Z',
  },
  {
    revenue: 2_900_000,
    date: '2024-03-16T09:35:07.744Z',
  },
  {
    revenue: 2_400_000,
    date: '2024-03-17T09:35:07.744Z',
  },
  {
    revenue: 2_600_000,
    date: '2024-03-18T09:35:07.744Z',
  },
  {
    revenue: 1_800_000,
    date: '2024-03-19T09:35:07.744Z',
  },
];

export const Revenue = memo(() => {
  const { colors } = useTheme();
  const styles = useStyles();

  const lineData: Array<lineDataItem> = data.map(d => ({
    value: d.revenue,
    label: dayjs(d.date).format('DD/MM'),
  }));

  return (
    <Block colorTheme="neutral100">
      <Pressable style={styles.headerContainer}>
        <Text
          t18n="report:revenue"
          fontStyle="Title16Semi"
          colorTheme="neutral900"
        />
        <Icon
          icon="arrow_ios_right_outline"
          size={20}
          colorTheme="neutral900"
        />
      </Pressable>
      <Separator type="horizontal" />
      <Block
        paddingVertical={14}
        paddingHorizontal={8}
        height={256}
        overflow="hidden">
        <LineChart
          height={200}
          width={WindowWidth - 78}
          initialSpacing={32}
          data={lineData}
          spacing={64}
          thickness={2}
          curved
          verticalLinesThickness={1}
          verticalLinesColor={colors.neutral200}
          verticalLinesStrokeDashArray={[10, 6]}
          showVerticalLines
          yAxisColor={colors.neutral500}
          xAxisColor={colors.neutral500}
          color={colors.primary500}
          noOfSections={4}
          hideDataPoints
          yAxisLabelTexts={[
            '0',
            abbreviationFare(Math.round(3_950_000 * 0.25)),
            abbreviationFare(Math.round(3_950_000 * 0.5)),
            abbreviationFare(Math.round(3_950_000 * 0.75)),
            abbreviationFare(3_950_000),
          ]}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.xAxisTextStyle}
        />
      </Block>
    </Block>
  );
}, isEqual);
