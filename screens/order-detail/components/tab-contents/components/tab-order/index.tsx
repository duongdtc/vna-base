import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { FormOrderDetailType } from '@vna-base/screens/order-detail/type';
import { LanguageSystemDetails } from '@vna-base/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView } from 'react-native';

export const TabOrder = () => {
  const { control } = useFormContext<FormOrderDetailType>();

  const convertLanguage = (lng: string) => {
    if (lng === 'vi') {
      return (
        <Text fontStyle="Body14Reg" colorTheme="neutral900" t18n="common:vi" />
      );
    }

    return (
      <Text fontStyle="Body14Reg" colorTheme="neutral900" t18n="common:en" />
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Block
        margin={12}
        borderRadius={8}
        overflow="hidden"
        colorTheme="neutral100">
        {/* //cmt: ngôn ngữ */}
        <RowOfForm<FormOrderDetailType>
          type="dropdown"
          typeDetails={LanguageSystemDetails}
          t18n="order_detail:language"
          name="FormOrder.Language"
          fixedTitleFontStyle={true}
          t18nAll="common:not_choose"
          t18nBottomSheet="order_detail:language"
          ValueView={convertLanguage}
          control={control}
        />
        {/* //cmt: địa chỉ ip */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="order_detail:ip_address"
          name="FormOrder.IPAddress"
          fixedTitleFontStyle={true}
          keyboardType="number-pad"
          control={control}
        />

        {/* //cmt: tiền tệ */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          disable={true}
          t18n="order_detail:equiv_currency"
          name="FormOrder.Currency"
          fixedTitleFontStyle={true}
          control={control}
        />

        {/* //cmt: Gốc */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          disable={true}
          t18n="order_detail:currency"
          name="FormOrder.EquivCurrency"
          fixedTitleFontStyle={true}
          control={control}
        />

        {/* //cmt: tỉ giá */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="order_detail:rate"
          name="FormOrder.CurrencyRate"
          keyboardType="number-pad"
          maxLength={6}
          fixedTitleFontStyle={true}
          control={control}
        />
      </Block>
    </ScrollView>
  );
};
