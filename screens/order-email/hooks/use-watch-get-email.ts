import { emailActions } from '@vna-base/redux/action-slice';
import { dispatch } from '@vna-base/utils';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { EmailForm } from '../type';

export const useWatchGetEmail = (
  formMethod: UseFormReturn<EmailForm, any, undefined>,
) => {
  const values = useWatch({
    control: formMethod.control,
    name: [
      'orderId',
      'currency',
      'emailType',
      'language',
      'showFooter',
      'showHeader',
      'showPrice',
      'showPNR',
    ],
    exact: true,
  });

  useEffect(() => {
    if (values[0]) {
      dispatch(
        emailActions.getEmail({
          orderId: values[0],
          currency: values[1],
          emailType: values[2],
          language: values[3],
          showFooter: values[4],
          showHeader: values[5],
          showPrice: values[6],
          showPNR: values[7],
        } as EmailForm),
      );
    }
  }, [values]);
};
