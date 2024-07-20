import { useStyles } from '@theme';
import { FontDefault } from '@theme/typography';
import { I18nKeys } from '@translations/locales';
import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { FormAgentInfoType } from '@vna-base/screens/agent-info/type';
import { scale } from '@vna-base/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const MainInfo = () => {
  const {
    theme: { colors },
  } = useStyles();
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
          t18n={'Mã đại lý' as I18nKeys}
          name="GeneralTab.AgentCode"
          maxLength={20}
          control={control}
          autoCapitalize="characters"
          fixedTitleFontStyle
          disable
          style={{
            color: colors.neutral900,
            fontFamily: FontDefault.Bold,
            fontSize: scale(14),
            lineHeight: scale(20),
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n={'OfficeID' as I18nKeys}
          name="GeneralTab.CustomerID"
          maxLength={20}
          control={control}
          autoCapitalize="characters"
          fixedTitleFontStyle
          defaultValue={'VNA647821'}
          disable
          style={{
            color: colors.neutral900,
            fontFamily: FontDefault.Bold,
            fontSize: scale(14),
            lineHeight: scale(20),
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<FormAgentInfoType>
          t18n={'IATA Number' as I18nKeys}
          name="IATANumber"
          maxLength={20}
          control={control}
          autoCapitalize="characters"
          fixedTitleFontStyle
          disable
          defaultValue={'867023847'}
          style={{
            color: colors.neutral900,
            fontFamily: FontDefault.Bold,
            fontSize: scale(14),
            lineHeight: scale(20),
          }}
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
