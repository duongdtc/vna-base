import { Block, Button, showModalConfirm } from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { bookingActionActions, bookingActions } from '@vna-base/redux/action-slice';
import { Ticket } from '@services/axios/axios-data';
import { RefundTicketReq } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { dispatch, System } from '@vna-base/utils';
import { APP_SCREEN } from '@utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useFormState } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RfndTicketForm } from '../../type';
import { ContentModalCalculateFee } from '../content-modal-calculate-fee';

export const Footer = memo(
  ({ bookingIdRouteParam }: { bookingIdRouteParam: string }) => {
    const { bottom } = useSafeAreaInsets();

    const bookingDetail = useObject<BookingRealm>(
      BookingRealm.schema.name,
      bookingIdRouteParam,
    );

    const { handleSubmit } = useFormContext<RfndTicketForm>();

    const { isValid } = useFormState<RfndTicketForm>();

    const callApi = (
      dataForm: RfndTicketForm,
      confirm: boolean,
      cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
    ) => {
      const form: Omit<RefundTicketReq, 'RequestInfo'> = {
        System: bookingDetail?.System,
        Airline: bookingDetail?.Airline,
        BookingCode: bookingDetail?.BookingCode,
        BookingId: bookingDetail?.Id,
        Confirm: confirm,
        ListTicket: dataForm.tickets?.map(tkNumb => tkNumb.TicketNumber!),
      };

      dispatch(bookingActionActions.refundTicket(form, cb));
    };

    const submit = () => {
      handleSubmit(dataForm => {
        callApi(dataForm, false, isSuccess => {
          if (isSuccess) {
            showModalConfirm({
              renderBody: () => <ContentModalCalculateFee />,
              t18nCancel: 'common:cancel',
              themeColorCancel: 'neutral50',
              themeColorTextCancel: 'neutral900',
              t18nOk: 'common:execute',
              themeColorOK: 'primary600',
              themeColorTextOK: 'classicWhite',
              flexDirection: 'row',
              onOk: () => {
                callApi(dataForm, true, (_isSuccess, listTicket) => {
                  if (!_isSuccess) {
                    return;
                  }

                  if (bookingDetail?.System === System.QH) {
                    dispatch(
                      bookingActions.getBookingByIdOrBookingCode({
                        id: bookingIdRouteParam,
                        bookingCode: bookingDetail?.BookingCode ?? '',
                        system: bookingDetail?.System ?? '',
                      }),
                    );

                    goBack();
                    return;
                  }

                  navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
                    flightAction: 'RefundTicket',
                    tickets: listTicket,
                    bookingId: bookingIdRouteParam,
                  });
                });
              },
            });
          }
        });
      })();
    };

    return (
      <Block
        shadow="main"
        colorTheme="neutral100"
        paddingHorizontal={12}
        paddingTop={8}
        flexDirection="row"
        alignItems="center"
        columnGap={10}
        style={{ paddingBottom: bottom + 12 }}>
        <Block flex={1}>
          <Button
            fullWidth
            onPress={() => {
              goBack();
            }}
            t18n="common:cancel"
            textColorTheme="neutral900"
            buttonColorTheme="neutral50"
            textFontStyle="Body14Bold"
            size="medium"
          />
        </Block>
        <Block flex={1}>
          <Button
            disabled={!isValid}
            onPress={submit}
            fullWidth
            t18n="common:continue"
            textColorTheme="classicWhite"
            buttonColorTheme="primary600"
            textFontStyle="Body14Bold"
            size="medium"
          />
        </Block>
      </Block>
    );
  },
  isEqual,
);
