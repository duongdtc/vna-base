import { RowOfForm, Separator } from '@vna-base/components';
import { EmailForm } from '@vna-base/screens/order-email/type';
import { EmailType, TicketMimeTypeDetails } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';

export const TicketType = memo(() => {
  const { control } = useFormContext<EmailForm>();

  const emailType = useWatch({
    control,
    name: 'emailType',
  });

  const attachETicket = useWatch({
    control,
    name: 'attachETicket',
  });

  if (emailType === EmailType.ORDER_INFO) {
    return null;
  }

  return (
    <>
      <Separator type="horizontal" size={3} />
      <RowOfForm<EmailForm>
        disable={!attachETicket}
        showRightIcon
        opacity={attachETicket ? 1 : 0.5}
        type="dropdown"
        typeDetails={TicketMimeTypeDetails}
        t18n="common:format"
        t18nBottomSheet="common:format"
        name="ticketType"
        control={control}
        fixedTitleFontStyle
      />
    </>
  );
}, isEqual);
