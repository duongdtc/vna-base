import { flightBookingFormActions } from '@redux-slice';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { dispatch } from '@vna-base/utils';
import throttle from 'lodash.throttle';
import { UseFormReturn } from 'react-hook-form';

export const useWatchFormChange = (
  formMethod: UseFormReturn<PassengerForm, any, undefined>,
) => {
  const autoSaveFormThrottle = throttle(
    (data: PassengerForm) => {
      dispatch(flightBookingFormActions.savePassengerForm(data));
    },
    2000,
    { leading: true },
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  formMethod.watch(autoSaveFormThrottle);
};
