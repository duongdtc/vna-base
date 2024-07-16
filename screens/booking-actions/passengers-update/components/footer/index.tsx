import { Block, Button, showModalConfirm } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PassengerUpdateForm } from '../../type';
import { dispatch } from '@vna-base/utils';
import { bookingActionActions } from '@redux-slice';
import { goBack } from '@navigation/navigation-service';
import { ContentModalCalculateFee } from '../content-modal-calculate-fee';
import { UpdatePassengerReq } from '@services/axios/axios-ibe';

export const Footer = memo(() => {
  const { bottom } = useSafeAreaInsets();

  const { handleSubmit } = useFormContext<PassengerUpdateForm>();

  const callApi = (dataForm: PassengerUpdateForm, SubmitChanges: boolean) => {
    const form: Omit<UpdatePassengerReq, 'RequestInfo'> = {
      System: dataForm?.System,
      Airline: dataForm?.Airline,
      BookingCode: dataForm?.BookingCode,
      BookingId: dataForm.BookingId,
      ListPassenger: dataForm.Passengers,
      AutoIssue: SubmitChanges,
    };

    // dispatch action ticket refund here
    dispatch(
      bookingActionActions.passengersUpdate(
        form,
        SubmitChanges
          ? isSuccess => {
              if (isSuccess) {
                goBack();
              }
            }
          : undefined,
      ),
    );
  };

  const submit = () => {
    handleSubmit(dataForm => {
      callApi(dataForm, false);

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
          callApi(dataForm, true);
        },
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
