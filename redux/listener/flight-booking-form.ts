import { flightBookingFormActions } from '@redux-slice';
import { Ibe } from '@services/axios';
import { Ancillary, SeatMap } from '@services/axios/axios-ibe';
import { BookFlight, prepareFormForSubmission, scale } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: flightBookingFormActions.getSeatMaps,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      flightBookingFormActions.changeIsLoadingSeatMaps(true),
    );

    const { session } = listenerApi.getState().flightResult;

    const res = await Promise.allSettled(
      action.payload.map(async flight => {
        const subRes = await Ibe.flightGetSeatMapCreate({
          SessionInfo: {
            AirlineOptionId: flight.AirlineOptionId,
            FareOptionId: flight.FareOption?.OptionId,
            FlightOptionId: flight.FlightOptionId,
            Session: session,
          },
          System: flight.System,
        });

        return subRes.data;
      }),
    );

    const data: Record<string, Array<SeatMap>> = {};

    res.forEach((subRes, index) => {
      if (subRes.status === 'fulfilled') {
        data[index.toString()] = subRes?.value?.ListSeatMap ?? [];
      } else {
        data[index.toString()] = [];
      }
    });

    listenerApi.dispatch(flightBookingFormActions.saveSeatMaps(data));

    listenerApi.dispatch(
      flightBookingFormActions.changeIsLoadingSeatMaps(false),
    );
  },
});

takeLatestListeners()({
  actionCreator: flightBookingFormActions.getAncillaries,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      flightBookingFormActions.changeIsLoadingAncillaries(true),
    );

    const { session } = listenerApi.getState().flightResult;

    const res = await Promise.allSettled(
      action.payload.map(async flight => {
        const subRes = await Ibe.flightGetAncillaryCreate({
          SessionInfo: {
            AirlineOptionId: flight.AirlineOptionId,
            FareOptionId: flight.FareOption?.OptionId,
            FlightOptionId: flight.FlightOptionId,
            Session: session,
          },
          System: flight.System,
        });

        return subRes.data;
      }),
    );

    const services: Record<string, Array<Ancillary>> = {};
    const baggages: Record<string, Array<Ancillary>> = {};

    res.forEach((subRes, index) => {
      if (subRes.status === 'fulfilled') {
        services[index.toString()] = subRes?.value?.ListService ?? [];
        baggages[index.toString()] = subRes?.value?.ListBaggage ?? [];
      } else {
        services[index.toString()] = [];
        baggages[index.toString()] = [];
      }
    });

    listenerApi.dispatch(flightBookingFormActions.saveServices(services));
    listenerApi.dispatch(flightBookingFormActions.saveBaggages(baggages));

    listenerApi.dispatch(
      flightBookingFormActions.changeIsLoadingAncillaries(false),
    );
  },
});

takeLatestListeners(true, {
  showConfig: {
    lottie: 'loading',
    t18nSubtitle: 'common:please_wait_a_several_minute',
    t18nTitle: 'flight:processing_booking',
    lottieStyle: { width: scale(182), height: scale(72) },
  },
  successConfig: {
    lottie: 'done',
    lottieStyle: { width: scale(182), height: scale(72) },
    t18nSubtitle: 'common:success',
    t18nTitle: 'flight:booking_success_subtitle',
  },
  failedConfig: {
    lottie: 'failed',
    lottieStyle: { width: scale(182), height: scale(72) },
    t18nSubtitle: 'common:contact_admin_for_support',
    t18nTitle: 'common:failed',
  },
})({
  actionCreator: flightBookingFormActions.bookFlight,
  effect: async (action, _listenerApi) => {
    const { form, callback } = action.payload;

    const preparedForm = prepareFormForSubmission(form);

    const response = await Ibe.flightBookFlightCreate(preparedForm);

    const isSuccessForAllBooking =
      response.data.Success &&
      response.data.ListBooking?.every(
        booking => booking.BookingStatus === 'OK',
      );

    callback(isSuccessForAllBooking as boolean, {
      Type: form.SubmitOption.OrderAndTicketIssuance
        ? BookFlight.IssueTicket
        : BookFlight.KeepSeat,
      OrderId: response.data.OrderId,
    });
  },
});
