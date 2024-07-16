import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BookingCancelForm } from '../type';

export const useWatchIsCancelAll = (
  formMethod: UseFormReturn<BookingCancelForm, any, undefined>,
) => {
  useEffect(() => {
    const subscription = formMethod.watch((value, { name }) => {
      if (name === 'isCancelAll' && value.isCancelAll) {
        value.routes?.forEach((r, idx) => {
          formMethod.setValue(`routes.${idx}.isSelected`, true);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);
};
