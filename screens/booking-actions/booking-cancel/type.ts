import { FareInfo, Segment } from '@services/axios/axios-data';

export type BookingCancelForm = {
  isCancelAll: boolean;
  routes: Array<Segment & FareInfo & { isSelected: boolean }>;
};
