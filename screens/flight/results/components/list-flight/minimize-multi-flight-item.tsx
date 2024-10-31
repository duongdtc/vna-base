/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Flight, FlightOption } from '@services/axios/axios-ibe';
import { AircraftRealm, AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
import {
  BottomSheet,
  Button,
  Icon,
  Image,
  Separator,
  Text,
} from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  selectCustomFeeTotal,
  selectFareType,
  selectMultiFlights,
} from '@vna-base/redux/selector';
import {
  BottomSheetContentFlightRef,
  FlightItemProps,
} from '@vna-base/screens/flight/type';
import {
  ActiveOpacity,
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
import { useSelector } from 'react-redux';
import { BottomSheetContentFlight } from '../content-flight-bottom-sheet';

export const MinimizeMultiFlightItem = memo(
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
        return (
          <View key={flight.FlightId}>
            <View style={styles.flightContainer}>
              {/* logo + tên hãng máy bay */}
              <View
                style={[
                  styles.flexRowCenter,
                  {
                    justifyContent: 'space-between',
                  },
                ]}>
                <View style={[bs.columnGap_8, styles.flexRowCenter]}>
                  <View style={styles.imgContainer24}>
                    <Image
                      source={images.logo_vna}
                      style={{ width: scale(24), height: scale(24) }}
                    />
                  </View>
                  <View
                    style={
                      (styles.flexRowCenter,
                      {
                        width: scale(85),
                        justifyContent: 'space-between',
                      })
                    }>
                    <Text
                      colorTheme="neutral100"
                      fontStyle="Body12Bold"
                      text={getDateTimeOfFlightOption(flight.DepartDate)?.time}
                    />
                    <Text
                      colorTheme="neutral100"
                      fontStyle="Body12Med"
                      text="-"
                    />
                    <Text
                      colorTheme="neutral100"
                      fontStyle="Body12Bold"
                      text={getDateTimeOfFlightOption(flight.ArriveDate)?.time}
                    />
                  </View>
                  <Icon
                    icon="info_outline"
                    size={12}
                    colorTheme="primaryColor"
                  />
                </View>
              </View>
            </View>
          </View>
        );
      },
      [styles.flexRowCenter, styles.flightContainer, styles.imgContainer24],
    );

    const renderItemBottomSheet = useCallback<ListRenderItem<Flight>>(
      ({ item: flight }) => {
        const airline = realm.objectForPrimaryKey<AirlineRealm>(
          AirlineRealm.schema.name,
          flight.Airline as string,
        );

        const aircraft = realm.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          flight.ListSegment![0].Equipment!,
        );

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
              <View
                style={[
                  bs.flex,
                  styles.flexRowCenter,
                  {
                    justifyContent: 'space-between',
                  },
                ]}>
                <View style={[bs.columnGap_8, styles.flexRowCenter]}>
                  <View style={styles.imgContainer32}>
                    <Image
                      source={images.logo_vna}
                      style={{ width: scale(32), height: scale(32) }}
                    />
                  </View>
                  <View style={[bs.flex, bs.rowGap_4]}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      text={airline?.NameVi ?? airline?.NameEn}
                      fontStyle="Body12Reg"
                      colorTheme="neutral100"
                    />
                    <View style={[bs.columnGap_1, styles.flexRowCenter]}>
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
                          fontStyle="Body12Bold"
                          colorTheme="neutral80"
                        />
                      )}
                      {/* thông tin hãng bay */}
                      {aircraft && (
                        <View style={[bs.flex]}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            text={aircraft?.Manufacturer + '-' + aircraft?.Code}
                            fontStyle="Body10Reg"
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
                    bs.flexDirectionRow,
                    bs.columnGap_4,
                    {
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
                          overflow: 'hidden',
                          backgroundColor: colors.neutral50,
                        },
                      ]}>
                      <Text
                        text={flight.StartPoint as string}
                        fontStyle="Body10Reg"
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
                    style={{
                      rowGap: scale(4),
                      width: scale(52),
                    }}>
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
                        colorTheme="primaryColor"
                        fontStyle="Body10Reg"
                        text={flight.EndPoint as string}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <Separator
              type="horizontal"
              paddingHorizontal={12}
              marginVertical={4}
            />
          </View>
        );
      },
      [
        colors.neutral40,
        colors.neutral50,
        realm,
        styles.flexRowCenter,
        styles.flightContainer,
        styles.imgContainer32,
      ],
    );

    const renderItemFlight = useCallback<ListRenderItem<FlightOption>>(
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
              renderItem={renderItemBottomSheet}
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
                  fontStyle="Body10Reg"
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
        renderItemBottomSheet,
        selectedIndexFlightOption,
        styles,
      ],
    );

    return (
      <>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => onPressItem(item, selectedIndexFlightOption)}
          style={styles.container}>
          <View
            style={[
              bs.p_h_8,
              bs.p_b_8,
              styles.flexRowCenter,
              {
                justifyContent: 'space-between',
              },
            ]}>
            <FlatList
              scrollEnabled={false}
              data={
                item.ListFlightOption![selectedIndexFlightOption].ListFlight!
              }
              keyExtractor={(i, index) => `${i.FlightId}_${index}`}
              renderItem={renderItem}
            />
            <View
              style={[
                bs.fl,
                bs.p_t_8,
                bs.rg_8,
                {
                  alignItems: 'flex-end',
                },
              ]}>
              {multiFlight.length > 0 && (
                <View style={[bs.columnGap_4, styles.flexRowCenter]}>
                  <Icon
                    icon={'f_checkmark_circle'}
                    size={12}
                    colorTheme="successColor"
                  />
                  <Text
                    t18n="flight:combined_price"
                    fontStyle="Body10Reg"
                    colorTheme="neutral80"
                  />
                </View>
              )}
              <View style={[bs.columnGap_4, styles.flexRowCenter]}>
                <View
                  style={[
                    bs.p_v_2,
                    bs.p_h_6,
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
                <Text
                  text={Number(fare).currencyFormat()}
                  fontStyle="Body12Bold"
                  colorTheme="price"
                />
                <Icon
                  icon="f_arrow_ios_down"
                  size={16}
                  colorTheme="neutral100"
                />

                <TouchableOpacity
                  hitSlop={HitSlop.Large}
                  activeOpacity={ActiveOpacity}
                  onPress={selectFare}
                  style={styles.btnChooseMulti}>
                  <Text
                    colorTheme="neutral100"
                    t18n="flight:choose_fare"
                    fontStyle="Body14Semi"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {item.ListFlightOption!.length > 1 && (
            <Button
              onPress={() => {
                bottomSheetRef.current?.present();
              }}
              buttonStyle={{ marginHorizontal: 8, borderRadius: 4 }}
              fullWidth
              size="small"
              t18n="flight:other_options"
              rightIcon="f_plus"
              rightIconSize={12}
              type="lowSat"
              marginBottom={8}
              textColorTheme="primaryColor"
            />
          )}
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
            renderItem={renderItemFlight}
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
    marginHorizontal: 8,
    marginBottom: 12,
    rowGap: 8,
  },
  flightContainer: {
    padding: scale(12),
    rowGap: scale(8),
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginLeft: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    top: -2,
  },
  dot1Stage: {
    right: 27,
    left: 27,
  },
  dotLeft2Stage: {
    right: 15,
    left: 15,
  },
  dotRight2Stage: {
    right: 42,
    left: 42,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer24: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  imgContainer32: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
}));
