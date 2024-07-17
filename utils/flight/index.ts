/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  flightBookingFormActions,
  flightResultActions,
  flightSearchActions,
} from '@vna-base/redux/action-slice';
import { LanguageType } from '@vna-base/screens/booking-actions/sms-send/type';
import { Passenger as PassengerData } from '@services/axios/axios-data';
import { Passenger } from '@services/axios/axios-ibe';
import { Colors } from '@theme';
import { dispatch } from '@vna-base/utils/redux';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';

export * from './booking-form';

export * from './result';

export * from './search';

export const clearSearchFlightResult = (isNewSearch: boolean) => {
  dispatch(flightResultActions.clearSearchResult(isNewSearch));
  dispatch(flightBookingFormActions.clearSearchResult(isNewSearch));
};

export const resetSearchFlight = () => {
  dispatch(flightSearchActions.reset());
  dispatch(flightResultActions.clearSearchResult(true));
  dispatch(flightBookingFormActions.clearSearchResult(true));
};

export const getFullNameOfPassenger = (
  pax: Passenger | PassengerData | null | undefined,
  useSlash = false,
  onlyName = true,
  language?: LanguageType,
) => {
  if (isEmpty(pax)) {
    return '';
  }

  if (onlyName) {
    return `${pax.Surname}${useSlash ? '/' : ' '}${
      pax.GivenName
    }`.toUpperCase();
  }

  const birthDate =
    //@ts-ignore
    pax.BirthDate || pax.DateOfBirth
      ? ' ' +
        (language === LanguageType.EN
          ? //@ts-ignore
            dayjs(pax.BirthDate ?? pax.DateOfBirth)
              .locale('en')
              .format('DMMMYYYY')
              .toUpperCase()
          : //@ts-ignore
            dayjs(pax.BirthDate ?? pax.DateOfBirth).format('DD/MM/YYYY'))
      : '';

  return `${pax.Surname}${useSlash ? '/' : ' '}${pax.GivenName} ${
    pax.Title
  }${birthDate}`.toUpperCase();
};

export const getAirlineColor = (al: string): keyof Colors => {
  switch (al) {
    case 'VN':
      return 'info600';

    case 'VU':
      return 'warning600';

    case 'VJ':
      return 'error600';

    case 'QH':
      return 'success600';

    default:
      return 'secondary600';
  }
};

/**
 *
 * @param airline
 * @param flNumb
 */

export const getFlightNumber = (
  airline: string | null | undefined,
  flNumb: string | null | undefined,
) => {
  // cắt chuỗi chứa dấu / hoặc ,
  const match = flNumb?.match(/^[^,/]+/);
  const newFlNumber = match ? match[0] : '';

  if (newFlNumber?.slice(0, 2).toUpperCase() === airline?.toUpperCase()) {
    return newFlNumber ?? '';
  }

  return (airline ?? '') + (newFlNumber ?? '');
};
