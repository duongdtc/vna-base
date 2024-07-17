/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, EmptyList, Highlighter, Icon, TextInput } from '@vna-base/components';
import { useDebounce } from '@vna-base/hooks';
import { goBack } from '@navigation/navigation-service';
import { selectLanguage } from '@vna-base/redux/selector';
import { Region } from '@redux/type';
import { RegionRealm } from '@services/realm/models';
import { useQuery } from '@services/realm/provider';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

type Props = { onDone: (code: string) => void; selected: string };

export const AreaTab = ({ onDone, selected }: Props) => {
  const styles = useStyles();

  const allRegions = useQuery<RegionRealm>(RegionRealm.schema.name);

  const [keyword, setKeyword] = useState('');

  const lng = useSelector(selectLanguage);

  const [searchResult, setSearchResult] = useState<Array<RegionRealm>>([]);

  const onSearch = useCallback((value: string) => {
    if (value.trim().length === 0) {
      setSearchResult(allRegions.map(reg => reg));
    } else {
      const aps = allRegions.filtered(
        'Code CONTAINS[c] $0 OR NameVi CONTAINS[c] $0 OR NameEn CONTAINS[c] $0 LIMIT(22)',
        value.trim().toLowerCase(),
      );

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

  const renderSearchResultItem = useCallback<ListRenderItem<Region>>(
    ({ item }) => {
      const isSelected = selected === item.Code;

      return (
        <TouchableOpacity
          style={[styles.itemContainer, isSelected && styles.selectedItem]}
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onPressItem(item.Code);
          }}>
          <Highlighter
            fontStyle={isSelected ? 'Title16Semi' : 'Body16Reg'}
            colorTheme="neutral900"
            searchWords={[keyword]}
            highlightColorTheme="primary500"
            textToHighlight={`${item.Code} - ${
              lng === 'vi' ? item?.NameVi : item?.NameEn
            }`}
          />
          {isSelected && (
            <Icon icon="checkmark_fill" size={24} colorTheme="primary600" />
          )}
        </TouchableOpacity>
      );
    },
    [
      selected,
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
