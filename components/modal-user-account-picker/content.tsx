import { Block, Icon, Text, TextInputWithLeftIcon } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useDebounce } from '@hooks';
import { selectAllAccounts } from '@redux-selector';
import { UserAccount } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import { ActiveOpacity } from '@utils';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { ModalUserAccountPickerProps } from './type';

type Props = {
  selectedAccountId: string | null | undefined;
  handleDone: (userId: string) => void;
};

export const Content = ({
  handleDone,
  selectedAccountId,
}: Omit<ModalUserAccountPickerProps, 't18nTitle' | 'handleDone'> & Props) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const [t] = useTranslation();
  const allAccounts = useSelector(selectAllAccounts);

  const [accounts, setAccount] = useState<Array<UserAccount>>(
    Object.values(allAccounts),
  );
  const [keyword, setKeyword] = useState('');

  const _onPressItem = (id: string) => {
    handleDone(id);
  };

  const onSearch = useCallback(
    (value: string) => {
      const temp = value.trim();
      const resultSearch = Object.values(allAccounts).filter(item =>
        item.FullName?.toLowerCase().includes(temp.toLowerCase()),
      );
      setAccount(resultSearch);
    },
    [allAccounts],
  );

  useDebounce(keyword, onSearch);

  const _renderItem = useCallback<ListRenderItem<UserAccount>>(
    ({ item }) => {
      const selected = item.Id === selectedAccountId;
      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => _onPressItem(String(item.Id))}
          style={[
            styles.itemContainer,
            {
              backgroundColor: selected
                ? colors.secondary50
                : colors.neutral100,
            },
          ]}>
          <Block flex={1} justifyContent="center">
            <Text
              text={item.FullName?.toString()}
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
    [styles],
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
      <Block height={1} colorTheme="neutral200" marginHorizontal={16} />
      <BottomSheetFlatList
        keyboardShouldPersistTaps="handled"
        data={accounts}
        renderItem={_renderItem}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
        contentContainerStyle={styles.contentContainer}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
      />
    </Block>
  );
};
