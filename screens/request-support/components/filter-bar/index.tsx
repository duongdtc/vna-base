import { Colors, useStyles } from '@theme';
import { Block, Icon, Text } from '@vna-base/components';
import dayjs from 'dayjs';
import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';

export type Starus = {
  value: string | null;
  title: string;
  bgc: Colors;
  textColor: Colors;
};

export const Statuses: Record<string, Starus> = {
  done: {
    value: 'done',
    title: 'Hoàn thành',
    bgc: 'successSurface',
    textColor: 'successColor',
  },
  processing: {
    value: 'processing',
    title: 'Đang xử lý',
    bgc: 'infoSurface',
    textColor: 'infoColor',
  },
  new: {
    value: 'new',
    title: 'Tạo mới',
    bgc: 'secondSurface',
    textColor: 'secondColor',
  },
};

export const FilterBar = memo(() => {
  const {
    theme: { colors },
  } = useStyles();

  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const renderItem = useCallback<
    ListRenderItem<{
      value: string | null;
      title: string;
      bgc: Colors;
      textColor: Colors;
    }>
  >(
    ({ item, index }) => {
      const isSelected = requestStatus === item.value;

      return (
        <TouchableOpacity
          disabled={isSelected}
          onPress={() => {
            setRequestStatus(item.value);
          }}
          style={[
            {
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 4,
              backgroundColor: colors[item.bgc],
            },
            isSelected && {
              borderWidth: 1,
              borderColor: colors[item.textColor],
            },
          ]}>
          <Text
            text={item.title}
            fontStyle="Body12Med"
            colorTheme={item.textColor}
          />
        </TouchableOpacity>
      );
    },
    [colors, requestStatus],
  );

  return (
    <Block
      borderBottomWidth={5}
      borderColorTheme="neutral300"
      colorTheme="neutral100">
      <Block
        flexDirection="row"
        alignItems="center"
        padding={12}
        columnGap={12}>
        <Icon icon="calendar_fill" size={20} colorTheme="neutral800" />
        <Block flex={1}>
          <Text
            text={`Từ ${dayjs()
              .subtract(7, 'days')
              .format('DD/MM/YYYY')} đến ${dayjs().format('DD/MM/YYYY')}`}
            fontStyle="Body14Reg"
            colorTheme="neutral800"
          />
        </Block>
        <Icon icon="filter_fill" size={20} colorTheme="neutral800" />
        <Icon icon="height_fill" size={20} colorTheme="neutral800" />
      </Block>

      <FlatList
        horizontal
        data={[
          {
            value: null,
            title: 'Tất cả',
            bgc: 'neutral20',
            textColor: 'neutral100',
          },
        ].concat(Object.values(Statuses))}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 4 }}
        keyExtractor={(it, idx) => `${it.value}${idx}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Block width={8} />}
      />
    </Block>
  );
}, isEqual);
