/* eslint-disable no-nested-ternary */
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStyles } from '@theme';
import { APP_SCREEN, RootStackParamList } from '@utils';
import { images } from '@vna-base/assets/image';
import {
  Block,
  Button,
  Icon,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { HitSlop, WindowWidth } from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { Image, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { UnistylesRuntime } from 'react-native-unistyles';

export const RequestDetail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.REQUEST_DETAIL>) => {
  const {
    theme: { colors },
  } = useStyles();

  const { title, status, code, createDate } = route.params.request;
  const sharedValue = useSharedValue(0);

  React.useEffect(() => {
    sharedValue.value = withRepeat(withTiming(1, { duration: 700 }), -1);
  }, [sharedValue]);

  const animatedLoading = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sharedValue.value * 360}deg` }],
  }));

  return (
    <Screen backgroundColor={colors.neutral20}>
      <NormalHeader
        colorTheme="neutral10"
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
          <Block rowGap={2}>
            <Text
              fontStyle="Title20Semi"
              text={title}
              colorTheme="neutral900"
            />
            <Text
              textAlign="center"
              text={`${code} - ${dayjs(createDate).format('DD/MM/YYYY')}`}
              fontStyle="Body10Med"
              colorTheme="neutral80"
            />
          </Block>
        }
      />
      <Block colorTheme="neutral100" paddingVertical={12} rowGap={8}>
        <Block
          paddingHorizontal={32}
          flexDirection="row"
          alignItems="center"
          columnGap={4}>
          <Block>
            {status === 'new' ? (
              <Animated.Image
                source={images.loading}
                style={[{ width: 20, height: 20 }, animatedLoading]}
              />
            ) : (
              <Icon
                icon="checkmark_circle_fill"
                size={22}
                colorTheme="successColor"
              />
            )}
          </Block>
          <Block
            width={(WindowWidth - 136) / 2}
            height={1}
            colorTheme={
              status === 'processing' || status === 'done'
                ? 'success500'
                : 'neutral50'
            }
          />
          <Block>
            {status === 'processing' ? (
              <Animated.Image
                source={images.loading}
                style={[{ width: 20, height: 20 }, animatedLoading]}
              />
            ) : status !== 'new' ? (
              <Icon
                icon="checkmark_circle_fill"
                size={22}
                colorTheme="successColor"
              />
            ) : (
              <Image
                source={images.non_loading}
                style={[{ width: 20, height: 20 }]}
              />
            )}
          </Block>
          <Block
            width={(WindowWidth - 136) / 2}
            height={1}
            colorTheme={status === 'done' ? 'success500' : 'neutral50'}
          />
          <Block>
            {status !== 'done' ? (
              <Image
                source={images.non_loading}
                style={[{ width: 20, height: 20 }]}
              />
            ) : (
              <Icon
                icon="checkmark_circle_fill"
                size={22}
                colorTheme="successColor"
              />
            )}
          </Block>
        </Block>
        <Block
          flexDirection="row"
          alignItems="center"
          paddingLeft={20}
          paddingRight={8}
          justifyContent="space-between">
          <Block flex={1} alignItems="flex-start">
            <Text
              text="Tạo mới"
              fontStyle="Body12Med"
              colorTheme={status !== 'new' ? 'successColor' : 'secondColor'}
            />
          </Block>
          <Block flex={1}>
            <Text
              textAlign="center"
              text="Đang xử lý"
              fontStyle="Body12Med"
              colorTheme={
                status === 'processing'
                  ? 'secondColor'
                  : status === 'done'
                  ? 'successColor'
                  : 'neutral60'
              }
            />
          </Block>
          <Block flex={1} alignItems="flex-end">
            <Text
              text="Hoàn thành"
              fontStyle="Body12Med"
              colorTheme={status === 'done' ? 'success500' : 'neutral60'}
            />
          </Block>
        </Block>
      </Block>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: UnistylesRuntime.insets.bottom,
        }}
        showsVerticalScrollIndicator={false}>
        <Block flex={1} paddingTop={20} paddingHorizontal={12} rowGap={12}>
          <Block>
            <Block
              colorTheme="neutral100"
              borderRadius={8}
              overflow="hidden"
              padding={12}
              rowGap={4}>
              <Text
                text="Nội dung yêu cầu"
                fontStyle="Body16Semi"
                colorTheme="neutral70"
              />
              <Block>
                <Text
                  text="Mã đặt chỗ: ZDU9CF"
                  fontStyle="Body14Reg"
                  colorTheme="neutral100"
                />
                <Text
                  text="1. VU QUANG TUAN"
                  fontStyle="Body14Reg"
                  colorTheme="neutral100"
                />
                <Text
                  text="2. VU QUANG MANH"
                  fontStyle="Body14Reg"
                  colorTheme="neutral100"
                />
              </Block>
            </Block>
            <Block
              zIndex={999}
              position="absolute"
              style={{ top: -20, right: 8 }}>
              <Icon icon="arrow_up_1_fill" size={40} colorTheme="neutral10" />
            </Block>
          </Block>
          <Block
            flexDirection="row"
            columnGap={12}
            colorTheme="neutral100"
            padding={12}
            borderRadius={8}
            overflow="hidden">
            <Block borderRadius={4} overflow="hidden">
              <Image
                source={images.result1}
                style={{ maxWidth: 80, height: 168 }}
                resizeMode="cover"
              />
            </Block>
            <Block borderRadius={4} overflow="hidden">
              <Image
                source={images.result2}
                style={{ maxWidth: 80, height: 168 }}
                resizeMode="cover"
              />
            </Block>
            <Block borderRadius={4} overflow="hidden">
              <Image
                source={images.result3}
                style={{ maxWidth: 80, height: 168 }}
                resizeMode="cover"
              />
            </Block>
          </Block>
          {status !== 'new' && (
            <Block marginTop={12}>
              <Block
                style={{
                  backgroundColor: colors.primarySurface,
                }}
                borderRadius={8}
                overflow="hidden"
                padding={12}
                rowGap={4}>
                <Text
                  text="Phản hồi"
                  fontStyle="Body16Semi"
                  colorTheme="neutral70"
                />
                <Text
                  text="Cảm ơn quý khách đã để lại yêu cầu. yêu cầu cảu quý khách đang được tiếp nhận. Để giải đáp thắc mắc nhanh chóng, vui lòng liên hệ hotline 09888888 để được hỗ trợ nhanh nhất!"
                  fontStyle="Body14Reg"
                  colorTheme="neutral100"
                />
              </Block>
              <Block
                zIndex={999}
                position="absolute"
                style={{ top: -20, left: 8 }}>
                <Icon
                  icon="arrow_up_1_fill"
                  size={40}
                  colorTheme="primarySurface"
                />
              </Block>
            </Block>
          )}
          {status === 'done' && (
            <>
              <Block marginTop={12}>
                <Block
                  style={{
                    backgroundColor: colors.primarySurface,
                  }}
                  borderRadius={8}
                  overflow="hidden"
                  padding={12}>
                  <Text
                    text="Yêu cầu của quý khách đã được xử lý xong. Cảm ơn quý khách đã sử dụng dịch vụ."
                    fontStyle="Body14Reg"
                    colorTheme="neutral100"
                  />
                </Block>
                <Block
                  zIndex={999}
                  position="absolute"
                  style={{ top: -20, left: 8 }}>
                  <Icon
                    icon="arrow_up_1_fill"
                    size={40}
                    colorTheme="primarySurface"
                  />
                </Block>
              </Block>
              <Text
                textAlign="center"
                fontStyle="Body12Med"
                colorTheme="neutral70">
                {'Đã xử lý yêu cầu: '}
                <Text fontStyle="Body12Med" colorTheme="successColor">
                  {dayjs().subtract(4, 'day').format('DD/MM/YYYY') + ' '}
                  <Text
                    text={dayjs().subtract(4, 'day').format('HH:mm')}
                    fontStyle="Body12Bold"
                    colorTheme="successColor"
                  />
                </Text>
              </Text>
            </>
          )}
        </Block>
      </ScrollView>
    </Screen>
  );
};
