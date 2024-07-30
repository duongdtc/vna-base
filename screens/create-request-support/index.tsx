import { goBack } from '@navigation/navigation-service';
import { Shadows, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import {
  Block,
  Button,
  hideLoading,
  Icon,
  NormalHeader,
  RowOfForm,
  Screen,
  showLoading,
  Text,
} from '@vna-base/components';
import { delay, HitSlop, scale, WindowWidth } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Image, Pressable, ScrollView, TextInput } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { TypeRequires } from './dummy';
import { images } from '@vna-base/assets/image';
import { Footer } from '@screens/create-request-support/components/footer';

export type FormCreateNewRequestSupport = {
  typeRequire: string;
  description?: string | null;
  images?: Array<any> | null;
};

export const CreateRequestSupport = () => {
  const {
    theme: { colors },
  } = useStyles();

  const formMethod = useForm<FormCreateNewRequestSupport>({
    mode: 'all',
    defaultValues: {
      typeRequire: '',
      description: '',
      images: null,
    },
  });

  const submit = useCallback(() => {
    formMethod.handleSubmit(async () => {
      showLoading();
      await delay(1000);
      goBack();
      hideLoading();
    })();
  }, [formMethod]);

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
            text="Tạo yêu cầu mới"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 12, rowGap: 12 }}>
          <Block
            flexDirection="row"
            alignItems="center"
            columnGap={12}
            paddingVertical={20}
            paddingHorizontal={12}
            colorTheme="neutral100"
            borderRadius={8}>
            <Icon icon="alert_circle_fill" colorTheme="neutral800" size={16} />
            <Text
              text="Yêu cầu có thể có tối đa 1500 kí tự và 5 ảnh"
              colorTheme="neutral900"
              fontStyle="Body12Reg"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            colorTheme="neutral100"
            borderRadius={8}
            overflow="hidden">
            <RowOfForm<FormCreateNewRequestSupport>
              type="dropdown"
              t18n={'Loại yêu cầu' as I18nKeys}
              t18nBottomSheet={'Loại yêu cầu' as I18nKeys}
              name="typeRequire"
              fixedTitleFontStyle={true}
              control={formMethod.control}
              isRequire
              typeDetails={TypeRequires}
              t18nAll="common:not_choose"
              colorThemeValue="neutral700"
            />
          </Block>
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <Controller
              control={formMethod.control}
              name="description"
              render={({ field: { value, ref, onChange } }) => {
                return (
                  <Pressable
                    onPress={() => formMethod.setFocus('description')}
                    style={{ rowGap: 8 }}>
                    <Block
                      paddingTop={12}
                      paddingHorizontal={12}
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Text
                        text="Mô tả thêm"
                        fontStyle="Body16Semi"
                        colorTheme="neutral100"
                      />
                      <Icon
                        icon="edit_2_fill"
                        colorTheme="neutral80"
                        size={20}
                      />
                    </Block>
                    <Block flex={1} minHeight={240} paddingHorizontal={12}>
                      <TextInput
                        ref={ref}
                        onChangeText={onChange}
                        multiline
                        style={{
                          width: WindowWidth - scale(48),
                        }}
                        defaultValue={value!}
                        placeholder="Nhập mô tả chi tiết ở đây..."
                      />
                    </Block>
                  </Pressable>
                );
              }}
            />
          </Block>
          <Block
            flexDirection="row"
            columnGap={12}
            colorTheme="neutral100"
            padding={12}
            borderRadius={8}
            overflow="hidden">
            <Block flex={1} borderRadius={4} overflow="hidden">
              <Image
                source={images.result1}
                style={{ width: '100%', height: 226 }}
                resizeMode="cover"
              />
              <Block
                padding={4}
                colorTheme="neutral200"
                borderRadius={4}
                position="absolute"
                style={{ top: 8, right: 6 }}>
                <Icon
                  icon="trash_2_outline"
                  colorTheme="errorColor"
                  size={16}
                />
              </Block>
            </Block>
            <Block flex={1} borderRadius={4} overflow="hidden">
              <Image
                source={images.result2}
                style={{ width: '100%', height: 226 }}
                resizeMode="cover"
              />
              <Block
                padding={4}
                colorTheme="neutral200"
                borderRadius={4}
                position="absolute"
                style={{ top: 8, right: 6 }}>
                <Icon
                  icon="trash_2_outline"
                  colorTheme="errorColor"
                  size={16}
                />
              </Block>
            </Block>
            <Block flex={1} borderRadius={4} overflow="hidden">
              <Image
                source={images.result3}
                style={{ width: '100%', height: 226 }}
                resizeMode="cover"
              />
              <Block
                padding={4}
                colorTheme="neutral200"
                borderRadius={4}
                position="absolute"
                style={{ top: 8, right: 6 }}>
                <Icon
                  icon="trash_2_outline"
                  colorTheme="errorColor"
                  size={16}
                />
              </Block>
            </Block>
          </Block>
        </ScrollView>
        <Block
          shadow="main"
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            paddingBottom: UnistylesRuntime.insets.bottom + 12,
            backgroundColor: colors.neutral10,
          }}>
          <Footer onPress={submit} />
        </Block>
      </FormProvider>
    </Screen>
  );
};
