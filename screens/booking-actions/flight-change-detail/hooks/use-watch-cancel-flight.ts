import { UseFormReturn } from 'react-hook-form';
import { FlightChangeForm } from '../type';

export const useWatchCancelFlight = ({
  control,
  setValue,
}: Pick<
  UseFormReturn<FlightChangeForm, any, undefined>,
  'control' | 'setValue'
>) => {};
