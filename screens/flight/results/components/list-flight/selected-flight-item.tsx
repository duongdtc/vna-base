/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { SelectedFlightItemProps } from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity, HitSlop, convertMin2Hour, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Line, Svg } from 'react-native-svg';

export const SelectedFlightItem = memo(
  ({
    item,
    index,
    onPressItem,
    reselect,
    showFareOption,
  }: SelectedFlightItemProps) => {
    const {
      styles,
      theme: { colors },
    } = useStyles(styleSheet);

    const showingFareOptionAndIndex = useMemo(() => {
      const index =
        item.ListFareOption?.findIndex(
          fo =>
            (fo.Availability ?? 0) > 0 ||
            (fo.Availability === 0 && !fo.Unavailable),
        ) ?? -1;

      return {
        index,
        fareOption: index !== -1 ? item.ListFareOption![index] : null,
      };
    }, [item.ListFareOption]);

    if (showingFareOptionAndIndex.index === -1) {
      return null;
    }

    const stopPoints =
      item.ListFlightOption![0].ListFlight![0].ListSegment?.flatMap(segment => {
        return segment.StopPoint ? [segment.StopPoint] : [];
      });

    return (
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => onPressItem(item, showingFareOptionAndIndex.index)}
        style={styles.container}>
        <Image
          style={StyleSheet.absoluteFill}
          source={images.Filght_Item}
          resizeMode="stretch"
        />
        <View style={styles.header}>
          <View style={[bs.flexRowAlignCenter, bs.columnGap_12]}>
            {/* xuất phát */}
            <View>
              <Text
                text={dayjs(
                  item.ListFlightOption[0]?.ListFlight[0]?.DepartDate,
                ).format('HH:mm')}
                fontStyle="H320Bold"
                colorTheme="primaryColor"
              />
              <Text
                text={item.ListFlightOption[0]?.ListFlight[0]?.StartPoint}
                fontStyle="Body14Med"
                colorTheme="neutral70"
              />
            </View>

            {/* Hành trình */}
            <View style={[bs.flex]}>
              <Text
                textAlign="center"
                text={convertMin2Hour(
                  Number(item.ListFlightOption![0].ListFlight![0].Duration),
                )}
                fontStyle="Body12Med"
                colorTheme="neutral70"
              />
              <View style={{ width: '100%', paddingVertical: 4 }}>
                <Svg height={16} style={{ width: '100%' }}>
                  <Line
                    key={Math.random()}
                    x1={0}
                    y1={7.5}
                    x2={1000}
                    y2={7.5}
                    stroke={colors.neutral50}
                    strokeDasharray="10, 4"
                    strokeWidth={1}
                  />
                </Svg>
              </View>
              <View
                style={[
                  bs.flexDirectionRow,
                  bs.columnGap_6,
                  {
                    justifyContent: 'space-around',
                  },
                ]}>
                {stopPoints?.length !== 0 ? (
                  stopPoints?.map((ap, idx) => (
                    <Text
                      key={idx}
                      text={ap}
                      fontStyle="Body12Reg"
                      colorTheme="neutral80"
                    />
                  ))
                ) : (
                  <Text
                    t18n="flight:direct_flight"
                    fontStyle="Body12Med"
                    colorTheme="neutral100"
                  />
                )}
              </View>
            </View>

            {/* đến */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text
                text={dayjs(
                  item.ListFlightOption[0]?.ListFlight[0]?.ArriveDate,
                ).format('HH:mm')}
                fontStyle="H320Bold"
                colorTheme="primaryColor"
              />
              <Text
                text={item.ListFlightOption[0]?.ListFlight[0]?.EndPoint}
                fontStyle="Body14Med"
                colorTheme="neutral70"
              />
            </View>
          </View>
        </View>
        <View style={[bs.flexDirectionRow, { width: '100%' }]}>
          <Svg
            height={14}
            style={{ width: '100%', marginHorizontal: scale(10) }}>
            <Line
              key={Math.random()}
              x1={0}
              y1={3.5}
              x2={1000}
              y2={3.5}
              stroke={colors.neutral30}
              strokeDasharray="10, 4"
              strokeWidth={1}
            />
          </Svg>
        </View>
        <View style={styles.footer}>
          <Block flex={1}>
            <Text colorTheme="neutral900" fontStyle="Body12Reg">
              {item.ListFareOption[0].FareFamily}{' '}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                colorTheme="neutral900"
                fontStyle="Body12Bold"
                text={`(${item.ListFareOption[0].FareClass})`}
              />
            </Text>
          </Block>
          <Block flexDirection="row" columnGap={4} alignItems="center">
            <Text colorTheme="price" fontStyle="Body16Semi">
              {item.ListFareOption[0].TotalFare?.currencyFormat()}{' '}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                colorTheme="neutral900"
                fontStyle="Body16Semi"
                text="VND"
              />
            </Text>
            <Pressable
              hitSlop={HitSlop.Large}
              onPress={() => {
                reselect(index);
              }}>
              <Icon icon="refresh_fill" size={20} colorTheme="success500" />
            </Pressable>
          </Block>
        </View>
      </TouchableOpacity>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ spacings, radius }) => ({
  container: {
    marginBottom: spacings[12],
    marginHorizontal: spacings[12],
    borderRadius: radius[4],
    overflow: 'hidden',
  },
  header: {
    padding: spacings[20],
    paddingBottom: spacings[4],
    rowGap: spacings[20],
  },
  footer: {
    padding: spacings[12],
    paddingTop: spacings[4],
    columnGap: spacings[10],
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
