import { Block, DescriptionsBooking, RowOfForm, Separator } from '@vna-base/components';
import { CreditInfoForm } from '@vna-base/screens/credit-info/type';
import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { rxStringNumber, convertStringToNumber } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';

export const MainContent = memo(() => {
  const { colors } = useTheme();

  const { control } = useFormContext<CreditInfoForm>();

  return (
    <Block padding={12} colorTheme="neutral50" rowGap={12}>
      <Block borderRadius={12} overflow="hidden" colorTheme="neutral100">
        <RowOfForm<CreditInfoForm>
          control={control}
          name="Deposit"
          t18n="credit_info:deposit"
          disable
          fixedTitleFontStyle
          processValue={val => convertStringToNumber(val).currencyFormat()}
          styleInput={{
            color: colors.neutral700,
            ...FontStyle.Title16Semi,
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<CreditInfoForm>
          control={control}
          name="Guarantee"
          t18n="credit_info:guarantee"
          fixedTitleFontStyle
          pattern={rxStringNumber}
          keyboardType="number-pad"
          processValue={val => convertStringToNumber(val).currencyFormat()}
          styleInput={{
            color: colors.neutral700,
            ...FontStyle.Title16Semi,
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<CreditInfoForm>
          control={control}
          name="CreditLimit"
          t18n="credit_info:credit_limit"
          fixedTitleFontStyle
          pattern={rxStringNumber}
          keyboardType="numeric"
          processValue={val => convertStringToNumber(val).currencyFormat()}
          maxLength={20}
          styleInput={{
            color: colors.neutral700,
            ...FontStyle.Title16Semi,
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<CreditInfoForm>
          control={control}
          name="Balance"
          t18n="credit_info:balance"
          fixedTitleFontStyle
          disable
          processValue={val => convertStringToNumber(val).currencyFormat()}
          styleInput={{
            color: colors.error500,
            ...FontStyle.Title16Semi,
          }}
        />
      </Block>
      <DescriptionsBooking
        t18n="credit_info:description"
        colorTheme="neutral100"
      />
    </Block>
  );
}, isEqual);
