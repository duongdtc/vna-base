/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { goBack } from '@navigation/navigation-service';
import { bookingActionActions, bookingActions } from '@vna-base/redux/action-slice';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { dispatch } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useFormState } from 'react-hook-form';
import { Footer as FooterBase } from '../../../components';
import { BookingCancelForm } from '../../type';

export const Footer = memo(({ id }: { id: string }) => {
  const { control } = useFormContext<BookingCancelForm>();

  const { isValid } = useFormState({ control });

  const onSubmit = (data: BookingCancelForm) => {
    dispatch(
      bookingActionActions.cancelBooking(id, data, isSuccess => {
        if (isSuccess) {
          if (isSuccess) {
            const bookingDetail =
              realmRef.current?.objectForPrimaryKey<BookingRealm>(
                BookingRealm.schema.name,
                id,
              );

            dispatch(
              bookingActions.getBookingByIdOrBookingCode(
                {
                  bookingCode: bookingDetail!.BookingCode!,
                  id: bookingDetail!.Id!,
                  system: bookingDetail!.System!,
                },
                { force: true },
              ),
            );
          }

          goBack();
        }
      }),
    );
  };

  return (
    <FooterBase<BookingCancelForm>
      onSubmit={onSubmit}
      disableSubmit={!isValid}
      isShowModalConfirm={false}
    />
  );
}, isEqual);
