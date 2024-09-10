import { Block, Button, showModalConfirm } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import {
  ExchangeTicketReq,
  Ticket,
  SegmentInfo,
} from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { dispatch } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { TicketChangeForm } from '../../type';
import { Price } from './price';
import { APP_SCREEN } from '@utils';

export const Footer = memo(() => {
  const { bottom } = useSafeAreaInsets();

  const { bookingId } = useSelector(selectCurrentFeature);

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const { handleSubmit } = useFormContext<TicketChangeForm>();

  const callApi = (
    dataForm: TicketChangeForm,
    confirm: boolean,
    cb: (isSuccess: boolean, listTicket: Array<Ticket>) => void,
  ) => {
    const form: Omit<ExchangeTicketReq, 'RequestInfo' | 'AutoIssue'> = {
      System: bookingDetail?.System,
      Airline: bookingDetail?.Airline,
      BookingCode: bookingDetail?.BookingCode,
      BookingId: bookingId,
      Confirm: confirm,
      ListBookSegment: dataForm.newFlights.flatMap(fl =>
        fl.ListSegment?.map(sgm => ({
          Airline: sgm.Airline,
          StartPoint: sgm.StartPoint,
          EndPoint: sgm.EndPoint,
          DepartDate: sgm.DepartDate,
          FlightNumber: sgm.FlightNumber,
          BookingClass: sgm.FareClass,
        })),
      ) as Array<SegmentInfo>,
      ListCancelSegment: dataForm.oldFlights
        .filter(fl => fl.isSelected)
        .flatMap(fl =>
          fl.ListSegment?.map(sgm => ({
            Airline: sgm.Airline,
            StartPoint: sgm.StartPoint,
            EndPoint: sgm.EndPoint,
            DepartDate: sgm.DepartDate,
            FlightNumber: sgm.FlightNumber,
            BookingClass: sgm.FareClass,
          })),
        ) as Array<SegmentInfo>,
    };

    dispatch(bookingActionActions.exchangeTicket(form, cb));
  };

  const submit = () => {
    handleSubmit(dataForm => {
      callApi(dataForm, false, isSuccess => {
        if (isSuccess) {
          showModalConfirm({
            renderBody: () => <Price />,
            t18nCancel: 'common:cancel',
            themeColorCancel: 'neutral50',
            themeColorTextCancel: 'neutral900',
            t18nOk: 'common:execute',
            themeColorOK: 'primary600',
            themeColorTextOK: 'white',
            flexDirection: 'row',
            onOk: () => {
              callApi(dataForm, true, (_isSuccess, listTicket) => {
                if (!_isSuccess) {
                  return;
                }

                navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
                  flightAction: 'ExchangeTicket',
                  tickets: listTicket,
                  bookingId,
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
          t18n="common:cancel"
          textColorTheme="neutral900"
          buttonColorTheme="neutral30"
          textFontStyle="Body14Bold"
          size="medium"
        />
      </Block>
      <Block flex={1}>
        <Button
          onPress={submit}
          fullWidth
          t18n="common:continue"
          textColorTheme="white"
          buttonColorTheme="001"
          textFontStyle="Body14Bold"
          size="medium"
        />
      </Block>
    </Block>
  );
}, isEqual);
