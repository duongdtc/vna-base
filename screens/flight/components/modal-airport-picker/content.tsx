/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetTextInput, Highlighter, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useDebounce } from '@vna-base/hooks';
import { selectLanguage } from '@vna-base/redux/selector';
import { Airport } from '@redux/type';
import { Flight } from '@vna-base/screens/flight/type';
import { AirportRealm, CountryRealm } from '@services/realm/models';
import { ActiveOpacity, scale } from '@vna-base/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useQuery, useRealm } from '@services/realm/provider';
import { bs, createStyleSheet, useStyles } from '@theme';
import { UnistylesRuntime } from 'react-native-unistyles';
import { ListAirport } from './list-airport';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const Content = ({
  ignoreData,
  onPressItem,
}: {
  ignoreData: Flight | undefined;
  onPressItem: (data: Airport | AirportRealm) => void;
}) => {
  const { styles } = useStyles(styleSheet);
  const [t] = useTranslation();
  const lng = useSelector(selectLanguage);

  const zIndexSharedValue = useSharedValue(-1);
  const opacitySharedValue = useSharedValue(0);
  const keywordPreRef = useRef('');

  const realm = useRealm();

  const allAirports = useQuery<AirportRealm>(AirportRealm.schema.name);
  const allCountries = useQuery<CountryRealm>(CountryRealm.schema.name);

  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<Array<AirportRealm>>([]);

  const onSearch = useCallback((value: string) => {
    if (value.trim().length === 0) {
      setSearchResult([]);
    } else {
      let aps = allAirports.filtered(
        'Code CONTAINS[c] $0 OR NameVi CONTAINS[c] $0 OR NameEn CONTAINS[c] $0 OR CountryCode CONTAINS[c] $0 OR CityCode CONTAINS[c] $0 OR City.NameVi CONTAINS[c] $0 OR City.NameEn CONTAINS[c] $0 LIMIT(22)',
        value.trim().toLowerCase(),
      );

      if (aps.length === 0) {
        //@ts-ignore
        aps = allCountries
          .filtered(
            'Code CONTAINS[c] $0 OR NameVi CONTAINS[c] $0 OR NameEn CONTAINS[c] $0 OR RegionCode CONTAINS[c] $0  LIMIT(1)',
            value.trim().toLowerCase(),
          )
          .flatMap(country => [
            ...allAirports.filtered(
              `Code IN {${country.Airport.reduce(
                (total, curr, currIdx) =>
                  total + (currIdx === 0 ? '' : ',') + `'${curr}'`,
                '',
              )}}`,
            ),
          ]);
      }

      //@ts-ignore
      setSearchResult(aps);
    }
  }, []);

  useDebounce(keyword, onSearch, 800);

  useEffect(() => {
    if (keyword !== '' && keywordPreRef.current === '') {
      zIndexSharedValue.value = 1;
      opacitySharedValue.value = withTiming(1, { duration: 200 });
    } else if (keyword === '' && keywordPreRef.current !== '') {
      zIndexSharedValue.value = -1;
      opacitySharedValue.value = withTiming(0, { duration: 200 });
    }

    keywordPreRef.current = keyword;
  }, [keyword]);

  const animatedStyles = useAnimatedStyle(() => ({
    zIndex: zIndexSharedValue.value,
    opacity: opacitySharedValue.value,
  }));

  const renderSearchResultItem = useCallback<ListRenderItem<AirportRealm>>(
    ({ item }) => {
      const country = realm.objectForPrimaryKey<CountryRealm>(
        CountryRealm.schema.name,
        item.CountryCode,
      );

      return (
        <TouchableOpacity
          disabled={ignoreData?.Code === item.Code}
          style={[
            styles.btnSearchResult,
            ignoreData?.Code === item.Code && { opacity: 0.3 },
          ]}
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onPressItem(item);
          }}>
          <View style={bs.flex}>
            <Highlighter
              fontStyle="Body16Bold"
              colorTheme="neutral800"
              searchWords={[keyword]}
              highlightColorTheme="primaryColor"
              textToHighlight={`${
                lng === 'vi' ? item.City?.NameVi : item.City?.NameEn
              }, ${lng === 'vi' ? country?.NameVi : country?.NameEn}`}
            />
            <Highlighter
              fontStyle="Body12Med"
              colorTheme="neutral50"
              searchWords={[keyword]}
              highlightColorTheme="primaryColor"
              textToHighlight={item.NameVi}
            />
          </View>
          <View style={styles.codeContainer}>
            <Highlighter
              colorTheme="neutral800"
              fontStyle="Body16Bold"
              searchWords={[keyword]}
              highlightColorTheme="primaryColor"
              textToHighlight={item?.Code}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [onPressItem, ignoreData?.Code, keyword, styles],
  );

  return (
    <View style={styles.btsContentContainer}>
      <BottomSheetTextInput
        onChangeText={setKeyword}
        leftIcon="search_fill"
        colorTheme="neutral10"
        leftIconColorTheme="001"
        placeholderColorTheme="neutral80"
        leftIconSize={24}
        placeholder={t('flight:search_airport_placeholder')}
        style={styles.bottomSheetTextInput}
      />
      <View style={bs.flex}>
        <ListAirport ignoreData={ignoreData} onPressItem={onPressItem} />
        <Animated.View style={[styles.searchResultContainer, animatedStyles]}>
          <BottomSheetFlatList
            data={searchResult}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text
                fontStyle="Body14Reg"
                textAlign="center"
                colorTheme="neutral10"
                t18n="common:not_found_result"
              />
            }
            keyExtractor={(i, index) => `${i.Code}_${index}`}
            renderItem={renderSearchResultItem}
            contentContainerStyle={styles.contentContainer}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(
  ({ colors, spacings, radius, borders }) => ({
    contentContainer: {
      paddingHorizontal: spacings[12],
      paddingBottom: UnistylesRuntime.insets.bottom,
    },
    bottomSheetTextInput: {
      borderBottomWidth: borders[10],
      borderBottomColor: colors.neutral30,
      paddingVertical: spacings[4],
      paddingHorizontal: spacings[4],
      marginHorizontal: spacings[12],
      marginBottom: spacings[16],
      marginTop: spacings[12],
    },
    btnSearchResult: {
      paddingVertical: spacings[8],
      flexDirection: 'row',
    },
    codeContainer: {
      borderWidth: borders[10],
      borderRadius: radius[4],
      borderColor: colors.neutral30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacings[8],
      minWidth: scale(56),
      paddingVertical: spacings[4],
    },
    btsContentContainer: {
      flex: 1,
      backgroundColor: colors.neutral10,
    },
    searchResultContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral10,
    },
  }),
);
