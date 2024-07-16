import { Block, Icon, RowOfForm, Separator, Text } from '@vna-base/components';
import {
  selectAgentDetailById,
  selectAllAgentGroup,
  selectAllAgentType,
  selectAllOffice,
} from '@redux-selector';
import { agentActions } from '@redux-slice';
import { FormAgentDetail } from '@vna-base/screens/agent-detail/type';
import { useTheme } from '@theme';
import { rxEmail, rxPhone, dispatch } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export const GeneralTab = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  const agentDetail = useSelector(selectAgentDetailById);
  const allAgentGroups = useSelector(selectAllAgentGroup);
  const allAgentTypes = useSelector(selectAllAgentType);
  const allOffices = useSelector(selectAllOffice);

  const { control } = useFormContext<FormAgentDetail>();

  const pull2Refresh = useCallback(() => {
    dispatch(agentActions.getAgentDetailById(agentDetail.Id!));
  }, [agentDetail.Id]);

  return (
    <Block flex={1} colorTheme="neutral50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={pull2Refresh}
            tintColor={colors.neutral900}
          />
        }
        contentContainerStyle={{
          padding: 12,
          paddingBottom: bottom,
        }}>
        <Pressable onPress={() => {}}>
          <Block
            flexDirection="row"
            alignItems="center"
            colorTheme="neutral100"
            paddingVertical={12}
            paddingLeft={16}
            paddingRight={12}
            borderRadius={12}
            justifyContent="space-between">
            <Text
              t18n="agent:staff_in_charge"
              colorTheme="neutral900"
              fontStyle="Body16Reg"
            />
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text text="N/A" colorTheme="primary600" fontStyle="Body14Semi" />
              <Icon
                icon="arrow_ios_right_fill"
                size={20}
                colorTheme="neutral700"
              />
            </Block>
          </Block>
        </Pressable>
        <Block
          flex={1}
          marginTop={12}
          colorTheme="neutral100"
          borderRadius={12}>
          <RowOfForm<FormAgentDetail>
            type="switch"
            t18n="agent:status_active"
            name="GeneralTab.Active"
            fixedTitleFontStyle={true}
            control={control}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:customer_id"
            name="GeneralTab.CustomerID"
            fixedTitleFontStyle={true}
            control={control}
            isRequire
            styleInput={{ color: colors.neutral700 }}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:customer_name"
            name="GeneralTab.AgentName"
            fixedTitleFontStyle={true}
            control={control}
            isRequire
            styleInput={{ color: colors.neutral700 }}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            type="dropdown"
            t18n="agent:group_customer"
            t18nBottomSheet="agent:group_customer"
            name="GeneralTab.AgentGroup"
            fixedTitleFontStyle={true}
            control={control}
            isRequire
            typeDetails={allAgentGroups}
            colorThemeValue="neutral700"
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            type="dropdown"
            t18n="agent:type_customer"
            t18nBottomSheet="agent:type_customer"
            name="GeneralTab.AgentType"
            fixedTitleFontStyle={true}
            control={control}
            isRequire
            typeDetails={allAgentTypes}
            colorThemeValue="neutral700"
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="order:phone"
            name="GeneralTab.Phone"
            fixedTitleFontStyle={true}
            control={control}
            keyboardType="numeric"
            textContentType="telephoneNumber"
            pattern={rxPhone}
            maxLength={20}
            styleInput={{ color: colors.neutral700 }}
            isRequire
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="order:email"
            name="GeneralTab.Email"
            fixedTitleFontStyle={true}
            control={control}
            keyboardType="email-address"
            textContentType="emailAddress"
            maxLength={120}
            styleInput={{ color: colors.neutral700 }}
            pattern={rxEmail}
            isRequire
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="order:contact"
            name="GeneralTab.Contact"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={80}
            styleInput={{ color: colors.neutral700 }}
            isRequire
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            type="dropdown"
            t18n="agent_detail:affiliated_branches"
            t18nBottomSheet="agent_detail:affiliated_branches"
            name="GeneralTab.OfficeId"
            fixedTitleFontStyle={true}
            control={control}
            isRequire
            colorThemeValue="neutral700"
            typeDetails={allOffices}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="input_info_passenger:address"
            name="GeneralTab.Address"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={120}
            styleInput={{ color: colors.neutral700 }}
            textContentType="fullStreetAddress"
          />
        </Block>
        <Block
          flex={1}
          marginTop={12}
          colorTheme="neutral100"
          borderRadius={12}>
          <RowOfForm<FormAgentDetail>
            t18n="agent:business_name"
            name="CompanyInfo.Company"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={120}
            styleInput={{ color: colors.neutral700 }}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:tax_code"
            name="CompanyInfo.TaxCode"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={30}
            styleInput={{ color: colors.neutral700 }}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:account_number"
            name="CompanyInfo.BankNumb"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={30}
            styleInput={{ color: colors.neutral700 }}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:bank_name"
            name="CompanyInfo.BankName"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={80}
            styleInput={{ color: colors.neutral700 }}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:founding_date"
            t18nDatePicker="agent:founding_date"
            name="CompanyInfo.StartupDate"
            fixedTitleFontStyle={true}
            type="date-picker"
            colorThemeValue="neutral700"
            control={control}
          />
          <Separator type="horizontal" size={3} />

          <RowOfForm<FormAgentDetail>
            t18n="agent:cooperation_date"
            t18nDatePicker="agent:cooperation_date"
            name="CompanyInfo.ContractDate"
            fixedTitleFontStyle={true}
            type="date-picker"
            control={control}
            colorThemeValue="neutral700"
          />
          <Separator type="horizontal" size={3} />
        </Block>
      </ScrollView>
    </Block>
  );
};
