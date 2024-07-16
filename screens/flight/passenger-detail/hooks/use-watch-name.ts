import { PassengerForm } from '@vna-base/screens/flight/type';
import { useFormContext, useWatch } from 'react-hook-form';

export const useWatchName = (index: number) => {
  const { control } = useFormContext<PassengerForm>();

  const splitFullName = useWatch({
    control,
    name: 'SplitFullName',
  });

  const fullName = useWatch({
    control,
    name: `Passengers.${index}.FullName`,
  });

  const firstName = useWatch({
    control,
    name: `Passengers.${index}.Surname`,
  });

  const lastName = useWatch({
    control,
    name: `Passengers.${index}.GivenName`,
  });

  return splitFullName ? firstName + ' ' + lastName : fullName;
};
