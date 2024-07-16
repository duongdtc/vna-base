import { Block, RowOfForm, Separator } from '@vna-base/components';
import { FormOrderDetailType } from '@vna-base/screens/order-detail/type';
import { PronounDetails, rxEmail, SnapPoint } from '@vna-base/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView } from 'react-native';

export const TabContact = () => {
  const { control } = useFormContext<FormOrderDetailType>();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Block
        margin={12}
        borderRadius={8}
        overflow="hidden"
        colorTheme="neutral100">
        {/* //cmt: Danh xưng */}
        <RowOfForm<FormOrderDetailType>
          type="dropdown"
          typeDetails={PronounDetails}
          t18n="order_detail:call_by_name"
          name="FormContact.ContactTitle"
          fixedTitleFontStyle={true}
          t18nAll="common:not_choose"
          t18nBottomSheet="order_detail:call_by_name"
          snapPoint={[SnapPoint['40%']]}
          control={control}
        />

        {/* //cmt: Họ và tên */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="input_info_passenger:full_name"
          name="FormContact.ContactName"
          fixedTitleFontStyle={true}
          t18nAll="common:not_fill"
          control={control}
          maxLength={80}
          autoCapitalize="characters"
        />

        {/* //cmt: Điện thoại */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="input_info_passenger:phone_number"
          name="FormContact.ContactPhone"
          fixedTitleFontStyle={true}
          t18nAll="common:not_fill"
          control={control}
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          maxLength={20}
        />

        {/* //cmt: Email */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="input_info_passenger:email"
          name="FormContact.ContactEmail"
          fixedTitleFontStyle={true}
          t18nAll="common:not_fill"
          control={control}
          keyboardType="email-address"
          textContentType="emailAddress"
          maxLength={120}
          pattern={rxEmail}
        />

        {/* //cmt: Địa chỉ */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="input_info_passenger:address"
          name="FormContact.ContactAddress"
          fixedTitleFontStyle={true}
          t18nAll="common:not_fill"
          control={control}
          textContentType="fullStreetAddress"
          maxLength={120}
        />

        {/* //cmt: Ghi chú */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormOrderDetailType>
          t18n="input_info_passenger:note"
          name="FormContact.ContactRemark"
          fixedTitleFontStyle={true}
          t18nAll="common:not_fill"
          control={control}
          textContentType="fullStreetAddress"
          maxLength={200}
        />
      </Block>
    </ScrollView>
  );
};
