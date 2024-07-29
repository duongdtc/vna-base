import { goBack } from '@navigation/navigation-service';
import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { HitSlop } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { FilterBar, Statuses } from './components/filter-bar';

type Request = {
  title: string;
  code: string;
  createDate: string;
  status: string;
};

const RequestsFake: Array<Request> = [
  {
    title: 'Tìm kiếm chuyến bay',
    code: 'YC12345',
    createDate: '2024-07-29T15:42:16.120Z',
    status: 'new',
  },
  {
    title: 'Thanh toán',
    code: 'YC12385',
    createDate: '2024-07-28T15:42:16.120Z',
    status: 'new',
  },
  {
    title: 'Đặt dịch vụ/hành lý',
    code: 'YC12342',
    createDate: '2024-07-24T15:42:16.120Z',
    status: 'processing',
  },
  {
    title: 'Tìm kiếm chuyến bay',
    code: 'YC12945',
    createDate: '2024-06-29T15:42:16.120Z',
    status: 'done',
  },
  {
    title: 'Thao tác booking',
    code: 'YC12305',
    createDate: '2024-06-18T15:42:16.120Z',
    status: 'done',
  },
  {
    title: 'Gửi email',
    code: 'YC12315',
    createDate: '2024-06-01T15:42:16.120Z',
    status: 'done',
  },
];

export const RequestSupport = () => {
  const {
    theme: { colors },
  } = useStyles();

  const renderItem = useCallback<ListRenderItem<Request>>(({ item, index }) => {
    return (
      <Pressable onPress={() => {}}>
        <Block padding={12} rowGap={12} colorTheme="neutral100">
          <Text
            text={`${item.title} - [${item.code}]`}
            fontStyle="Title16Semi"
            colorTheme="neutral100"
          />
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              text={`Ngày tạo: ${dayjs(item.createDate).format('DD/MM/YYYY')}`}
              fontStyle="Body12Reg"
              colorTheme="neutral500"
            />
            <Block
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={4}
              style={{ backgroundColor: colors[Statuses[item.status].bgc] }}>
              <Text
                text={Statuses[item.status].title}
                colorTheme={Statuses[item.status].textColor}
                fontStyle="Body12Med"
              />
            </Block>
          </Block>
        </Block>
      </Pressable>
    );
  }, []);

  return (
    <Screen backgroundColor={colors.neutral20}>
      <NormalHeader
        colorTheme="neutral10"
        shadow=".3"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_fill"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            text="Yêu cầu hỗ trợ"
            colorTheme="neutral900"
          />
        }
        rightContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="plus_outline"
            leftIconSize={24}
            textColorTheme="neutral900"
            padding={4}
          />
        }
      />
      <FilterBar />
      <FlatList
        data={RequestsFake}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: UnistylesRuntime.insets.bottom + 12,
        }}
        ItemSeparatorComponent={() => <Block height={12} />}
        renderItem={renderItem}
      />
    </Screen>
  );
};
