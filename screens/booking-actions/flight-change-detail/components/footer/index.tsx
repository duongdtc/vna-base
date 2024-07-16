import { Block, Button, showModalConfirm } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectCurrentFeature } from '@redux-selector';
import { bookingActionActions, bookingActions } from '@redux-slice';
import { ChangeFlightReq } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { dispatch, resetSearchFlight } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { FlightChangeForm } from '../../type';
import { Price } from './price';

export const Footer = memo(() => {
  const { bottom } = useSafeAreaInsets();

  const { bookingId } = useSelector(selectCurrentFeature);

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const { handleSubmit } = useFormContext<FlightChangeForm>();

  const callApi = (
    dataForm: FlightChangeForm,
    SubmitChanges: boolean,
    cb: (isSuccess: boolean) => void,
  ) => {
    const form: Omit<ChangeFlightReq, 'RequestInfo' | 'AutoIssue'> = {
      System: bookingDetail?.System,
      Airline: bookingDetail?.Airline,
      BookingCode: bookingDetail?.BookingCode,
      BookingId: bookingId,
      SubmitChanges,
      ListFlightAddNew: dataForm.newFlights.map(nfl => ({
        DepartDate: dayjs(nfl.DepartDate).format('DDMMYYYY'),
        EndPoint: nfl.EndPoint,
        StartPoint: nfl.StartPoint,
        ListSegment: nfl.ListSegment,
      })),
      ListFlightCancel: dataForm.oldFlights
        .filter(ofl => ofl.isSelected)
        .map(ofl => ({
          DepartDate: dayjs(ofl.DepartDate).format('DDMMYYYY'),
          EndPoint: ofl.EndPoint,
          StartPoint: ofl.StartPoint,
          ListSegment: ofl.ListSegment,
        })),
    };

    dispatch(bookingActionActions.changeFlight(form, cb));
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
            themeColorTextOK: 'classicWhite',
            flexDirection: 'row',
            onOk: () => {
              callApi(dataForm, true, _isSuccess => {
                if (!_isSuccess) {
                  return;
                }

                dispatch(
                  bookingActions.getBookingByIdOrBookingCode({
                    id: bookingId,
                    bookingCode: bookingDetail?.BookingCode ?? '',
                    system: bookingDetail?.System ?? '',
                  }),
                );

                resetSearchFlight();

                goBack();
                return;
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
          buttonColorTheme="neutral50"
          textFontStyle="Body14Bold"
          size="medium"
        />
      </Block>
      <Block flex={1}>
        <Button
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
}, isEqual);
