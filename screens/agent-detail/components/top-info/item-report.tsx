import { Block, Icon, LinearGradient, Text } from '@vna-base/components';
import {
  ListKeyFlReport,
  ReportAgt,
} from '@vna-base/screens/agent-detail/type';
import { translate } from '@vna-base/translations/translate';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  item: ReportAgt;
};

export const ItemReportAgt = (props: Props) => {
  const { item } = props;

  return (
    <Block
      width={124}
      height={50}
      borderRadius={8}
      colorTheme="neutral50"
      padding={8}
      borderWidth={5}
      rowGap={4}
      borderColorTheme="neutral200"
      overflow="hidden">
      {item.key === ListKeyFlReport.ORDERS && (
        <LinearGradient style={StyleSheet.absoluteFillObject} type="gra5" />
      )}
      {item.key === ListKeyFlReport.SALES && (
        <LinearGradient style={StyleSheet.absoluteFillObject} type="gra6" />
      )}
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          text={translate(item.t18n).toUpperCase()}
          fontStyle="Capture11Reg"
          colorTheme={
            item.key === ListKeyFlReport.ORDERS ||
            item.key === ListKeyFlReport.SALES
              ? 'white'
              : 'neutral800'
          }
        />
        <Icon
          icon="external_link_fill"
          size={12}
          colorTheme={
            item.key === ListKeyFlReport.ORDERS ||
            item.key === ListKeyFlReport.SALES
              ? 'white'
              : 'neutral800'
          }
        />
      </Block>
      <Block flexDirection="row" alignItems="center" columnGap={4}>
        <Text
          text={item.totalCount}
          fontStyle="Title16Bold"
          colorTheme={
            item.key === ListKeyFlReport.ORDERS ||
            item.key === ListKeyFlReport.SALES
              ? 'classicWhite'
              : 'neutral900'
          }
        />
        <Text
          t18n={item.currency}
          fontStyle="Title16Bold"
          colorTheme={
            item.key === ListKeyFlReport.ORDERS ||
            item.key === ListKeyFlReport.SALES
              ? 'classicWhite'
              : 'neutral900'
          }
        />
      </Block>
    </Block>
  );
};
