import { Block, Icon, Text } from '@vna-base/components';
import { History, HistoryChange } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Line, Svg } from 'react-native-svg';

type Props = {
  isShowDetail: boolean;
  item: History;
  historyChange: HistoryChange[];
  isShowBookingInfo: boolean;
};

export const DetailItemHistory = memo((props: Props) => {
  const { isShowDetail, historyChange, item, isShowBookingInfo } = props;
  const { colors } = useTheme();

  if (!isShowDetail) {
    return null;
  }

  return (
    <Block rowGap={12} marginTop={12}>
      {isShowBookingInfo && (
        <Block
          colorTheme="neutral50"
          borderRadius={4}
          rowGap={8}
          paddingBottom={8}>
          <Block
            justifyContent="center"
            columnGap={4}
            paddingTop={8}
            marginHorizontal={16}
            flexDirection="row">
            <Icon
              icon="message_circle_outline"
              size={12}
              colorTheme={item.Status ? 'success500' : 'error500'}
            />
            <Text
              text={item.Message as string}
              textAlign="center"
              numberOfLines={2}
              fontStyle="Capture11Reg"
              colorTheme={item.Status ? 'success500' : 'error500'}
            />
          </Block>
          {item.BookingCode && item.System && item.Airline && (
            <>
              <Block height={1} width={'100%'} colorTheme="neutral200" />
              <Block
                flexDirection="row"
                alignItems="center"
                paddingHorizontal={12}
                justifyContent="space-between">
                <Text fontStyle="Body12Med" colorTheme="neutral600">
                  {'Booking: '}
                  <Text
                    text={item.BookingCode ?? 'N/A'}
                    fontStyle="Body12Bold"
                    colorTheme="neutral900"
                  />
                </Text>
                <Svg height={'100%'} width={1}>
                  <Line
                    x1={1}
                    y1={0}
                    x2={1}
                    y2={'100%'}
                    stroke={colors.neutral300}
                    strokeDasharray="4, 2"
                    strokeWidth={1}
                  />
                </Svg>
                <Text fontStyle="Body12Med" colorTheme="neutral600">
                  {'Airline: '}
                  <Text
                    text={item.Airline ?? 'N/A'}
                    fontStyle="Body12Bold"
                    colorTheme="neutral900"
                  />
                </Text>
                <Svg height={'100%'} width={1}>
                  <Line
                    x1={1}
                    y1={0}
                    x2={1}
                    y2={'100%'}
                    stroke={colors.neutral300}
                    strokeDasharray="4, 2"
                    strokeWidth={1}
                  />
                </Svg>
                <Text fontStyle="Body12Med" colorTheme="neutral600">
                  {'System: '}
                  <Text
                    text={item.System ?? 'N/A'}
                    fontStyle="Body12Bold"
                    colorTheme="neutral900"
                  />
                </Text>
              </Block>
            </>
          )}
        </Block>
      )}
      <Block colorTheme="neutral50" borderRadius={4}>
        {historyChange?.length > 0
          ? historyChange?.map((itemChange, index) => {
              return (
                <Block key={index}>
                  {index !== 0 && (
                    <Block width={'100%'} height={1} colorTheme="neutral200" />
                  )}
                  {index === 0 && (
                    <Block
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      paddingHorizontal={12}
                      paddingTop={8}>
                      <Text
                        t18n="agent_detail:old_value"
                        fontStyle="Body12Med"
                        colorTheme="neutral600"
                      />
                      <Text
                        t18n="agent_detail:new_value"
                        fontStyle="Body12Med"
                        colorTheme="neutral600"
                      />
                    </Block>
                  )}
                  <Block
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal={12}
                    paddingVertical={8}>
                    <Block flex={1}>
                      <Text
                        text={itemChange.PropertyName as string}
                        fontStyle="Body12Med"
                        colorTheme="neutral600"
                      />
                      <Text
                        text={itemChange.OldValue ?? 'N/A'}
                        numberOfLines={1}
                        fontStyle="Body12Reg"
                        colorTheme="neutral900"
                      />
                    </Block>
                    <Svg height={'100%'} width={1}>
                      <Line
                        x1={1}
                        y1={0}
                        x2={1}
                        y2={'100%'}
                        stroke={colors.neutral300}
                        strokeDasharray="4, 2"
                        strokeWidth={1}
                      />
                    </Svg>
                    <Block flex={1} alignItems="flex-end" marginLeft={8}>
                      <Text
                        text={itemChange.PropertyName as string}
                        fontStyle="Body12Med"
                        colorTheme="neutral900"
                      />
                      <Text
                        text={itemChange.NewValue ?? 'N/A'}
                        numberOfLines={1}
                        fontStyle="Body12Med"
                        colorTheme="success600"
                      />
                    </Block>
                  </Block>
                </Block>
              );
            })
          : !isShowBookingInfo && (
              <Block paddingHorizontal={12} paddingVertical={8}>
                <Text
                  t18n="error:404"
                  textAlign="center"
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
                />
              </Block>
            )}
      </Block>
    </Block>
  );
}, isEqual);
