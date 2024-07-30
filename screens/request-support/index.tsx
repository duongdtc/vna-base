/* eslint-disable @typescript-eslint/ban-ts-comment */
import { goBack, navigate } from '@navigation/navigation-service';
import {
  Block,
  Button,
  Icon,
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
import { APP_SCREEN } from '@utils';
import { Shadows } from '@theme';

export type Request = {
  title: string;
  code: string;
  createDate: string;
  status: string;
  estimate?: string;
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
    estimate: '2024-07-27T15:42:16.120Z',
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

  const renderItem = useCallback<ListRenderItem<Request>>(({ item }) => {
    return (
      <Pressable
        onPress={() => {
          navigate(APP_SCREEN.REQUEST_DETAIL, {
            request: item,
          });
        }}>
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
              //@ts-ignore
              style={{ backgroundColor: colors[Statuses[item.status].bgc] }}>
              <Text
                text={Statuses[item.status].title}
                //@ts-ignore
                colorTheme={Statuses[item.status].textColor}
                fontStyle="Body12Med"
              />
            </Block>
          </Block>
          {!!item.estimate && (
            <Block
              style={{ backgroundColor: colors.errorSurface }}
              flexDirection="row"
              alignItems="center"
              borderRadius={8}
              padding={8}
              columnGap={8}>
              <Icon
                icon="alert_circle_fill"
                size={16}
                colorTheme="neutral800"
              />
              <Text
                text={`Dự kiến hoàn thành ${dayjs(item.estimate).format(
                  'DD/MM/YYYY',
                )}`}
                fontStyle="Body12Reg"
                colorTheme="neutral900"
              />
            </Block>
          )}
        </Block>
      </Pressable>
    );
  }, []);

  return (
    <Screen backgroundColor={colors.neutral20}>
      <NormalHeader
        colorTheme="neutral10"
        shadow={'.3' as unknown as Shadows}
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
            onPress={() => {
              navigate(APP_SCREEN.CREATE_REQUEST_SUPPORT);
            }}
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
