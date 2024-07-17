import { goBack } from '@navigation/navigation-service';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import { dispatch } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useFormState } from 'react-hook-form';
import { Footer as FooterBase } from '../../../components';
import { EmailSendForm } from '../../type';

export const Footer = memo(({ id }: { id: string }) => {
  const { control } = useFormContext<EmailSendForm>();

  const { isValid } = useFormState({ control });

  const onSubmit = (data: EmailSendForm) => {
    dispatch(
      bookingActionActions.sendEmails(id, data, isSuccess => {
        if (isSuccess) {
          goBack();
        }
      }),
    );
  };

  return (
    <FooterBase<EmailSendForm>
      onSubmit={onSubmit}
      disableSubmit={!isValid}
      isShowModalConfirm={false}
    />
  );
}, isEqual);
