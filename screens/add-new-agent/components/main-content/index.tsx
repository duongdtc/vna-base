import { Block, RowOfForm, Separator } from '@vna-base/components';
import { selectAllAgentType } from '@vna-base/redux/selector';
import { FormNewAgentType } from '@vna-base/screens/add-new-agent/type';
import { rxEmail, rxPhone } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

export const MainContent = memo(() => {
  const allAgentTypes = useSelector(selectAllAgentType);

  const { control } = useFormContext<FormNewAgentType>();

  // render
  return (
    <Block padding={12} colorTheme="neutral50" rowGap={16}>
      <Block
        borderRadius={12}
        overflow="hidden"
        colorTheme="neutral100"
        paddingBottom={8}>
        <RowOfForm<FormNewAgentType>
          type="switch"
          t18n="agent:status_active"
          name="Active"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="agent:customer_id"
          name="CustomerID"
          fixedTitleFontStyle={true}
          control={control}
          isRequire
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="agent:customer_name"
          name="AgentName"
          fixedTitleFontStyle={true}
          control={control}
          isRequire
        />
        {/* <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="dropdown"
          t18n="agent:group_customer"
          t18nBottomSheet="agent:group_customer"
          t18nAll="common:not_choose"
          name="AgentGroup"
          fixedTitleFontStyle={true}
          control={control}
          isRequire
          typeDetails={allAgentGroups}
          colorThemeValue="neutral700"
          removeAll
        /> */}
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="dropdown"
          t18n="agent:type_customer"
          t18nBottomSheet="agent:type_customer"
          t18nAll="common:not_choose"
          name="AgentType"
          fixedTitleFontStyle={true}
          control={control}
          isRequire
          typeDetails={allAgentTypes}
          colorThemeValue="neutral700"
          removeAll
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="order:phone"
          name="Phone"
          fixedTitleFontStyle={true}
          control={control}
          keyboardType="numeric"
          textContentType="telephoneNumber"
          pattern={rxPhone}
          maxLength={20}
          isRequire
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="order:email"
          name="Email"
          fixedTitleFontStyle={true}
          control={control}
          keyboardType="email-address"
          textContentType="emailAddress"
          maxLength={120}
          pattern={rxEmail}
          isRequire
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="OfficeID"
          name="OfficeID"
          fixedTitleFontStyle={true}
          control={control}
          keyboardType="email-address"
          maxLength={120}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="IATA"
          name="IATA"
          fixedTitleFontStyle={true}
          control={control}
          keyboardType="email-address"
          maxLength={120}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="order:contact"
          name="Contact"
          fixedTitleFontStyle={true}
          control={control}
          maxLength={80}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="input_info_passenger:address"
          name="Address"
          fixedTitleFontStyle={true}
          control={control}
          maxLength={120}
          textContentType="fullStreetAddress"
        />
        {/* <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="input_info_passenger:address"
          name="Address"
          fixedTitleFontStyle={true}
          control={control}
          maxLength={120}
          textContentType="fullStreetAddress"
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="dropdown"
          t18n="agent:account_booking_ticket"
          t18nBottomSheet="agent:account_booking_ticket"
          t18nAll="common:not_choose"
          name="SISetId"
          fixedTitleFontStyle={true}
          control={control}
          isRequire
          colorThemeValue="neutral700"
          typeDetails={allSISet}
          removeAll
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="dropdown"
          t18n="agent_detail:affiliated_branches"
          t18nBottomSheet="agent_detail:affiliated_branches"
          t18nAll="common:not_choose"
          name="OfficeId"
          fixedTitleFontStyle={true}
          control={control}
          isRequire
          colorThemeValue="neutral700"
          typeDetails={allOffices}
          removeAll
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="credit_info:credit_limit"
          name="CreditLimit"
          fixedTitleFontStyle={true}
          control={control}
          maxLength={120}
          processValue={val => convertStringToNumber(val).currencyFormat()}
          textContentType="fullStreetAddress"
          styleInput={{
            color: colors.neutral700,
            ...FontStyle.Title16Semi,
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          t18n="credit_info:guarantee"
          name="Guarantee"
          fixedTitleFontStyle={true}
          control={control}
          maxLength={120}
          processValue={val => convertStringToNumber(val).currencyFormat()}
          textContentType="fullStreetAddress"
          styleInput={{
            color: colors.neutral700,
            ...FontStyle.Title16Semi,
          }}
        /> */}
      </Block>
      {/* <Text
        t18n="add_new_user_acc:usage_rights"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block
        borderRadius={12}
        overflow="hidden"
        colorTheme="neutral100"
        paddingBottom={8}>
        <RowOfForm<FormNewAgentType>
          type="switch"
          t18n="common:search"
          name="AllowSearch"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="switch"
          t18n="common:book"
          name="AllowBook"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="switch"
          t18n="common:issue"
          name="AllowIssue"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="switch"
          t18n="common:void_ticket"
          name="AllowVoid"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormNewAgentType>
          type="switch"
          t18n="add_new_agent:useB2b"
          name="UseB2B"
          fixedTitleFontStyle={true}
          control={control}
        />
      </Block> */}
    </Block>
  );
}, isEqual);
