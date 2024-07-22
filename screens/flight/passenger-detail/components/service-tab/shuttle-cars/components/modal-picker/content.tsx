import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Item, ModalPickerProps } from './type';

type Props = {
  selectedStatusKey: string | null;
  handleDone: (userId: string | null) => void;
  hasDescription?: boolean;
};

export const Content = ({
  handleDone,
  data,
  selectedStatusKey,
}: Omit<ModalPickerProps, 't18nTitle' | 'handleDone' | 'snapPoints'> &
  Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const [dataContent, setDataContent] = useState<Array<Item>>([]);

  const _onPressItem = useCallback(
    (id: string | null) => {
      handleDone(id);
    },
    [handleDone],
  );

  useEffect(() => {
    setDataContent(data);
  }, [data]);

  const _renderItem = useCallback<ListRenderItem<Item>>(
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
                ? colors.successSurface
                : colors.neutral10,
            },
          ]}>
          <Block flex={1} flexDirection="row" alignItems="center" columnGap={8}>
            {item.image && (
              <Block width={56} height={48} overflow="hidden">
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Block>
            )}
            {item.description ? (
              <Block rowGap={4}>
                <Text
                  t18n={item.t18n}
                  fontStyle="Body14Semi"
                  colorTheme="neutral900"
                />
                {item.description !== '' && (
                  <Block columnGap={8} flexDirection="row" alignItems="center">
                    {item.capacity && (
                      <Block
                        flexDirection="row"
                        alignItems="center"
                        columnGap={4}>
                        <Icon
                          icon="people_outline"
                          size={12}
                          colorTheme="neutral100"
                        />
                        <Text
                          text={item.capacity.toString()}
                          fontStyle="Body12Reg"
                          colorTheme={'neutral100'}
                        />
                      </Block>
                    )}
                    <Text
                      t18n={item.description as I18nKeys}
                      fontStyle="Body12Reg"
                      colorTheme="neutral80"
                    />
                  </Block>
                )}
              </Block>
            ) : (
              <Block paddingHorizontal={16}>
                <Text
                  t18n={item.t18n}
                  fontStyle="Body14Semi"
                  colorTheme={selected ? 'neutral900' : 'neutral800'}
                />
              </Block>
            )}
          </Block>
          {item?.price && (
            <Text
              text={`+ ${item?.price?.currencyFormat()}`}
              fontStyle={selected ? 'Title16Semi' : 'Body16Reg'}
              colorTheme="price"
            />
          )}
        </TouchableOpacity>
      );
    },
    [selectedStatusKey, styles, colors, _onPressItem],
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

const styleSheet = createStyleSheet(({ spacings, colors }) => ({
  input: {
    backgroundColor: colors.neutral100,
  },
  inputBase: {
    color: colors.neutral900,
  },
  itemContainer: {
    padding: spacings[16],
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacings[8],
  },
  contentContainer: { paddingBottom: UnistylesRuntime.insets.bottom },
}));
