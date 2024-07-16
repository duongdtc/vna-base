import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { FormAgentInfoType } from '@vna-base/screens/agent-info/type';
import { useTheme } from '@theme';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const MainInfo = () => {
  const { colors } = useTheme();
  const { control } = useFormContext<FormAgentInfoType>();

  return (
    <Block flex={1} colorTheme="neutral50" paddingHorizontal={12} rowGap={16}>
      <Text
        t18n="agent:general_info"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block colorTheme="neutral100" borderRadius={12} overflow="hidden">
        <RowOfForm<FormAgentInfoType>
          t18n="add_new_agent:agent_code"
          name="GeneralTab.AgentCode"
          maxLength={20}
          control={control}
          autoCapitalize="characters"
          style={{ color: colors.neutral900 }}
          fixedTitleFontStyle
          disable
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n="agent:customer_id"
          name="GeneralTab.CustomerID"
          maxLength={20}
          control={control}
          autoCapitalize="characters"
          style={{ color: colors.neutral900 }}
          fixedTitleFontStyle
          disable
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n="agent:business_name"
          name="CompanyInfo.Company"
          maxLength={20}
          control={control}
          style={{ color: colors.neutral900 }}
          fixedTitleFontStyle
          // isRequire
          disable
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n="input_info_passenger:phone_number"
          name="GeneralTab.Phone"
          maxLength={20}
          control={control}
          style={{ color: colors.neutral900 }}
          fixedTitleFontStyle
          // isRequire
          disable
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n="input_info_passenger:email"
          name="GeneralTab.Email"
          maxLength={20}
          control={control}
          style={{ color: colors.neutral900 }}
          fixedTitleFontStyle
          // isRequire
          disable
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n="input_info_passenger:address"
          name="GeneralTab.Address"
          maxLength={20}
          control={control}
          style={{ color: colors.neutral900 }}
          fixedTitleFontStyle
          disable
        />
      </Block>
    </Block>
  );
};
