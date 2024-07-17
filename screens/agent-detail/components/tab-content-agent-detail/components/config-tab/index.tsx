import { Block, RowOfForm, Separator } from '@vna-base/components';
import { selectAllSIset } from '@vna-base/redux/selector';
import { FormAgentDetail } from '@vna-base/screens/agent-detail/type';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export const ConfigTab = () => {
  const { control } = useFormContext<FormAgentDetail>();

  const AllSISet = useSelector(selectAllSIset);

  return (
    <Block flex={1} colorTheme="neutral50">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 12,
          paddingBottom: 155,
        }}>
        <Block
          flex={1}
          marginTop={12}
          colorTheme="neutral100"
          borderRadius={12}>
          <RowOfForm<FormAgentDetail>
            t18n="agent:allow_search"
            name="ConfigTab.AllowSearch"
            fixedTitleFontStyle={true}
            control={control}
            type="switch"
          />
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormAgentDetail>
            t18n="agent:allow_booking"
            name="ConfigTab.AllowBook"
            fixedTitleFontStyle={true}
            control={control}
            type="switch"
          />
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormAgentDetail>
            t18n="agent:allow_issue_ticket"
            name="ConfigTab.AllowIssue"
            fixedTitleFontStyle={true}
            control={control}
            type="switch"
          />
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormAgentDetail>
            t18n="agent:allow_void_ticket"
            name="ConfigTab.AllowVoid"
            fixedTitleFontStyle={true}
            control={control}
            type="switch"
          />
          <Separator type="horizontal" size={3} />
          <RowOfForm<FormAgentDetail>
            t18n="agent_detail:siset_account"
            t18nBottomSheet="agent_detail:siset_account"
            name="ConfigTab.SISetId"
            fixedTitleFontStyle={true}
            control={control}
            type="dropdown"
            typeDetails={AllSISet}
            colorThemeValue="error600"
          />
        </Block>
      </ScrollView>
    </Block>
  );
};
