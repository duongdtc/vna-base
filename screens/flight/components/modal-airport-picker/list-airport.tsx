import { LinearGradient, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectLanguage } from '@vna-base/redux/selector';
import { Airport } from '@redux/type';
import { Flight } from '@vna-base/screens/flight/type';
import {
  AirportRealm,
  CountryRealm,
  RegionRealm,
} from '@services/realm/models';
import { useObject, useQuery, useRealm } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { scale } from '@vna-base/utils';
import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';

export const ListAirport = memo(
  ({
    ignoreData,
    onPressItem,
  }: {
    ignoreData: Flight | undefined;
    onPressItem: (data: Airport | AirportRealm) => void;
  }) => {
    const { styles } = useStyles(styleSheet);
    const lng = useSelector(selectLanguage);

    const realm = useRealm();

    const allAirport = useQuery<AirportRealm>(AirportRealm.schema.name);
    const allRegions = useQuery(RegionRealm);

    const [viewingRegion, setViewingRegion] = useState('VN');

    const region = useObject<RegionRealm>(
      RegionRealm.schema.name,
      viewingRegion,
    );

    const airports = allAirport.filtered(
      `CountryCode IN {${region?.Country.reduce(
        (total, curr, currIdx) =>
          total + (currIdx === 0 ? '' : ',') + `'${curr}'`,
        '',
      )}}  SORT(Order DESC)`,
    );

    const renderRegionItem = useCallback<ListRenderItem<RegionRealm>>(
      ({ item }) => {
        const selected = item.Code === viewingRegion;

        return (
          <Pressable
            onPress={() => {
              setViewingRegion(item.Code);
            }}
            disabled={selected}>
            <View style={styles.regionItem}>
              {selected && (
                <LinearGradient type="gra1" style={StyleSheet.absoluteFill} />
              )}
              <Text
                text={lng === 'vi' ? item.NameVi : item.NameEn}
                fontStyle="Body14Med"
                colorTheme={selected ? 'secondSurface' : 'primaryColor'}
              />
            </View>
          </Pressable>
        );
      },
      [lng, styles.regionItem, viewingRegion],
    );

    const renderAirportItem = useCallback<ListRenderItem<AirportRealm>>(
      ({ item }) => {
        const ignore = ignoreData?.Code === item.Code;
        const country = realm.objectForPrimaryKey<CountryRealm>(
          CountryRealm.schema.name,
          item.CountryCode,
        );

        return (
          <Pressable
            onPress={() => {
              onPressItem(item);
            }}
            disabled={ignore}>
            <View style={styles.airportItem(ignore)}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                text={`${
                  lng === 'vi' ? item.City?.NameVi : item.City?.NameEn
                }, ${lng === 'vi' ? country?.NameVi : country?.NameEn}`}
                fontStyle="Body14Med"
                colorTheme="primaryPressed"
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                colorTheme="neutral60"
                fontStyle="Body10Bold">
                {item.Code}
                <Text
                  text={` - ${lng === 'vi' ? item.NameVi : item.NameEn}`}
                  fontStyle="Body10Reg"
                  colorTheme="neutral60"
                />
              </Text>
            </View>
          </Pressable>
        );
      },
      [ignoreData?.Code, lng, onPressItem, styles.regionItem],
    );

    return (
      <View style={styles.container}>
        <View style={styles.regionContainer}>
          <BottomSheetFlatList
            data={allRegions}
            renderItem={renderRegionItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={it => it.Code}
            contentContainerStyle={styles.regionContentContainer}
          />
        </View>
        <View style={styles.airportCotainer}>
          <BottomSheetFlatList
            data={airports}
            renderItem={renderAirportItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={it => it.Code}
            contentContainerStyle={styles.regionContentContainer}
          />
        </View>
      </View>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ spacings }) => ({
  container: { flex: 1, flexDirection: 'row' },
  regionContainer: {
    minWidth: scale(120),
  },
  contentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom,
  },
  airportCotainer: { flex: 1 },
  regionItem: {
    paddingHorizontal: spacings[12],
    paddingVertical: spacings[8],
  },
  regionContentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom,
  },

  airportItem: (ignore: boolean) => ({
    padding: spacings[8],
    rowGap: spacings[2],
    opacity: ignore ? 0.4 : 1,
  }),
}));
