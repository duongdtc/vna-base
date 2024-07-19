import { Block, Icon, Separator, Text } from '@vna-base/components';
import { Colors, useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, WindowWidth, abbreviationFare } from '@vna-base/utils';
import React, { memo, useCallback, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { LayoutAnimation, Pressable, Text as TextBase } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { useStyles } from './styles';

const data: Array<{
  revenue: number;
  colorTheme: keyof Colors;
  name: string;
}> = [
  {
    revenue: 826_000,
    colorTheme: 'primary500',
    name: 'Tên loại asdf asdf asdfkh 1',
  },
  {
    revenue: 1_262_000,
    colorTheme: 'secondary500',
    name: 'Tên loại kh 2',
  },
  {
    revenue: 2_492_000,
    colorTheme: 'success500',
    name: 'Tên loại kh 3',
  },
  {
    revenue: 2_354_000,
    colorTheme: 'info500',
    name: 'Tên loại kh 4',
  },
  {
    revenue: 1_962_000,
    colorTheme: 'warning500',
    name: 'Tên loại kh 5',
  },
  {
    revenue: 2_492_000,
    colorTheme: 'error500',
    name: 'Tên loại kh 6',
  },
];

export const SalesReport = memo(() => {
  const styles = useStyles();
  const { colors } = useTheme();
  const [isOpenFooter, setIsOpenFooter] = useState(false);

  const renderTopLabel = useCallback(
    (val: number) => (
      <TextBase style={styles.topLabelTxt}>{abbreviationFare(val)}</TextBase>
    ),
    [styles.topLabelTxt],
  );

  const barData = useMemo<Array<barDataItem>>(
    () =>
      data.map(kh => ({
        value: kh.revenue,
        frontColor: colors[kh.colorTheme],
        topLabelComponent: () => {
          return renderTopLabel(kh.revenue);
        },
      })),
    [colors, renderTopLabel],
  );
  const toggleFooter = useCallback(() => {
    setIsOpenFooter(pre => !pre);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 140,
    });
  }, []);

  return (
    <Block colorTheme="neutral100">
      <Pressable style={styles.headerContainer}>
        <Text
          t18n="report:sales_report"
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
      <Block padding={12} rowGap={12}>
        <Block flexDirection="row" columnGap={8}>
          <Block
            flex={1}
            padding={8}
            rowGap={4}
            borderRadius={4}
            colorTheme="primary500">
            <Text
              text={translate('report:revenue') + ' (VND)'}
              fontStyle="Capture11Reg"
              colorTheme="white"
            />
            <Text
              text={(100_000_000).currencyFormat()}
              fontStyle="Body14Bold"
              colorTheme="white"
            />
          </Block>
          <Block
            flex={1}
            padding={8}
            rowGap={4}
            borderRadius={4}
            colorTheme="warning500">
            <Text
              text={translate('report:revenue') + ' (VND)'}
              fontStyle="Capture11Reg"
              colorTheme="white"
            />
            <Text
              text={(100_000_000).currencyFormat()}
              fontStyle="Body14Bold"
              colorTheme="white"
            />
          </Block>
          <Block
            flex={1}
            padding={8}
            rowGap={4}
            borderRadius={4}
            colorTheme="success500">
            <Text
              text={translate('report:revenue') + ' (VND)'}
              fontStyle="Capture11Reg"
              colorTheme="white"
            />
            <Text
              text={(100_000_000).currencyFormat()}
              fontStyle="Body14Bold"
              colorTheme="white"
            />
          </Block>
        </Block>
        <Block height={240} width={WindowWidth - 24} overflow="hidden">
          <BarChart
            barWidth={28}
            initialSpacing={16}
            spacing={32}
            noOfSections={4}
            data={barData}
            activeOpacity={1}
            hideYAxisText
            yAxisThickness={0}
            xAxisColor={colors.neutral200}
            marginLeft={0}
          />
        </Block>

        <Pressable
          hitSlop={HitSlop.Large}
          style={[
            styles.footerContainer,
            { height: isOpenFooter ? undefined : 16 },
          ]}
          onPress={toggleFooter}>
          <Block
            flex={1}
            flexDirection="row"
            columnGap={8}
            flexWrap="wrap"
            rowGap={6}>
            {data.map((kh, index) => {
              return (
                <Block
                  key={index}
                  flexDirection="row"
                  columnGap={4}
                  alignItems="center"
                  width={
                    data.length === 1
                      ? WindowWidth - 68
                      : (WindowWidth - 76) / 2
                  }>
                  <Block
                    colorTheme={kh.colorTheme}
                    width={12}
                    height={12}
                    borderRadius={2}
                  />
                  <Block flex={1}>
                    <Text
                      text={kh.name}
                      fontStyle="Body12Med"
                      colorTheme="neutral600"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    />
                  </Block>
                </Block>
              );
            })}
          </Block>
          <Icon
            icon={isOpenFooter ? 'arrow_ios_up_fill' : 'arrow_ios_down_fill'}
            size={20}
            colorTheme="neutral700"
          />
        </Pressable>
      </Block>
    </Block>
  );
}, isEqual);
