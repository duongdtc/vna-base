/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, EmptyList, Highlighter, Icon, TextInput } from '@vna-base/components';
import { useDebounce } from '@vna-base/hooks';
import { goBack } from '@navigation/navigation-service';
import { selectLanguage } from '@vna-base/redux/selector';
import { AirportRealm, CountryRealm } from '@services/realm/models';
import { useQuery, useRealm } from '@services/realm/provider';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

type Props = { onDone: (code: string) => void; selected: string };

export const AirportTab = ({ onDone, selected }: Props) => {
  const styles = useStyles();

  const realm = useRealm();

  const allAirports = useQuery<AirportRealm>(AirportRealm.schema.name);
  const allCountries = useQuery<CountryRealm>(CountryRealm.schema.name);

  const lng = useSelector(selectLanguage);

  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<Array<AirportRealm>>([]);

  const onSearch = useCallback((value: string) => {
    if (value.trim().length === 0) {
      setSearchResult(allAirports.slice(0, 22));
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

  const onPressItem = useCallback(
    (code: string) => {
      onDone(code);
      goBack();
    },
    [onDone],
  );

  const renderSearchResultItem = useCallback<ListRenderItem<AirportRealm>>(
    ({ item }) => {
      const isSelected = selected === item.Code;

      const country = realm.objectForPrimaryKey<CountryRealm>(
        CountryRealm.schema.name,
        item.CountryCode,
      );

      return (
        <TouchableOpacity
          style={[styles.itemContainer, isSelected && styles.selectedItem]}
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onPressItem(item.Code);
          }}>
          <Block flex={1}>
            <Highlighter
              fontStyle={isSelected ? 'Title16Semi' : 'Body16Reg'}
              colorTheme="neutral900"
              searchWords={[keyword]}
              highlightColorTheme="primary500"
              textToHighlight={`${item.Code} - ${
                lng === 'vi' ? item.City?.NameVi : item.City?.NameEn
              }, ${lng === 'vi' ? country?.NameVi : country?.NameEn}`}
            />
          </Block>
          {isSelected && (
            <Icon icon="checkmark_fill" size={24} colorTheme="primary600" />
          )}
        </TouchableOpacity>
      );
    },
    [
      selected,
      realm,
      styles.itemContainer,
      styles.selectedItem,
      keyword,
      lng,
      onPressItem,
    ],
  );

  return (
    <Block flex={1}>
      <Block
        paddingHorizontal={12}
        paddingVertical={10}
        borderBottomWidth={3}
        borderColorTheme="neutral200">
        <TextInput
          autoFocus
          left={<Icon icon="search_fill" colorTheme="neutral700" size={20} />}
          placeholderI18n="dep_arr_area:search_airport"
          onChangeText={setKeyword}
          value={keyword}
        />
      </Block>
      <FlatList
        data={searchResult}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<EmptyList height={200} />}
        keyExtractor={(i, index) => `${i.Code}_${index}`}
        renderItem={renderSearchResultItem}
        contentContainerStyle={styles.contentContainer}
      />
    </Block>
  );
};
