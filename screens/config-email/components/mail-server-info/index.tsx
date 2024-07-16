import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { ConfigEmailForm } from '@vna-base/screens/config-email/type';
import { MailServerDetail, MailServerDetails, rxMultiEmail } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';

export const MailServerInfo = memo(() => {
  const { control, getValues, setValue } = useFormContext<ConfigEmailForm>();

  return (
    <Block paddingTop={8} rowGap={8}>
      <Text
        t18n="config_email:mail_server_info"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block borderRadius={8} colorTheme="neutral100" overflow="hidden">
        <RowOfForm<ConfigEmailForm>
          type="switch"
          t18n="config_email:ssl"
          name="EnableSSL"
          control={control}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          type="dropdown"
          t18n="config_email:mail_server"
          t18nBottomSheet="config_email:mail_server"
          name="MailServer"
          typeDetails={MailServerDetails}
          control={control}
          fixedTitleFontStyle
          removeAll
          onChangeValue={(val: MailServerDetail) => {
            console.log('val :>> ', val);
            const formData = getValues();

            if (!formData.Host || formData.Host === '') {
              setValue('Host', val?.host);
            }

            if (!formData.Port || formData.Port === '') {
              setValue('Port', val?.port?.toString() ?? '');
            }
          }}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          fixedTitleFontStyle
          t18n="config_email:host"
          name="Host"
          maxLength={120}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          fixedTitleFontStyle
          t18n="config_email:email"
          name="MailAddress"
          maxLength={120}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          fixedTitleFontStyle
          t18n="config_email:password"
          name="Password"
          maxLength={20}
          secureTextEntry
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          fixedTitleFontStyle
          t18n="config_email:port"
          name="Port"
          maxLength={10}
          keyboardType="number-pad"
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          fixedTitleFontStyle
          t18n="config_email:sender_name"
          name="SenderName"
          maxLength={80}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          fixedTitleFontStyle
          t18n="config_email:cc_email"
          name="CCEmail"
          maxLength={120}
          control={control}
          pattern={rxMultiEmail}
        />
      </Block>
    </Block>
  );
}, isEqual);
