/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  BookingInfo,
  Button,
  DescriptionsBooking,
  NormalHeader,
  RowOfForm,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActions } from '@vna-base/redux/action-slice';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { FontStyle } from '@theme/typography';
import { BookingStatusDetails, HitSlop, dispatch } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Footer } from '../components';
import { useStyles } from './styles';
import { APP_SCREEN, RootStackParamList } from '@utils';

export type UpdateBookingForm = {
  BookingCode: string | null;
  BookingStatus: string | null;
};

export const BookingUpdate = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.BookingUpdate>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const BookingStatusDetailsSubset = (({ OK, FAIL, TICKETED, CANCELED }) => ({
    OK,
    FAIL,
    TICKETED,
    CANCELED,
  }))(BookingStatusDetails);

  const formMethod = useForm<UpdateBookingForm>({
    defaultValues: {
      BookingCode: bookingDetail?.BookingCode,
      BookingStatus: bookingDetail?.BookingStatus,
    },
  });

  const _save = useCallback(() => {
    formMethod.handleSubmit(formData => {
      dispatch(
        bookingActions.updateBooking(
          {
            // ...bookingDetail?.toJSON(),
            Id: bookingDetail?.Id,
            BookingCode: formData.BookingCode,
            BookingStatus: formData.BookingStatus,
          },
          true,
          isSuccess => {
            if (isSuccess) {
              dispatch(
                bookingActions.getBookingByIdOrBookingCode(
                  {
                    id: id!,
                    system: bookingDetail!.System!,
                    bookingCode: bookingDetail!.BookingCode!,
                  },
                  { force: true },
                ),
              );
            }

            goBack();
          },
        ),
      );
    })();
  }, [bookingDetail, formMethod, id]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
        zIndex={0}
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n="update_booking:update_booking"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <Block
          flex={1}
          borderTopWidth={10}
          borderColorTheme="neutral200"
          padding={12}
          rowGap={12}>
          <BookingInfo
            Airline={bookingDetail?.Airline}
            BookingCode={bookingDetail?.BookingCode}
            System={bookingDetail?.System}
            BookingStatus={bookingDetail?.BookingStatus}
          />
          <DescriptionsBooking t18n="update_booking:description" />

          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<UpdateBookingForm>
              t18n="update_booking:booking_code"
              name="BookingCode"
              fixedTitleFontStyle
              control={formMethod.control}
              maxLength={20}
              style={FontStyle.Body14Bold}
              autoCapitalize="characters"
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<UpdateBookingForm>
              type="dropdown"
              typeDetails={BookingStatusDetailsSubset}
              t18n="update_booking:status"
              t18nBottomSheet="update_booking:status"
              name="BookingStatus"
              fixedTitleFontStyle
              removeAll
              control={formMethod.control}
            />
          </Block>
        </Block>
        <Footer onSubmit={_save} />
      </FormProvider>
    </Screen>
  );
};
