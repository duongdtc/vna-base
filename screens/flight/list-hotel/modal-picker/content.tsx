import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Item, ModalPickerProps } from './type';
import { RoomEnum } from '../dummy';

type Props = {
  selectedStatusKey: RoomEnum;
  handleDone: (key: RoomEnum) => void;
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
    (id: RoomEnum) => {
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
          <Block flexDirection="row" alignItems="center" columnGap={8}>
            {item.image && (
              <Block width={98} height={82} overflow="hidden">
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Block>
            )}
            <Block rowGap={4}>
              <Text
                t18n={item.t18n}
                fontStyle={'Body14Semi'}
                colorTheme={'neutral100'}
              />
              <Block flexDirection="row" alignItems="center" columnGap={8}>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon="people_outline"
                    size={12}
                    colorTheme="neutral100"
                  />
                  <Text
                    text={item.people}
                    fontStyle="Body10Reg"
                    colorTheme="neutral80"
                  />
                </Block>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon icon="crop_outline" size={12} colorTheme="neutral100" />
                  <Text
                    text={item.acreage}
                    fontStyle="Body10Reg"
                    colorTheme="neutral80"
                  />
                </Block>
              </Block>
              {item.description1 && (
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon="checkmark_circle_2_fill"
                    size={12}
                    colorTheme="neutral80"
                  />
                  <Text
                    text={item.description1}
                    fontStyle="Body10Reg"
                    colorTheme="neutral80"
                  />
                </Block>
              )}
              {item.description2 && (
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon="checkmark_circle_2_fill"
                    size={12}
                    colorTheme="neutral80"
                  />
                  <Text
                    text={item.description2}
                    fontStyle="Body10Reg"
                    colorTheme="neutral80"
                  />
                </Block>
              )}
              {item.description3 && (
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon="checkmark_circle_2_fill"
                    size={12}
                    colorTheme="neutral80"
                  />
                  <Text
                    text={item.description3}
                    fontStyle="Body10Reg"
                    colorTheme="neutral80"
                  />
                </Block>
              )}
            </Block>
          </Block>
          <Block position="absolute" style={{ bottom: 8, right: 8 }}>
            <Text
              text={`+ ${item?.price?.currencyFormat()}`}
              fontStyle={'Body14Semi'}
              colorTheme="price"
            />
          </Block>
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
      ItemSeparatorComponent={() => <Block height={8} />}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
    />
  );
};

const styleSheet = createStyleSheet(
  ({ spacings, colors, shadows, borders }) => ({
    input: {
      backgroundColor: colors.neutral100,
    },
    inputBase: {
      color: colors.neutral900,
    },
    itemContainer: {
      padding: spacings[8],
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacings[8],
      borderWidth: borders[10],
      borderColor: colors.neutral200,
      borderRadius: spacings[8],
      ...shadows.small,
    },
    contentContainer: {
      paddingBottom: UnistylesRuntime.insets.bottom,
      margin: spacings[8],
    },
  }),
);
