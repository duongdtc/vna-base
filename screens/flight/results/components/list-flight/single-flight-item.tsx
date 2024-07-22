/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Icon,
  Text,
  LinearGradient as LinearGradientCustom,
} from '@vna-base/components';
import { LOGO_URL } from '@env';
import { FlightItemProps } from '@vna-base/screens/flight/type';
import { AircraftRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
import {
  ActiveOpacity,
  HitSlop,
  WindowWidth,
  convertMin2Hour,
  getFlightNumber,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Circle, Line, Svg, SvgUri } from 'react-native-svg';

export const SingleFlightItem = memo(
  ({ item, onPressItem, showFareOption }: FlightItemProps) => {
    const {
      styles,
      theme: { colors },
    } = useStyles(styleSheet);

    const realm = useRealm();

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

    const aircraftCode =
      item.ListFlightOption![0].ListFlight![0].ListSegment![0].Equipment;

    const aircraft = aircraftCode
      ? realm.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          aircraftCode,
        )
      : null;

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
        <View style={styles.header}>
          {item.Type && (
            <Block
              position="absolute"
              top={0}
              left={0}
              paddingHorizontal={8}
              style={{ borderBottomRightRadius: scale(8), overflow: 'hidden' }}
              paddingVertical={4}>
              <LinearGradientCustom
                type={item.Type === 'MinPrice' ? 'gra6' : 'graSuc'}
                style={StyleSheet.absoluteFill}
              />
              <Text
                text={item.Type === 'Fastest' ? 'Nhanh nhất' : 'Rẻ nhất'}
                fontStyle="Body10Semi"
                colorTheme="white"
              />
            </Block>
          )}
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
          <View
            style={[bs.flexRowAlignCenter, bs.columnGap_4, bs.justifyCenter]}>
            <Text
              text={getFlightNumber(
                item.ListFlightOption![0].ListFlight![0].ListSegment![0]
                  .Airline,
                item.ListFlightOption![0].ListFlight![0].ListSegment![0]
                  .FlightNumber,
              )}
              fontStyle="Body12Bold"
              colorTheme="neutral70"
            />
            <SvgUri
              width={16}
              height={16}
              uri={LOGO_URL + item.Airline + '.svg'}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              text={`${aircraft?.Manufacturer} ${aircraft?.Code}`}
              fontStyle="Body12Reg"
              colorTheme="neutral80"
            />
            <Icon
              icon="alert_circle_outline"
              size={12}
              colorTheme="neutral100"
            />
          </View>
        </View>
        <View style={[bs.flexDirectionRow, { width: '100%' }]}>
          <Svg height={16} style={{ width: '100%' }}>
            <Circle cx="0" cy="7.5" r="8" fill={colors.neutral30} />
            <Line
              key={Math.random()}
              x1={0}
              y1={7.5}
              x2={1000}
              y2={7.5}
              stroke={colors.neutral30}
              strokeDasharray="10, 4"
              strokeWidth={1}
            />
            <Circle
              cx={WindowWidth - 24}
              cy="7.5"
              r="8"
              fill={colors.neutral30}
            />
          </Svg>
        </View>
        <View style={styles.footer}>
          <Pressable
            style={[bs.flex]}
            hitSlop={HitSlop.Medium}
            onPress={() => {
              showFareOption(item, 'economy', showingFareOptionAndIndex.index);
            }}>
            <View
              style={[
                bs.alignCenter,
                bs.rowGap_4,
                bs.paddingVertical_4,
                bs.borderRadius_4,
                bs.overflowHidden,
              ]}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#003442', '#0080A3']}
                style={StyleSheet.absoluteFill}
              />

              <Text
                text="Phổ thông"
                colorTheme="white"
                fontStyle="Body14Semi"
              />
              <Text colorTheme="white" fontStyle="Body12Reg">
                Từ{' '}
                <Text
                  text={
                    item.ListFareOption[0].TotalFare.currencyFormat() + ' VND'
                  }
                  colorTheme="white"
                  fontStyle="Body12Bold"
                />
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[bs.flex]}
            hitSlop={HitSlop.Medium}
            onPress={() => {
              showFareOption(item, 'business', showingFareOptionAndIndex.index);
            }}>
            <View
              style={[
                bs.alignCenter,
                bs.rowGap_4,
                bs.paddingVertical_4,
                bs.borderRadius_4,
                bs.overflowHidden,
              ]}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#F6AB19', '#A97000']}
                style={StyleSheet.absoluteFill}
              />

              <Text
                text="Thương gia"
                colorTheme="white"
                fontStyle="Body14Semi"
              />
              <Text colorTheme="white" fontStyle="Body12Reg">
                Từ{' '}
                <Text
                  text={(12300000).currencyFormat() + ' VND'}
                  colorTheme="white"
                  fontStyle="Body12Bold"
                />
              </Text>
            </View>
          </Pressable>
        </View>
      </TouchableOpacity>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  container: {
    marginBottom: spacings[12],
    marginHorizontal: spacings[12],
    borderRadius: radius[8],
    overflow: 'hidden',
    backgroundColor: colors.neutral10,
  },
  header: {
    padding: spacings[20],
    paddingBottom: spacings[4],
    rowGap: spacings[20],
  },
  footer: {
    padding: spacings[10],
    paddingTop: spacings[2],
    columnGap: spacings[10],
    flexDirection: 'row',
  },
}));
