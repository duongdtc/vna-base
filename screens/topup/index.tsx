/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  Icon,
  NormalHeader,
  RadioButton,
  RowOfForm,
  Screen,
  Separator,
  showToast,
  Text,
} from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { bankActions } from '@vna-base/redux/action-slice';
import { selectAllBankAccountsOfParent } from '@redux/selector/bank';
import {
  convertStringToNumber,
  dispatch,
  HitSlop,
  rxNumber,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { useStyles } from './styles';
import { TopupForm } from './type';
import { APP_SCREEN } from '@utils';

export const Topup = () => {
  const styles = useStyles();

  const bankAccountsOfParent = useSelector(selectAllBankAccountsOfParent);

  const formMethod = useForm<TopupForm>();

  useEffect(() => {
    if (!isEmpty(bankAccountsOfParent)) {
      formMethod.setValue('bankId', Object.values(bankAccountsOfParent)[0].Id!);
    }
  }, [bankAccountsOfParent]);

  const submit = () => {
    formMethod.handleSubmit(form => {
      dispatch(
        bankActions.getQRCode(form, isSuccess => {
          if (isSuccess) {
            navigate(APP_SCREEN.PAY);
          } else {
            showToast({
              type: 'error',
              t18n: 'pay:error_creating_transfer_information',
            });
          }
        }),
      );
    })();
  };

  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
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
                    const selected = value === item.Id;
                    return (
                      <Block key={idx}>
                        {idx !== 0 && <Separator type="horizontal" />}
                        <Pressable
                          disabled={selected}
                          onPress={() => {
                            onChange(item.Id);
                          }}
                          style={styles.bankContainer}>
                          <Block
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Block flex={1}>
                              <Text
                                text={item.Name ?? ''}
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
            textColorTheme="classicWhite"
            onPress={submit}
            disabled={!formMethod.formState.isValid}
          />
        </Block>
      </FormProvider>
    </Screen>
  );
};
