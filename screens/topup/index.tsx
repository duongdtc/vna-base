/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { goBack, navigate } from '@navigation/navigation-service';
import {
  Block,
  Button,
  Icon,
  Image,
  NormalHeader,
  RadioButton,
  RowOfForm,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import {
  convertStringToNumber,
  HitSlop,
  rxNumber,
  scale,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';

import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Bank, bankAccountsOfParent, TopupForm } from './type';

export const Topup = () => {
  const { styles } = useStyles(styleSheet);

  const formMethod = useForm<TopupForm>();

  useEffect(() => {
    if (!isEmpty(bankAccountsOfParent)) {
      formMethod.setValue(
        'bankId',
        Object.values(bankAccountsOfParent)[0].key as Bank,
      );
    }
  }, [bankAccountsOfParent]);

  const submit = () => {
    formMethod.handleSubmit(form => {
      navigate(APP_SCREEN.PAY, { data: form });
    })();
  };

  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral10"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_fill"
            leftIconSize={24}
            textColorTheme="neutral100"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            t18n="home:top_up"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.body}
          contentContainerStyle={styles.contentContainer}>
          <Block>
            <Text
              t18n="topup:enter_amount"
              colorTheme="neutral900"
              fontStyle="Title20Semi"
            />
            <Block borderRadius={12} marginTop={8} overflow="hidden">
              <RowOfForm<TopupForm>
                t18n="topup:placeholder_input"
                placeholderI18n="topup:placeholder_input"
                name="amount"
                validate={txt => convertStringToNumber(txt) >= 10_000}
                maxLength={14}
                style={styles.amountInput}
                isRequire
                pattern={rxNumber}
                keyboardType="number-pad"
                fixedTitleFontStyle
                processValue={txt =>
                  txt === '' ? txt : convertStringToNumber(txt).currencyFormat()
                }
              />
            </Block>
            <Block
              flexDirection="row"
              columnGap={4}
              alignItems="center"
              marginTop={4}>
              <Icon
                icon="alert_circle_fill"
                size={16}
                colorTheme="neutral600"
              />
              <Text
                t18n="topup:min_amount"
                colorTheme="neutral700"
                fontStyle="Body12Reg"
              />
            </Block>
          </Block>
          <Block paddingTop={12} rowGap={8}>
            <Text
              t18n="topup:select_bank"
              colorTheme="neutral900"
              fontStyle="Title20Semi"
            />
            <Controller
              control={formMethod.control}
              name="bankId"
              render={({ field: { value, onChange } }) => (
                <Block
                  borderRadius={12}
                  colorTheme="neutral100"
                  overflow="hidden">
                  {Object.values(bankAccountsOfParent).map((item, idx) => {
                    const selected = value === item.key;
                    return (
                      <Block key={idx}>
                        {idx !== 0 && <Separator type="horizontal" />}
                        <Pressable
                          disabled={selected}
                          onPress={() => {
                            onChange(item.key);
                          }}
                          style={styles.bankContainer}>
                          <Block
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Block
                              flex={1}
                              flexDirection="row"
                              alignItems="center"
                              columnGap={8}>
                              <Image
                                resizeMode="cover"
                                source={item.logo}
                                containerStyle={styles.img}
                              />
                              <Text
                                text={item.t18n ?? ''}
                                fontStyle="Body14Semi"
                                colorTheme="neutral900"
                              />
                            </Block>
                            <RadioButton
                              sizeDot={14}
                              value={selected}
                              disable
                              opacity={1}
                            />
                          </Block>
                        </Pressable>
                      </Block>
                    );
                  })}
                </Block>
              )}
            />
          </Block>
          <Block
            padding={12}
            colorTheme="warning50"
            borderRadius={8}
            flexDirection="row"
            alignItems="center"
            columnGap={8}>
            <Icon icon="alert_circle_fill" size={16} colorTheme="neutral800" />
            <Block flex={1}>
              <Text
                t18n="topup:subscription"
                colorTheme="neutral900"
                fontStyle="Body12Reg"
              />
            </Block>
          </Block>
        </ScrollView>
        <Block style={styles.footer}>
          <Button
            fullWidth
            t18n="topup:confirm"
            buttonColorTheme="primary600"
            textColorTheme="white"
            onPress={submit}
            disabled={!formMethod.formState.isValid}
          />
        </Block>
      </FormProvider>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, shadows, textPresets }) => ({
  container: { backgroundColor: colors.neutral10 },
  contentContainer: {
    padding: scale(12),
    rowGap: scale(12),
  },
  body: {
    backgroundColor: colors.neutral30,
  },
  footer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    backgroundColor: colors.neutral10,
    paddingBottom: scale(12) + UnistylesRuntime.insets.bottom,
    ...shadows.main,
  },
  bankContainer: {
    paddingVertical: scale(20),
    paddingHorizontal: scale(16),
  },
  amountInput: {
    color: colors.price,
    ...textPresets.Body14Semi,
  },
  img: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
}));
