import { RowOfForm } from '@vna-base/components';
import { Block } from '@vna-base/components/block';
import { EmailForm } from '@vna-base/screens/order-email/type';
import { EmailType } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const ETicketOptions = () => {
  const { control } = useFormContext<EmailForm>();
  const emailType = useWatch({
    control,
    name: 'emailType',
  });

  if (emailType !== EmailType.ORDER_CONFIRM) {
    return null;
  }

  return (
    <Block rowGap={12}>
      <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
        <RowOfForm<EmailForm>
          type="switch"
          t18n="common:attach_eticket"
          name="attachETicket"
          fixedTitleFontStyle={true}
          control={control}
        />
      </Block>
      <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
        <RowOfForm<EmailForm>
          type="switch"
          t18n="common:print_separate_ticket"
          name="allPassenger"
          fixedTitleFontStyle={true}
          control={control}
        />
      </Block>
    </Block>
  );
};
