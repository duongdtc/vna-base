/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Text } from '@vna-base/components';
import { FlightItemProps } from '@vna-base/screens/flight/type';
import { FareOption } from '@services/axios/axios-ibe';
import { AircraftRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
import {
  ActiveOpacity,
  HitSlop,
  getDateTimeOfFlightOption,
  getFlightNumber,
  scale,
} from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import {
  FlatList,
  ListRenderItem,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

export const MinimizeSingleFlightItem = memo(
  ({ item, index, onPressItem, onSelectItem }: FlightItemProps) => {
    const { styles } = useStyles(styleSheet);

    // const customFeeTotal = useSelector(selectCustomFeeTotal);
    // const fareType = useSelector(selectFareType);

    const departDate = item.ListFlightOption![0].ListFlight![0]
      .DepartDate as string;
    const arriveDate = item.ListFlightOption![0].ListFlight![0]
      .ArriveDate as string;

    const aircraftCode =
      item.ListFlightOption![0].ListFlight![0].ListSegment![0].Equipment;
    const aircraft = aircraftCode
      ? realmRef.current?.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          aircraftCode,
        )
      : null;

    // const fare = useMemo(
    //   () =>

    //     getFareFromFareOption(item.ListFareOption![0]).ADT[fareType] +
    //     customFeeTotal[fareType!],
    //   [item.ListFareOption, fareType, customFeeTotal],
    // );

    const selectFare = useCallback(() => {
      onSelectItem?.(item, 0, 0);
    }, [item, onSelectItem]);

    const renderItem = useCallback<ListRenderItem<FareOption>>(
      ({ item: fareOpt, index: idx }) => {
        return (
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            hitSlop={HitSlop.Medium}
            style={styles.itemFare}
            onPress={() => {
              console.log('index fare option: ', idx);
            }}>
            <Text
              text={fareOpt.FareClass as string}
              fontStyle="Body12BoldMono"
              colorTheme={
                fareOpt.Availability && fareOpt.Availability > 0
                  ? 'neutral100'
                  : 'neutral70'
              }
            />
            <Text
              text={fareOpt.Availability?.currencyFormat()}
              fontStyle="Body12BoldMono"
              colorTheme={
                fareOpt.Availability && fareOpt.Availability > 0
                  ? 'successColor'
                  : 'neutral70'
              }
            />
          </TouchableOpacity>
        );
      },
      [],
    );

    return (
      <View style={styles.container}>
        <View
          style={[
            {
              flexShrink: 1,
            },
          ]}>
          <View
            style={[bs.flexDirectionRow, styles.flexRowCenter, bs.columnGap_4]}>
            <View style={bs.width_24}>
              <Text
                text={(index + 1).toString() + '.'}
                fontStyle="Body12BoldMono"
                colorTheme="primaryPressed"
              />
            </View>
            <View style={bs.width_56}>
              <Text
                text={getFlightNumber(
                  item.ListFlightOption![0].ListFlight![0].ListSegment![0]
                    .Airline,
                  item.ListFlightOption![0].ListFlight![0].ListSegment![0]
                    .FlightNumber,
                )}
                fontStyle="Body14BoldMono"
                colorTheme="primaryPressed"
              />
            </View>
            <Text
              colorTheme="secondPressed"
              fontStyle="Body14RegMono"
              text={
                getDateTimeOfFlightOption(departDate)?.time.replace(':', '') +
                '-' +
                getDateTimeOfFlightOption(arriveDate)?.time.replace(':', '')
              }
            />
            <Text
              text={aircraft?.Code ?? '321'}
              fontStyle="Body14RegMono"
              colorTheme="infoColor"
            />
          </View>
        </View>
        <ScrollView
          horizontal
          style={[bs.flex, bs.marginLeft_4]}
          showsHorizontalScrollIndicator={false}>
          <FlatList
            scrollEnabled={false}
            data={item.ListFareOption}
            keyExtractor={(it, indx) => `${it}_${indx}`}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: scale(4),
            }}
            numColumns={7}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={bs.height_8} />}
          />
        </ScrollView>
      </View>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, borders, spacings }) => ({
  container: {
    padding: scale(8),
    backgroundColor: colors.neutral10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  btnChooseMinimize: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  itemFare: {
    borderWidth: borders[5],
    borderRadius: spacings[4],
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral20,
    marginRight: scale(8),
    borderColor: colors.neutral30,
  },
}));
