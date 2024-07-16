import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { ConfigTicketForm } from '@vna-base/screens/config-ticket/type';
import { HitSlop } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { Pressable } from 'react-native';

export const CommonConfig = memo(() => {
  const { control, setValue } = useFormContext<ConfigTicketForm>();

  const resetCommonConfig = () => {
    setValue('PNRColor', '#228B22', { shouldDirty: true });
    setValue('foreColor', '#000000', { shouldDirty: true });
    setValue('mainColor', '#fafafa', { shouldDirty: true });
    setValue('showTicketNumber', true, { shouldDirty: true });
  };

  return (
    <Block rowGap={12} paddingTop={8}>
      <Block
        flexDirection="row"
        alignItems="center"
        columnGap={12}
        justifyContent="space-between">
        <Text
          t18n="config_ticket:common_config"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
        <Pressable hitSlop={HitSlop.Large} onPress={resetCommonConfig}>
          <Text
            t18n="common:reset_config"
            fontStyle="Body14Reg"
            colorTheme="primary500"
          />
        </Pressable>
      </Block>
      <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
        <RowOfForm<ConfigTicketForm>
          control={control}
          name="mainColor"
          t18n="config_ticket:identification_color"
          fixedTitleFontStyle
          type="color-picker"
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigTicketForm>
          control={control}
          type="color-picker"
          name="foreColor"
          t18n="config_ticket:text_color_in_background"
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigTicketForm>
          control={control}
          type="color-picker"
          name="PNRColor"
          t18n="config_ticket:booking_code_color"
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigTicketForm>
          type="switch"
          t18n="config_ticket:show_ticket_number"
          name="showTicketNumber"
          fixedTitleFontStyle={true}
          control={control}
        />
      </Block>
    </Block>
  );
}, isEqual);
