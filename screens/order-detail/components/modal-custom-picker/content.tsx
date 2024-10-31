import { Block, Icon, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTheme } from '@theme';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import { useStyles } from './styles';
import { ItemCustom, ModalCustomPickerProps } from './type';
import { I18nKeys } from '@translations/locales';

type Props = {
  selectedStatusKey: string | null;
  handleDone: (userId: string | null) => void;
  hasDescription?: boolean;
};

export const Content = ({
  handleDone,
  data,
  selectedStatusKey,
  hasDescription,
}: Omit<ModalCustomPickerProps, 't18nTitle' | 'handleDone' | 'snapPoints'> &
  Props) => {
  const styles = useStyles();
  const { colors } = useTheme();

  const [dataContent, setDataContent] = useState<Array<ItemCustom>>([]);

  const _onPressItem = useCallback(
    (id: string | null) => {
      handleDone(id);
    },
    [handleDone],
  );

  useEffect(() => {
    setDataContent(data);
  }, [data]);

  const _renderItem = useCallback<ListRenderItem<ItemCustom>>(
    ({ item }) => {
      const selected = item.key === selectedStatusKey;
      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => _onPressItem(item.key)}
          style={[
            styles.itemContainer,
            {
              backgroundColor: selected
                ? colors.secondary50
                : colors.neutral100,
            },
          ]}>
          <Block flex={1} flexDirection="row" alignItems="center" columnGap={8}>
            {item.icon && (
              <Icon
                icon={item.icon}
                size={19}
                colorTheme={item.iconColorTheme}
              />
            )}
            {hasDescription ? (
              <Block rowGap={4}>
                <Text
                  t18n={item.t18n}
                  fontStyle={selected ? 'Title16Semi' : 'Body16Reg'}
                  colorTheme={selected ? 'neutral900' : 'neutral800'}
                />
                {item.description && item.description !== '' && (
                  <Text
                    t18n={item.description as I18nKeys}
                    fontStyle="Body12Reg"
                    colorTheme={selected ? 'warning600' : 'neutral600'}
                  />
                )}
              </Block>
            ) : (
              <Text
                t18n={item.t18n}
                fontStyle={selected ? 'Title16Semi' : 'Body16Reg'}
                colorTheme={selected ? 'neutral900' : 'neutral800'}
              />
            )}
          </Block>
          {selected && (
            <Icon icon="checkmark_fill" size={24} colorTheme="primary600" />
          )}
        </TouchableOpacity>
      );
    },
    [
      selectedStatusKey,
      styles.itemContainer,
      colors.secondary50,
      colors.neutral100,
      hasDescription,
      _onPressItem,
    ],
  );

  return (
    <BottomSheetFlatList
      keyboardShouldPersistTaps="handled"
      data={dataContent}
      renderItem={_renderItem}
      keyExtractor={(item, index) => `${item.key}_${index}`}
      contentContainerStyle={styles.contentContainer}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
    />
  );
};
