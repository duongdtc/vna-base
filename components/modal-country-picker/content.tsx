import { Block, Icon, Text, TextInputWithLeftIcon } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useDebounce } from '@vna-base/hooks';
import { selectLanguage } from '@redux-selector';
import { CountryCode, CountryRealm } from '@services/realm/models';
import { useQuery } from '@services/realm/provider';
import { ActiveOpacity } from '@utils';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { ModalCountryPickerProps } from './type';

type Props = {
  selectedCountry: CountryCode | undefined;
  handleDone: (country: CountryCode) => void;
};

export const Content = ({
  handleDone,
  selectedCountry,
  showDialCode = false,
}: Omit<ModalCountryPickerProps, 't18nTitle' | 'handleDone'> & Props) => {
  const styles = useStyles();
  const [t] = useTranslation();
  const lng = useSelector(selectLanguage);
  const allCountries = useQuery<CountryRealm>(CountryRealm.schema.name);
  const [keyword, setKeyword] = useState('');
  const [countries, setCountries] = useState<Array<CountryRealm>>([]);

  const _onPressItem = (item: CountryRealm) => {
    handleDone(item.Code);
  };

  const onSearch = useCallback((value: string) => {
    setCountries(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [
        ...allCountries.filtered(
          'Code CONTAINS[c] $0 OR NameVi CONTAINS[c] $0 OR NameEn CONTAINS[c] $0 OR DialCode CONTAINS[c] $0',
          value.trim().toLowerCase(),
        ),
      ],
    );
  }, []);

  const sortedArrayCountries = useMemo(() => {
    const indexSelected = countries.findIndex(
      country => country.Code === selectedCountry,
    );
    if (indexSelected === -1) {
      return countries;
    }

    const selectedItem = countries[indexSelected];
    countries.splice(indexSelected, 1);
    countries.unshift(selectedItem);
    return countries;
  }, [countries]);

  useDebounce(keyword, onSearch, 300);

  const _renderItem = useCallback<ListRenderItem<CountryRealm>>(
    ({ item }) => {
      const selected = item.Code === selectedCountry;
      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => _onPressItem(item)}
          style={styles.itemContainer}>
          <Block borderRadius={2} overflow="hidden">
            <CountryFlag isoCode={item.Code.toLowerCase()} size={12} />
          </Block>
          <Block flex={1} justifyContent="center">
            <Text
              text={`${lng === 'en' ? item.NameEn : item.NameVi} ${
                showDialCode ? item.DialCode : ''
              }`}
              fontStyle={selected ? 'Title16Semi' : 'Body16Reg'}
              colorTheme={selected ? 'neutral900' : 'neutral800'}
            />
          </Block>
          {selected && (
            <Icon icon="checkmark_fill" size={24} colorTheme="primary600" />
          )}
        </TouchableOpacity>
      );
    },
    [selectedCountry, styles.itemContainer, lng],
  );

  return (
    <Block flex={1}>
      <TextInputWithLeftIcon
        leftIcon="search_fill"
        style={styles.input}
        styleInput={styles.inputBase}
        leftIconColorTheme="neutral800"
        leftIconSize={24}
        onChangeText={setKeyword}
        placeholder={t('common:search')}
      />
      <BottomSheetFlatList
        keyboardShouldPersistTaps="handled"
        data={sortedArrayCountries}
        renderItem={_renderItem}
        keyExtractor={item => item.Code}
        contentContainerStyle={styles.contentContainer}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
      />
    </Block>
  );
};
