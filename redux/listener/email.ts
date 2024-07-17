import { emailActions } from '@redux-slice';
import { Email } from '@services/axios';
import { scale, validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners()({
  actionCreator: emailActions.getEmail,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(emailActions.changeIsLoadingEmail(true));
    const {
      currency,
      emailType,
      language,
      orderId,
      showPNR,
      showFooter,
      showHeader,
      showPrice,
    } = action.payload;

    const res = await Email.emailHelperEmailHelperGetEmailCreate({
      Currency: currency,
      EmailType: emailType,
      Language: language,
      OrderId: orderId,
      ShowFooter: showFooter,
      ShowHeader: showHeader,
      ShowPrice: showPrice,
      ShowPNR: showPNR,
    });

    if (validResponse(res)) {
      listenerApi.dispatch(emailActions.saveEmail(res.data));
    }

    listenerApi.dispatch(emailActions.changeIsLoadingEmail(false));
  },
});

takeLatestListeners()({
  actionCreator: emailActions.getETickets,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(emailActions.changeIsLoadingETicket(true));
    const { currency, allPassenger, language, bookingIds, orderId } =
      action.payload;

    await Promise.allSettled(
      bookingIds.map(async bookingId => {
        const res = await Email.emailHelperEmailHelperGetETicketCreate({
          Currency: currency,
          AllPassenger: allPassenger,
          Language: language,
          OrderId: orderId,
          BookingId: bookingId,
        });

        const { eTickets } = listenerApi.getState().email;
        if (validResponse(res)) {
          listenerApi.dispatch(
            emailActions.saveETicket({
              ...eTickets,
              [bookingId]: res.data.ListTicket ?? [],
            }),
          );
        } else {
          listenerApi.dispatch(
            emailActions.saveETicket({ ...eTickets, [bookingId]: [] }),
          );
        }
      }),
    );

    listenerApi.dispatch(emailActions.changeIsLoadingETicket(false));
  },
});

takeLatestListeners(true, {
  showConfig: {
    lottie: 'loading',
    t18nSubtitle: 'common:please_wait_a_several_minute',
    t18nTitle: 'order_email:sending_email',
    lottieStyle: { width: scale(182), height: scale(72) },
  },
  successConfig: {
    lottie: 'done',
    lottieStyle: { width: scale(182), height: scale(72) },
    t18nSubtitle: 'common:success',
    t18nTitle: 'order_email:send_success',
  },
  failedConfig: {
    lottie: 'failed',
    lottieStyle: { width: scale(182), height: scale(72) },
    t18nSubtitle: 'common:failed',
    t18nTitle: 'common:please_try_again',
  },
})({
  actionCreator: emailActions.sendCustomEmail,
  effect: async (action, listenerApi) => {
    const {
      currency,
      email,
      ticketType,
      attachETicket,
      language,
      subject,
      cb,
    } = action.payload;

    const { eTickets, email: storedEmail } = listenerApi.getState().email;

    const res = await Email.emailHelperEmailHelperSendCustomCreate({
      Currency: currency,
      AttachmentType: ticketType,
      Email: email,
      IncludeAttachment: attachETicket,
      Language: language,
      Subject: subject,
      ListTicket: Object.values(eTickets).flatMap(es => es),
      MailBody: storedEmail.Content,
    });

    if (!validResponse(res)) {
      throw new Error();
    } else {
      listenerApi.dispatch(emailActions.saveEmail({}));
      listenerApi.dispatch(emailActions.saveETicket({}));
    }

    cb?.(validResponse(res));
  },
});
