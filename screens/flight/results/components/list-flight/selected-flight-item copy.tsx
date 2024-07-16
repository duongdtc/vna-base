/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon, Separator, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import {
  selectCustomFeeTotal,
  selectFareType,
  selectLanguage,
  selectMultiFlights,
} from '@redux-selector';
import { SelectedFlightItemProps } from '@vna-base/screens/flight/type';
import { FareOption } from '@services/axios/axios-ibe';
import { AircraftRealm, AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  CurrencyDetails,
  HitSlop,
  convertMin2Hour,
  getFlightNumber,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';

export const SelectedFlightItem = memo(
  ({ item, index, onPressItem, reselect }: SelectedFlightItemProps) => {
    const {
      styles,
      theme: { colors },
    } = useStyles(styleSheet);

    const fareType = useSelector(selectFareType);
    const multiFlight = useSelector(selectMultiFlights);
    const lng = useSelector(selectLanguage);
    const customFeeTotal = useSelector(selectCustomFeeTotal);

    const realm = useRealm();

    const calSeatLeftText = useCallback(
      (fo: FareOption) => {
        if ((fo.Availability ?? 0) > 0) {
          return (
            <Text
              fontStyle="Body10Reg"
              colorTheme="neutral80"
              textAlign="center">
              {lng === 'vi' ? 'Còn ' : ''}
              <Text
                text={Number(
                  fo.ListFarePax![0].ListFareInfo![0].Availability,
                ).toString()}
                fontStyle="Body10Bold"
                colorTheme="primaryColor"
              />
              {lng === 'vi' ? ' chỗ' : ' seats left'}
            </Text>
          );
        }

        if (!fo.Unavailable && fo.Availability === 0) {
          return (
            <Text
              textAlign="center"
              fontStyle="Body10Reg"
              colorTheme="neutral80"
              t18n="common:available_seat"
            />
          );
        }

        return (
          <Text
            fontStyle="Body10Reg"
            colorTheme="errorColor"
            t18n="common:no_seats_available"
            textAlign="center"
          />
        );
      },
      [lng],
    );

    if (!item) {
      return null;
    }

    const dataFlight = {
      departDate: item.ListFlightOption![0].ListFlight![0].DepartDate as string,
      arriveDate: item.ListFlightOption![0].ListFlight![0].ArriveDate as string,
      airline: realm.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        item.Airline!,
      ),
    };

    const fare =
      (item.ListFareOption![0][fareType!] ?? 0) + customFeeTotal[fareType!];

    const aircraftCode =
      item.ListFlightOption![0].ListFlight![0].ListSegment![0].Equipment;

    const aircraft = aircraftCode
      ? realm.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          aircraftCode,
        )
      : null;

    const startDate = item.ListFlightOption![0].ListFlight![0].StartDate;
    const endDate = item.ListFlightOption![0].ListFlight![0].EndDate;

    const days = Math.floor(
      item.ListFlightOption![0].ListFlight![0].Duration! / (60 * 24),
    );

    const stopPoints =
      item.ListFlightOption![0].ListFlight![0].ListSegment?.flatMap(segment => {
        return segment.StopPoint ? [segment.StopPoint] : [];
      });

    return (
      <View
        style={[
          bs.marginHorizontal_8,
          bs.borderRadius_8,
          bs.marginBottom_8,
          bs.borderWidth_10,
          styles.flexRowCenter,
          {
            opacity: 1,
            backgroundColor: colors.neutral10,
            borderColor: colors.successColor,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => onPressItem(item, 0, index)}
          style={styles.leftSelectedFlight}>
          <View
            style={(styles.flexRowCenter, { justifyContent: 'space-between' })}>
            <View style={[bs.columnGap_8, styles.flexRowCenter]}>
              <View style={styles.imgContainer}>
                <SvgUri
                  width={32}
                  height={32}
                  uri={LOGO_URL + item?.Airline + '.svg'}
                />
              </View>
              <View style={[bs.flex, bs.rowGap_4]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  fontStyle="Body12Reg"
                  colorTheme="neutral100"
                  text={
                    dataFlight?.airline?.NameVi ?? dataFlight?.airline?.NameEn
                  }
                />
                <View style={[bs.columnGap_2, styles.flexRowCenter]}>
                  <Text
                    text={getFlightNumber(
                      item.ListFlightOption![0].ListFlight![0].ListSegment![0]
                        .Airline,
                      item.ListFlightOption![0].ListFlight![0].ListSegment![0]
                        .FlightNumber,
                    )}
                    fontStyle="Body10Bold"
                    colorTheme="neutral100"
                  />
                  {aircraft && (
                    <Text
                      text="-"
                      fontStyle="Body10Reg"
                      colorTheme="neutral80"
                    />
                  )}
                  {aircraft && (
                    <Text
                      text={aircraft?.Manufacturer + '-' + aircraft?.Code}
                      fontStyle="Body10Reg"
                      colorTheme="neutral80"
                    />
                  )}
                </View>
              </View>
            </View>
            <View
              style={[
                bs.flex,
                bs.columnGap_4,
                bs.flexDirectionRow,
                {
                  justifyContent: 'flex-end',
                },
              ]}>
              <View
                style={[
                  bs.rowGap_4,
                  {
                    width: scale(52),
                  },
                ]}>
                <Text
                  textAlign="center"
                  colorTheme="primaryColor"
                  fontStyle="Body16Semi"
                  text={dayjs(startDate).format('HH:mm')}
                />
                <View
                  style={[
                    bs.paddingHorizontal_12,
                    bs.paddingVertical_2,
                    bs.borderRadius_4,
                    {
                      backgroundColor: colors.neutral50,
                      overflow: 'hidden',
                    },
                  ]}>
                  <Text
                    text={
                      item.ListFlightOption![0].ListFlight![0]
                        .StartPoint as string
                    }
                    fontStyle="Body10Reg"
                    colorTheme="neutral100"
                  />
                </View>
              </View>
              <View
                style={[
                  bs.rowGap_6,
                  { width: scale(60), alignItems: 'center' },
                ]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text={convertMin2Hour(
                    Number(item.ListFlightOption![0].ListFlight![0].Duration),
                  )}
                  fontStyle="Body10Reg"
                  colorTheme="neutral80"
                />
                <View
                  style={[
                    styles.flexRowCenter,
                    {
                      height: 1,
                      width: scale(60),
                      backgroundColor: colors.neutral40,
                      justifyContent: 'space-around',
                    },
                  ]}>
                  {stopPoints?.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        bs.borderRadius_4,
                        {
                          width: scale(6),
                          height: scale(6),
                          backgroundColor: colors.neutral40,
                        },
                      ]}
                    />
                  ))}
                </View>
                <View
                  style={[
                    styles.flexRowCenter,
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
                        fontStyle="Body10Reg"
                        colorTheme="neutral80"
                      />
                    ))
                  ) : (
                    <Text
                      t18n="flight:direct_flight"
                      fontStyle="Body10Reg"
                      colorTheme="neutral80"
                    />
                  )}
                </View>
              </View>
              <View
                style={[
                  bs.rowGap_4,
                  {
                    width: scale(52),
                  },
                ]}>
                <View>
                  <Text
                    textAlign="center"
                    colorTheme="primaryColor"
                    fontStyle="Body16Semi"
                    text={dayjs(endDate).format('HH:mm')}
                  />
                  {days !== 0 && (
                    <View style={{ position: 'absolute', top: -2, right: -6 }}>
                      <Text
                        text={`+${days}`}
                        fontStyle="Body10Med"
                        colorTheme="price"
                      />
                    </View>
                  )}
                </View>
                <View
                  style={[
                    bs.paddingHorizontal_12,
                    bs.paddingVertical_2,
                    bs.borderRadius_4,
                    {
                      backgroundColor: colors.neutral50,
                      overflow: 'hidden',
                    },
                  ]}>
                  <Text
                    text={
                      item.ListFlightOption![0].ListFlight![0]
                        .EndPoint as string
                    }
                    fontStyle="Body10Reg"
                    colorTheme="neutral100"
                    textAlign="center"
                  />
                </View>
              </View>
            </View>
          </View>
          <Separator type="horizontal" size={3} />
          <View
            style={[
              bs.columnGap_8,
              styles.flexRowCenter,
              {
                justifyContent: 'space-between',
              },
            ]}>
            <View style={[bs.flex, bs.rowGap_4]}>
              <View
                style={[
                  bs.flexDirectionRow,
                  bs.columnGap_4,
                  {
                    alignItems: 'flex-end',
                  },
                ]}>
                <View
                  style={{
                    flexShrink: 1,
                  }}>
                  {item.ListFareOption![0].FareFamily ? (
                    <Text
                      fontStyle="Body10Reg"
                      colorTheme="neutral80"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.ListFareOption![0].FareFamily}
                      <Text
                        text={` (${item.ListFareOption![0].FareClass})`}
                        fontStyle="Body10Bold"
                        colorTheme="neutral80"
                      />
                    </Text>
                  ) : (
                    item.ListFareOption![0].FareClass && (
                      <Text
                        fontStyle="Body10Reg"
                        colorTheme="neutral80"
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {translate('flight:seat_class') + ':'}
                        <Text
                          text={` (${item.ListFareOption![0].FareClass})`}
                          fontStyle="Body10Bold"
                          colorTheme="neutral80"
                        />
                      </Text>
                    )
                  )}
                </View>
                <View
                  style={[
                    bs.columnGap_2,
                    bs.flexDirectionRow,
                    {
                      alignItems: 'flex-end',
                    },
                  ]}>
                  <Icon
                    icon={
                      multiFlight.length > 0
                        ? 'arrow_circle_right_fill'
                        : 'seat_fill'
                    }
                    size={12}
                    colorTheme={multiFlight.length > 0 ? 'VU' : 'errorColor'}
                  />
                  {multiFlight.length > 0 ? (
                    <Text
                      t18n="flight:oneway_price"
                      fontStyle="Body10Reg"
                      colorTheme="neutral80"
                    />
                  ) : (
                    calSeatLeftText(item.ListFareOption![0])
                  )}
                </View>
              </View>
              <View style={[bs.columnGap_4, styles.flexRowCenter]}>
                <Text fontStyle="Body16Bold" colorTheme="price">
                  {(fare ?? 0).currencyFormat()}{' '}
                  <Text
                    t18n={CurrencyDetails.VND.symbol}
                    fontStyle="Body16Bold"
                    colorTheme="neutral100"
                  />
                </Text>
                <Icon
                  icon="arrow_ios_down_fill"
                  size={16}
                  colorTheme="neutral100"
                />
                <View
                  style={[
                    bs.paddingVertical_2,
                    bs.paddingHorizontal_6,
                    bs.borderRadius_2,
                    {
                      backgroundColor: colors.VN,
                      overflow: 'hidden',
                    },
                  ]}>
                  <Text
                    text={item.System as string}
                    fontStyle="Body10Semi"
                    colorTheme="white"
                    textAlign="center"
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              hitSlop={HitSlop.Large}
              activeOpacity={ActiveOpacity}
              onPress={() => {
                reselect(index);
              }}
              style={styles.rightSelectedFlight}>
              <Icon icon="refresh_fill" size={20} colorTheme="successColor" />
              <Text
                t18n="common:reselect"
                fontStyle="Body14Semi"
                colorTheme="successColor"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(() => ({
  leftSelectedFlight: {
    padding: scale(12),
    rowGap: scale(12),
    flex: 1,
  },
  rightSelectedFlight: {
    height: '100%',
    columnGap: scale(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
}));
