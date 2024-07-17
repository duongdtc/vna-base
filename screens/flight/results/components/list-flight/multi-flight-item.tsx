/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { BottomSheet, Button, Icon, Separator, Text } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { LOGO_URL } from '@env';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  selectCustomFeeTotal,
  selectFareType,
  selectMultiFlights,
} from '@vna-base/redux/selector';
import {
  BottomSheetContentFlightRef,
  FlightItemProps,
} from '@vna-base/screens/flight/type';
import { Flight, FlightOption } from '@services/axios/axios-ibe';
import { AircraftRealm, AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { createStyleSheet, useStyles, bs } from '@theme';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  CurrencyDetails,
  HitSlop,
  SnapPoint,
  System,
  SystemDetails,
  convertMin2Hour,
  getDateTimeOfFlightOption,
  getFlightNumber,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { BottomSheetContentFlight } from '../content-flight-bottom-sheet';

export const MultiFlightItem = memo(
  ({ item, onPressItem, onSelectItem }: FlightItemProps) => {
    const {
      styles,
      theme: { colors },
    } = useStyles(styleSheet);
    const { bottom } = useSafeAreaInsets();

    const bottomSheetRef = useRef<NormalRef>(null);
    const detailBottomSheetRef = useRef<BottomSheetContentFlightRef>(null);
    const realm = useRealm();

    const customFeeTotal = useSelector(selectCustomFeeTotal);
    const fareType = useSelector(selectFareType);
    const multiFlight = useSelector(selectMultiFlights);

    const [selectedIndexFlightOption, setSelectedIndexFlightOption] =
      useState(0);

    const showingFareOption = useMemo(
      () => item.ListFareOption![0],
      [item.ListFareOption],
    );

    const fare = useMemo(() => {
      let customFee = 0;

      switch (fareType) {
        case 'PriceAdt':
          customFee = customFeeTotal.PriceAdtForAll;
          break;

        case 'TotalFare':
          customFee = customFeeTotal.Total;
          break;
      }

      return (showingFareOption[fareType!] ?? 0) + customFee;
    }, [
      fareType,
      showingFareOption,
      customFeeTotal.PriceAdtForAll,
      customFeeTotal.Total,
    ]);

    const selectFare = useCallback(() => {
      onSelectItem?.(item, selectedIndexFlightOption, 0);
    }, [item, onSelectItem, selectedIndexFlightOption]);

    const renderItem = useCallback<ListRenderItem<Flight>>(
      ({ item: flight }) => {
        const airline = realm.objectForPrimaryKey<AirlineRealm>(
          AirlineRealm.schema.name,
          flight.Airline as string,
        );

        const aircraft = realm.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          flight.ListSegment![0].Equipment!,
        );

        const linkLogo = LOGO_URL + flight.Airline + '.svg';

        const stopPoints = flight.ListSegment?.flatMap(segment => {
          return segment.StopPoint ? [segment.StopPoint] : [];
        });

        const days = dayjs(flight.EndDate)
          .startOf('day')
          .diff(dayjs(flight.StartDate).startOf('day'), 'day');

        return (
          <View key={flight.FlightId}>
            <View style={styles.flightContainer}>
              {/* logo + tên hãng máy bay */}
              <View style={[bs.cg_8, styles.flexRowCenter]}>
                <View style={[bs.fl, bs.cg_8, styles.flexRowCenter]}>
                  <View style={styles.imgContainer}>
                    <SvgUri width={32} height={32} uri={linkLogo} />
                  </View>
                  <View style={[bs.fl, bs.rg_4]}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      text={airline?.NameVi ?? airline?.NameEn}
                      fontStyle="Body12Reg"
                      colorTheme="neutral100"
                    />
                    <View style={[bs.cg_2, styles.flexRowCenter]}>
                      <Text
                        text={getFlightNumber(
                          flight.ListSegment![0].Airline,
                          flight.ListSegment![0].FlightNumber,
                        )}
                        fontStyle="Body12Bold"
                        colorTheme="neutral100"
                      />
                      {aircraft && (
                        <Text
                          text="-"
                          fontStyle="Body12Reg"
                          colorTheme="neutral80"
                        />
                      )}
                      {/* thông tin hãng bay */}
                      {aircraft && (
                        <View style={[bs.fl]}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            text={aircraft?.Manufacturer + '-' + aircraft?.Code}
                            fontStyle="Body12Reg"
                            colorTheme="neutral80"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    bs.fl,
                    bs.columnGap_4,
                    {
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    },
                  ]}>
                  <View
                    style={[
                      bs.rg_4,
                      {
                        width: scale(52),
                      },
                    ]}>
                    <Text
                      textAlign="center"
                      colorTheme="primaryColor"
                      fontStyle="Body16Semi"
                      text={getDateTimeOfFlightOption(flight.DepartDate)?.time}
                    />

                    <View
                      style={[
                        bs.paddingHorizontal_12,
                        bs.p_v_2,
                        bs.br_4,
                        {
                          backgroundColor: colors.neutral50,
                          overflow: 'hidden',
                        },
                      ]}>
                      <Text
                        textAlign="center"
                        text={flight.StartPoint as string}
                        fontStyle="Body12Reg"
                        colorTheme="neutral100"
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      bs.rg_6,
                      {
                        width: scale(60),
                        alignItems: 'center',
                      },
                    ]}>
                    <Text
                      text={convertMin2Hour(Number(flight.Duration))}
                      fontStyle="Body10Reg"
                      colorTheme="neutral80"
                    />
                    <View
                      style={[
                        styles.flexRowCenter,
                        {
                          justifyContent: 'space-around',
                          backgroundColor: colors.neutral40,
                          height: 1,
                          width: scale(60),
                        },
                      ]}>
                      {stopPoints?.map((_, idx) => (
                        <View
                          key={idx}
                          style={[
                            bs.br_4,
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
                        bs.cg_6,
                        styles.flexRowCenter,
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
                          fontStyle="Body12Reg"
                          colorTheme="neutral80"
                        />
                      )}
                    </View>
                  </View>
                  <View
                    style={[
                      bs.rg_4,
                      {
                        width: scale(52),
                      },
                    ]}>
                    <View>
                      <Text
                        textAlign="center"
                        colorTheme="primaryColor"
                        fontStyle="Body16Semi"
                        text={
                          getDateTimeOfFlightOption(flight.ArriveDate)?.time
                        }
                      />
                      {days !== 0 && (
                        <View
                          style={{ position: 'absolute', top: -2, right: -6 }}>
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
                        bs.p_v_2,
                        bs.br_4,
                        {
                          backgroundColor: colors.neutral50,
                          overflow: 'hidden',
                        },
                      ]}>
                      <Text
                        textAlign="center"
                        colorTheme="primaryColor"
                        fontStyle="Body12Reg"
                        text={flight.EndPoint as string}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[bs.paddingHorizontal_12]}>
              <Separator usePercent type="horizontal" />
            </View>
          </View>
        );
      },
      [
        colors.neutral40,
        colors.neutral50,
        realm,
        styles.flexRowCenter,
        styles.flightContainer,
        styles.imgContainer,
      ],
    );

    const renderItemFlightInBottomSheet = useCallback<
      ListRenderItem<FlightOption>
    >(
      ({ item: flightOption, index }) => {
        const selected = index === selectedIndexFlightOption;
        return (
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={() => {
              if (!selected) {
                setSelectedIndexFlightOption(index);
              }

              bottomSheetRef.current?.dismiss();
            }}
            style={[styles.container, selected && styles.selectedFlightOption]}>
            <FlatList
              scrollEnabled={false}
              data={flightOption.ListFlight!}
              keyExtractor={(it, id) => `${it.FlightId}_${id}`}
              renderItem={renderItem}
            />
            <View
              style={[
                bs.paddingHorizontal_12,
                bs.p_b_12,
                styles.flexRowCenter,
                {
                  justifyContent: 'space-between',
                },
              ]}>
              <TouchableOpacity
                hitSlop={HitSlop.Large}
                activeOpacity={ActiveOpacity}
                onPress={() => {
                  detailBottomSheetRef.current?.present({
                    airOption: item,
                    customFeeTotalType:
                      fareType === 'TotalFare' ? 'Total' : undefined,
                  });
                }}
                style={styles.seeDetail}>
                <Icon icon="o_info" colorTheme="primaryColor" size={16} />
                <Text
                  t18n="flight:detail"
                  fontStyle="Body12Reg"
                  colorTheme="neutral80"
                />
              </TouchableOpacity>
              <Icon
                icon={selected ? 'f_checkmark_circle_2' : 'f_radio_button_off'}
                colorTheme={selected ? 'successColor' : 'neutral50'}
                size={24}
              />
            </View>
          </TouchableOpacity>
        );
      },
      [
        fareType,
        item,
        renderItem,
        selectedIndexFlightOption,
        styles.container,
        styles.flexRowCenter,
        styles.seeDetail,
        styles.selectedFlightOption,
      ],
    );

    return (
      <>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => onPressItem(item, selectedIndexFlightOption)}
          style={styles.container}>
          <FlatList
            scrollEnabled={false}
            data={item.ListFlightOption![selectedIndexFlightOption].ListFlight!}
            keyExtractor={(i, index) => `${i.FlightId}_${index}`}
            renderItem={renderItem}
          />

          {item.ListFlightOption!.length > 1 && (
            <Button
              onPress={() => {
                bottomSheetRef.current?.present();
              }}
              buttonStyle={{ marginHorizontal: 12, borderRadius: 4 }}
              fullWidth
              size="small"
              t18n="flight:other_options"
              rightIcon="f_plus"
              rightIconSize={12}
              type="lowSat"
              textColorTheme="primaryColor"
            />
          )}
          <View
            style={[
              bs.fl,
              bs.paddingHorizontal_12,
              bs.m_b_12,
              styles.flexRowCenter,
              {
                justifyContent: 'space-between',
              },
            ]}>
            <View
              style={[
                bs.fl,
                bs.rg_4,
                {
                  justifyContent: 'space-between',
                },
              ]}>
              <View style={[bs.columnGap_4, styles.flexRowCenter]}>
                <View style={{ flexShrink: 1 }}>
                  {showingFareOption.FareFamily ? (
                    <Text
                      fontStyle="Body12Reg"
                      colorTheme="neutral80"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {showingFareOption.FareFamily}
                      <Text
                        text={` (${showingFareOption.FareClass})`}
                        fontStyle="Body12Bold"
                      />
                    </Text>
                  ) : (
                    showingFareOption.FareClass && (
                      <Text
                        fontStyle="Body12Reg"
                        colorTheme="neutral80"
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {translate('flight:seat_class') + ':'}
                        <Text
                          text={` (${showingFareOption.FareClass})`}
                          fontStyle="Body12Bold"
                          colorTheme="neutral80"
                        />
                      </Text>
                    )
                  )}
                </View>

                {multiFlight.length > 0 && (
                  <View style={[bs.columnGap_4, styles.flexRowCenter]}>
                    <Icon
                      icon={'f_checkmark_circle'}
                      size={12}
                      colorTheme="successColor"
                    />
                    <Text
                      t18n="flight:combined_price"
                      fontStyle="Body12Reg"
                      colorTheme="neutral80"
                    />
                  </View>
                )}
              </View>
              <View style={[bs.columnGap_4, styles.flexRowCenter]}>
                <Text fontStyle="Body16Bold" colorTheme="price">
                  {Number(fare).currencyFormat()}{' '}
                  <Text
                    t18n={CurrencyDetails.VND.symbol}
                    fontStyle="Body16Bold"
                    colorTheme="neutral100"
                  />
                </Text>
                <Icon
                  icon="f_arrow_ios_down"
                  size={16}
                  colorTheme="neutral100"
                />
                <View
                  style={[
                    bs.p_h_6,
                    bs.p_v_2,
                    bs.borderRadius_2,
                    {
                      backgroundColor:
                        SystemDetails[item.System as System]?.colorTheme,
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
              onPress={selectFare}
              style={styles.btnChooseMulti}>
              <Text
                colorTheme="neutral10"
                t18n="flight:choose_fare"
                fontStyle="Body14Semi"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          type="normal"
          dismissWhenClose={true}
          enablePanDownToClose={false}
          useDynamicSnapPoint={false}
          typeBackDrop="gray"
          snapPoints={[SnapPoint.Full]}
          t18nTitle="flight:other_options"
          showIndicator={false}>
          <BottomSheetFlatList
            data={item.ListFlightOption!}
            ListEmptyComponent={
              <Text
                fontStyle="Body14Reg"
                textAlign="center"
                colorTheme="neutral100"
                t18n="common:not_found_result"
              />
            }
            style={styles.containerMoreOption}
            keyExtractor={(i, index) => `${i.OptionId}_${index}`}
            renderItem={renderItemFlightInBottomSheet}
            contentContainerStyle={[
              styles.contentContainerMoreOption,
              {
                paddingBottom: bottom,
              },
            ]}
          />
          <BottomSheetContentFlight ref={detailBottomSheetRef} hideListFare />
        </BottomSheet>
      </>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, shadows }) => ({
  container: {
    borderRadius: 8,
    backgroundColor: colors.neutral10,
    rowGap: 12,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  flightContainer: {
    paddingVertical: scale(12),
    rowGap: scale(8),
    paddingHorizontal: scale(12),
  },
  containerMoreOption: { backgroundColor: colors.neutral50 },
  contentContainerMoreOption: {
    paddingTop: 8,
    paddingHorizontal: scale(4),
  },
  selectedFlightOption: {
    ...shadows['.3'],
    shadowColor: colors.successColor,
    shadowOpacity: 0.4,
  },
  seeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  btnChooseMulti: {
    backgroundColor: colors.primaryColor,
    paddingHorizontal: 26,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
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
