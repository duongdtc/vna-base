import { emailActions } from '@vna-base/redux/action-slice';
import { EmailType, dispatch } from '@vna-base/utils';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { EmailForm } from '../type';

export const useWatchGetETicket = (
  formMethod: UseFormReturn<EmailForm, any, undefined>,
  bookingIds: Array<string> | undefined,
) => {
  const values = useWatch({
    control: formMethod.control,
    name: ['emailType', 'allPassenger'],
    exact: true,
  });

  useEffect(() => {
    if (
      values[0] === EmailType.ORDER_CONFIRM &&
      bookingIds &&
      bookingIds.length > 0
    ) {
      const formVal = formMethod.getValues();

      dispatch(
        emailActions.getETickets({
          language: formVal.language,
          currency: formVal.currency,
          orderId: formVal.orderId,
          bookingIds,
          allPassenger: values[1],
        } as EmailForm & { bookingIds: Array<string> }),
      );
    }
  }, [values, bookingIds]);
};
