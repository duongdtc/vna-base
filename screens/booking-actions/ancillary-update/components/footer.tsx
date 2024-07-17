/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Button, showModalConfirm, Text } from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import {
  bookingActionActions,
  bookingActions,
  chargeActions,
} from '@vna-base/redux/action-slice';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { BookingStatus, dispatch, scale, System } from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { AncillaryUpdateForm } from '../type';
import { PriceInModal } from './price-in-modal';
import { TotalPrice } from './total-price';
import { APP_SCREEN } from '@utils';

export const Footer = memo(() => {
  const { bottom } = useSafeAreaInsets();
  const { bookingId } = useSelector(selectCurrentFeature);
  const { handleSubmit, formState } = useFormContext<AncillaryUpdateForm>();

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const callApi = (formData: AncillaryUpdateForm, autoIssue: boolean) => {
    dispatch(
      bookingActionActions.updateAncillaries(
        {
          bookingDetail: bookingDetail!.toJSON() as Booking,
          autoIssue,
          passengers: formData.passengers,
        },
        (isSuccess, listTicket) => {
          if (!isSuccess) {
            return;
          }

          dispatch(chargeActions.getChargesByOrderId(bookingDetail!.OrderId!));

          if (bookingDetail!.System === System.VJ) {
            dispatch(
              bookingActions.getBookingByIdOrBookingCode({
                id: bookingId,
                system: bookingDetail!.System!,
                bookingCode: bookingDetail!.BookingCode!,
                surname: bookingDetail?.Passengers[0]?.Surname,
              }),
            );
            goBack();
            return;
          }

          navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
            flightAction: 'AncillaryUpdate',
            tickets: listTicket,
            bookingId: bookingId,
          });
        },
      ),
    );
  };

  const submit = () => {
    handleSubmit(formData => {
      if (bookingDetail?.BookingStatus === BookingStatus.TICKETED) {
        showModalConfirm({
          t18nTitle: 'ancillary_update:payment_confirmation',
          t18nSubtitle: 'ancillary_update:payment_confirmation_subtitle',
          t18nOk: 'common:confirm',
          themeColorOK: 'success600',
          themeColorTextOK: 'classicWhite',
          themeColorCancel: 'neutral900',
          themeColorTextCancel: 'neutral600',
          flexDirection: 'row',
          onOk: () => {
            callApi(formData, true);
          },
        });

        return;
      }

      if (
        bookingDetail?.System === System.VJ ||
        bookingDetail?.System === System.TR
      ) {
        callApi(formData, false);

        return;
      }

      showModalConfirm({
        t18nTitle: 'ancillary_update:confirmation_of_ticket_issuance',
        t18nSubtitle:
          'ancillary_update:confirmation_of_ticket_issuance_subtitle',
        renderBody: () => <PriceInModal passengers={formData.passengers} />,
        t18nCancel: 'common:cancel',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
        t18nOk: 'common:confirm',
        themeColorOK: 'success600',
        themeColorTextOK: 'classicWhite',
        flexDirection: 'row',
        onOk: () => {
          callApi(formData, true);
        },
      });
    })();
  };

  const t18nSubmitBtn = useMemo<I18nKeys>(() => {
    if (
      bookingDetail?.BookingStatus !== BookingStatus.TICKETED &&
      (bookingDetail?.System === System.VJ ||
        bookingDetail?.System === System.TR)
    ) {
      return 'common:execute';
    }

    return 'order_detail:payment';
  }, [bookingDetail?.BookingStatus, bookingDetail?.System]);

  return (
    <Block
      shadow="main"
      colorTheme="neutral100"
      paddingHorizontal={12}
      paddingTop={8}
      style={{ paddingBottom: scale(12) + bottom }}
      rowGap={8}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          t18n="ancillary_update:additional_service"
          colorTheme="neutral900"
          fontStyle="Body14Semi"
        />
        <TotalPrice />
      </Block>

      <Block flexDirection="row" columnGap={10}>
        <Block flex={1}>
          <Button
            fullWidth
            size="medium"
            t18n="common:cancel"
            textColorTheme="neutral900"
            textFontStyle="Body14Semi"
            buttonColorTheme="neutral50"
            onPress={() => {
              goBack();
            }}
          />
        </Block>
        <Block flex={1}>
          <Button
            onPress={submit}
            fullWidth
            disabled={!formState.isDirty}
            size="medium"
            t18n={t18nSubmitBtn}
            textColorTheme="classicWhite"
            textFontStyle="Body14Semi"
            buttonColorTheme="primary500"
          />
        </Block>
      </Block>
    </Block>
  );
}, isEqual);
