import { Segment } from '@services/axios/axios-ibe';
import {
  AircraftRealm,
  AirlineRealm,
  AirportRealm,
} from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
import { Opacity } from '@theme/color';
import { Image, Text } from '@vna-base/components';
import { selectLanguage } from '@vna-base/redux/selector';

import { images } from '@assets/image';
import {
  convertMin2Hour,
  getDateTimeOfFlightOption,
  getFlightNumber,
  scale,
} from '@vna-base/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

type Props = {
  listSegments: Segment[] | null | undefined;
};

export const ListSegmentInfo = ({ listSegments }: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const [t] = useTranslation();
  const realm = useRealm();
  const lng = useSelector(selectLanguage);

  return (
    <View>
      {listSegments?.map((item, index) => {
        const timeStopChangeFormat =
          item.StopPoint &&
          item.StopTime !== 0 &&
          item.StopTime !== undefined &&
          convertMin2Hour(item.StopTime);

        const durationChangeFormat =
          item.Duration !== 0 &&
          item.Duration !== undefined &&
          convertMin2Hour(item.Duration);

        const aircraft = realm.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          item?.Equipment ?? '0',
        );

        const heightAirlineInfo =
          item.Airline !== item.Operator ? scale(48) : 0;

        let getHeightLine = 0;
        if (aircraft !== null) {
          getHeightLine =
            item.Airline !== item.Operator
              ? heightAirlineInfo + scale(120)
              : scale(140);
        } else {
          getHeightLine =
            item.Airline !== item.Operator
              ? heightAirlineInfo + scale(120)
              : scale(120);
        }

        const airportSP = realm.objectForPrimaryKey<AirportRealm>(
          AirportRealm.schema.name,
          item.StartPoint as string,
        );
        const airportEP = realm.objectForPrimaryKey<AirportRealm>(
          AirportRealm.schema.name,
          item.EndPoint as string,
        );
        const airportStopPoint = realm.objectForPrimaryKey<AirportRealm>(
          AirportRealm.schema.name,
          item.StopPoint ?? 'NULL',
        );

        // nếu timeStopChangeFormat trả về giá trị null hoặc undefined thì return 'N/A'
        const getStopTime =
          timeStopChangeFormat !== (null || undefined)
            ? timeStopChangeFormat
            : 'N/A';

        // nếu airportStopPoint trả về giá trị null hoặc undefined thì return 'N/A'
        // nếu khác null và undefined thì return tên sân bay theo ngôn ngữ
        let getStopPointName = '';
        if (airportStopPoint !== (null || undefined)) {
          getStopPointName =
            lng === 'vi'
              ? (airportStopPoint?.NameVi as string)
              : (airportStopPoint?.NameEn as string);
        } else {
          getStopPointName = 'N/A';
        }

        const airline = realm.objectForPrimaryKey<AirlineRealm>(
          AirlineRealm.schema.name,
          item?.Airline as string,
        );

        return (
          <View key={index}>
            <View>
              {/* //cmt: start render start point của mỗi segment */}
              <View style={[bs.flexDirectionRow, bs.columnGap_12]}>
                <View style={[bs.rowGap_4, { width: scale(60) }]}>
                  <Text
                    textAlign="center"
                    fontStyle="Body16Semi"
                    colorTheme="neutral100"
                    text={getDateTimeOfFlightOption(item?.DepartDate)?.time}
                  />
                  <Text
                    textAlign="center"
                    fontStyle="Body12Reg"
                    colorTheme="neutral80"
                    text={getDateTimeOfFlightOption(item?.DepartDate)?.onlyDate}
                  />
                </View>
                <View style={[bs.rowGap_4]}>
                  <Text
                    fontStyle="Body16Semi"
                    text={`${
                      lng === 'vi'
                        ? airportSP?.City.NameVi
                        : airportSP?.City.NameEn
                    } (${airportSP?.CityCode})`}
                    colorTheme="neutral100"
                  />
                  <View style={[bs.flexDirectionRow, { alignItems: 'center' }]}>
                    <Text
                      fontStyle="Body12Reg"
                      text={
                        lng === 'vi' ? airportSP?.NameVi : airportSP?.NameEn
                      }
                      colorTheme="neutral80"
                    />
                    {item.StartTerminal && (
                      <View
                        style={[
                          bs.borderRadius_4,
                          bs.marginHorizontal_4,
                          {
                            width: scale(4),
                            height: scale(4),
                            backgroundColor: colors.neutral40,
                          },
                        ]}
                      />
                    )}
                    {item.StartTerminal && (
                      <Text
                        fontStyle="Body12Reg"
                        text={`${t('flight:station')} ${item.StartTerminal}`}
                        colorTheme="neutral80"
                      />
                    )}
                  </View>
                </View>
              </View>
              {/* //cmt: end render start point của mỗi segment */}
              {/* //cmt: start phần thời gian bay (duration) của 1 start point - end point */}
              <View
                style={[
                  bs.flexDirectionRow,
                  bs.marginVertical_16,
                  bs.columnGap_12,
                  { alignItems: 'center' },
                ]}>
                <View
                  style={[
                    bs.paddingHorizontal_4,
                    {
                      width: scale(60),
                      alignItems: 'center',
                    },
                  ]}>
                  <View
                    style={[
                      bs.borderRadius_8,
                      {
                        width: scale(36),
                        height: scale(36),
                        overflow: 'hidden',
                      },
                    ]}>
                    <Image
                      source={images.logo_vna}
                      style={{ width: scale(36), height: scale(36) }}
                    />
                  </View>
                </View>
                {/* //cmt: start render phần thông tin hãng chuyến bay */}
                <View
                  style={[
                    bs.flex,
                    bs.paddingVertical_8,
                    bs.paddingHorizontal_12,
                    bs.rowGap_8,
                    bs.borderRadius_4,
                    {
                      maxHeight: scale(108),
                      backgroundColor: colors.neutral20,
                    },
                  ]}>
                  <View
                    style={[
                      bs.flexDirectionRow,
                      bs.gap_4,
                      {
                        alignItems: 'center',
                      },
                    ]}>
                    <Text
                      text={airline?.NameVi ?? airline?.NameEn}
                      fontStyle="Body12Reg"
                      colorTheme="neutral100"
                    />
                    <View
                      style={[
                        bs.borderRadius_4,
                        {
                          width: scale(4),
                          height: scale(4),
                          backgroundColor: colors.neutral40,
                        },
                      ]}
                    />
                    <Text
                      text={getFlightNumber(item.Airline, item.FlightNumber)}
                      fontStyle="Body12Bold"
                      colorTheme="primaryColor"
                    />
                  </View>
                  <View style={[bs.flexDirectionRow, { alignItems: 'center' }]}>
                    <Text
                      fontStyle="Body12Reg"
                      t18n="flight:time_flight"
                      colorTheme="neutral80"
                    />
                    <Text
                      fontStyle="Body12Med"
                      text={
                        Number(durationChangeFormat) !== 0
                          ? (durationChangeFormat as string)
                          : 'N/A'
                      }
                      colorTheme="neutral100"
                    />
                  </View>
                  {aircraft !== null && (
                    <View
                      style={[bs.flexDirectionRow, { alignItems: 'center' }]}>
                      <Text
                        t18n="flight:flight"
                        fontStyle="Body12Reg"
                        colorTheme="neutral80"
                      />
                      <Text
                        text={aircraft?.Manufacturer + '-' + aircraft?.Model}
                        fontStyle="Body12Med"
                        colorTheme="neutral100"
                      />
                    </View>
                  )}
                  {item.Airline !== item.Operator && (
                    <View
                      style={[
                        bs.flexDirectionRow,
                        bs.gap_4,
                        { alignItems: 'center', height: scale(20) },
                      ]}>
                      <Text
                        t18n="flight:operate"
                        fontStyle="Body12Reg"
                        colorTheme="neutral100"
                      />
                      <View
                        style={[
                          bs.borderRadius_4,
                          {
                            width: scale(20),
                            height: scale(20),
                            overflow: 'hidden',
                          },
                        ]}>
                        <Image
                          source={images.logo_vna}
                          style={{ width: scale(20), height: scale(20) }}
                        />
                      </View>
                      <Text
                        text={'VN' as string}
                        fontStyle="Body12Reg"
                        colorTheme="neutral100"
                      />
                    </View>
                  )}
                </View>
                {/* //cmt: end render phần thông tin hãng chuyến bay */}
              </View>
              {/* //cmt: end phần thời gian bay (duration) của 1 start point - end point */}
              {/* //cmt: start phần thời gian dừng giữa các chặng */}
              {item.StopPoint && (
                <View
                  style={[
                    bs.paddingLeft_8,
                    bs.marginHorizontal_8,
                    {
                      position: 'absolute',
                      bottom: scale(24),
                    },
                  ]}>
                  <View style={styles.firstDotlineStopChange}>
                    <Text
                      fontStyle="Body12Bold"
                      text="----------"
                      colorTheme="VU"
                    />
                  </View>
                  {getStopTime === 'N/A' && getStopPointName === 'N/A' ? (
                    <View>
                      <Text
                        fontStyle="Body12Reg"
                        t18n="common:not_found_result"
                        colorTheme="VU"
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        bs.flexDirectionRow,
                        bs.gap_4,
                        { alignItems: 'center' },
                      ]}>
                      <Text
                        fontStyle="Body12Reg"
                        text={lng === 'vi' ? 'Dừng' : 'Stop'}
                        colorTheme="neutral100"
                      />
                      <Text
                        fontStyle="Body12Reg"
                        text={getStopTime as string}
                        colorTheme="VU"
                      />
                      <View
                        style={[
                          bs.borderRadius_4,
                          {
                            width: scale(4),
                            height: scale(4),
                            backgroundColor: colors.neutral40,
                          },
                        ]}
                      />
                      <Text
                        fontStyle="Body12Reg"
                        text={lng === 'vi' ? 'Tại' : 'At'}
                        colorTheme="neutral100"
                      />
                      <Text
                        fontStyle="Body12Reg"
                        text={getStopPointName}
                        colorTheme="VU"
                      />
                    </View>
                  )}

                  <View style={styles.secondDotlineStopChange}>
                    <Text
                      fontStyle="Body12Bold"
                      text="----------"
                      colorTheme="VU"
                    />
                  </View>
                </View>
              )}
              {/* //cmt: end phần thời gian dừng giữa các chặng */}
              {/* //cmt: start render end point của mỗi segment */}
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: scale(12),
                  marginBottom:
                    listSegments!.length > 1 &&
                    index !== listSegments.length - 1
                      ? scale(56)
                      : 0,
                }}>
                <View style={(bs.rowGap_4, { width: scale(60) })}>
                  <Text
                    textAlign="center"
                    fontStyle="Body16Semi"
                    colorTheme="neutral100"
                    text={getDateTimeOfFlightOption(item?.ArriveDate)?.time}
                  />
                  <Text
                    textAlign="center"
                    fontStyle="Body12Reg"
                    colorTheme="neutral80"
                    text={getDateTimeOfFlightOption(item?.ArriveDate)?.onlyDate}
                  />
                </View>
                <View style={bs.rowGap_4}>
                  <Text
                    fontStyle="Body16Semi"
                    text={`${
                      lng === 'vi'
                        ? airportEP?.City.NameVi
                        : airportEP?.City.NameEn
                    } (${airportEP?.CityCode})`}
                    colorTheme="neutral100"
                  />
                  <View style={[bs.flexDirectionRow, { alignItems: 'center' }]}>
                    <Text
                      fontStyle="Body12Reg"
                      text={airportEP?.NameVi}
                      colorTheme="neutral80"
                    />
                    {item.EndTerminal && (
                      <View
                        style={[
                          bs.borderRadius_4,
                          bs.marginHorizontal_4,
                          {
                            width: scale(4),
                            height: scale(4),
                            backgroundColor: colors.neutral40,
                          },
                        ]}
                      />
                    )}
                    {item.EndTerminal && (
                      <Text
                        fontStyle="Body12Reg"
                        text={`${t('flight:station')} ${item.EndTerminal}`}
                        colorTheme="neutral80"
                      />
                    )}
                  </View>
                </View>
              </View>
              {/* //cmt: end render end point của mỗi segment */}
            </View>
            {/* //cmt: start phần kẻ xanh vertical start point - end point */}
            <View
              style={[
                styles.verticalLine2Segment,
                {
                  left: scale(60),
                  height: getHeightLine,
                },
              ]}>
              <View
                children={<View style={styles.beginColorDotVerticalLine} />}
                style={styles.beginDotVerticalLine}
              />
              <View
                children={<View style={styles.endColorDotVerticalLine} />}
                style={styles.endDotVerticalLine}
              />
            </View>
            {/* //cmt: end phần kẻ xanh vertical start point - end point */}
          </View>
        );
      })}
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  verticalLine2Segment: {
    position: 'absolute',
    top: 14,
    width: 1,
    backgroundColor: colors.primaryColor,
  },
  beginDotVerticalLine: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    borderWidth: 2,
    borderColor: colors.primaryColor + Opacity[60],
    position: 'absolute',
    left: -3.2,
    top: -8,
  },
  beginColorDotVerticalLine: {
    width: scale(4),
    height: scale(4),
    backgroundColor: colors.neutral100,
    borderRadius: 2,
  },
  endDotVerticalLine: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    borderWidth: 2,
    borderColor: colors.primaryColor + Opacity[60],
    position: 'absolute',
    left: -3.2,
    bottom: -8,
  },
  endColorDotVerticalLine: {
    width: scale(4),
    height: scale(4),
    backgroundColor: colors.primaryColor,
    borderRadius: 2,
  },
  firstDotlineStopChange: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
    height: 10,
    width: 40,
    top: -25,
    left: 36.4,
  },
  secondDotlineStopChange: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
    height: 10,
    width: 25,
    bottom: -20,
    left: 44,
  },
}));
