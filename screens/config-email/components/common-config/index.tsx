import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { ConfigEmailForm } from '@vna-base/screens/config-email/type';
import { SnapPoint, TicketMimeTypeDetails } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';

export const CommonConfig = memo(() => {
  const { control } = useFormContext<ConfigEmailForm>();

  return (
    <Block rowGap={12} paddingTop={8}>
      <Text
        t18n="config_email:common_config"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
        <RowOfForm<ConfigEmailForm>
          control={control}
          name="showPrice"
          t18n="config_email:show_price"
          fixedTitleFontStyle
          type="switch"
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          control={control}
          type="switch"
          name="showHeader"
          t18n="config_email:show_header"
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          control={control}
          type="switch"
          name="showFooter"
          t18n="config_email:show_footer"
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          type="switch"
          t18n="config_email:show_booking_code"
          name="showPNR"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          type="switch"
          t18n="config_email:attach_eticket"
          name="includeETicket"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          type="switch"
          t18n="config_email:print_separate_ticket"
          name="individualTicket"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<ConfigEmailForm>
          type="dropdown"
          t18n="config_email:mime_type"
          t18nBottomSheet="config_email:mime_type"
          name="ticketType"
          fixedTitleFontStyle={true}
          typeDetails={TicketMimeTypeDetails}
          removeAll
          snapPoint={[SnapPoint['40%']]}
          control={control}
        />
      </Block>
    </Block>
  );
}, isEqual);
