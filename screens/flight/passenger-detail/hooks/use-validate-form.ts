import { PassengerForm } from '@vna-base/screens/flight/type';
import { validatePassengerForm } from '@vna-base/utils';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

export const useValidateForm = () => {
  const { getValues, trigger } = useFormContext<PassengerForm>();

  const validateForm = useCallback(
    () => validatePassengerForm(getValues(), trigger),
    [getValues, trigger],
  );

  return {
    validateForm,
  };
};
