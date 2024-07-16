/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  NormalHeader,
  Screen,
  showModalConfirm,
  Text,
} from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActions, bookingActionActions } from '@redux-slice';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import {
  BookingStatus,
  dispatch,
  HitSlop,
  scale,
  System,
} from '@vna-base/utils';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListFlight, PriceInModal, TotalPrice } from './components';
import { useStyles } from './styles';
import { SeatMapUpdateForm } from './type';
import { generateInitialSeatMapUpdateForm } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const SeatmapUpdate = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.SeatmapUpdate>) => {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<SeatMapUpdateForm>({
    defaultValues: { passengers: [] },
  });

  useEffect(() => {
    dispatch(
      bookingActionActions.getSeatMaps(bookingDetail?.toJSON() as Booking),
    );

    formMethod.reset(
      generateInitialSeatMapUpdateForm(bookingDetail?.toJSON() as Booking),
    );
  }, []);

  const updateSeatMap = (formData: SeatMapUpdateForm) => {
    dispatch(
      bookingActionActions.updateSeatMap(
        {
          bookingDetail: bookingDetail?.toJSON() as Booking,
          passengers: formData.passengers,
        },
        (isSuccess, listTicket) => {
          if (!isSuccess) {
            return;
          }

          dispatch(
            bookingActions.getBookingByIdOrBookingCode({
              id,
              system: bookingDetail!.System!,
              bookingCode: bookingDetail?.BookingCode,
              surname: bookingDetail?.Passengers[0]?.Surname,
            }),
          );

          if (
            bookingDetail?.BookingStatus === BookingStatus.TICKETED ||
            bookingDetail?.System === System.VJ
          ) {
            goBack();
            return;
          }

          navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
            flightAction: 'SeatmapUpdate',
            tickets: listTicket,
            bookingId: id,
          });
        },
      ),
    );
  };

  const submit = () => {
    formMethod.handleSubmit(formData => {
      if (bookingDetail?.BookingStatus === BookingStatus.TICKETED) {
        // hiện modal
        showModalConfirm({
          t18nTitle: 'seat_map_update:payment_confirmation',
          t18nSubtitle: 'seat_map_update:payment_confirmation_ques',
          t18nCancel: 'common:cancel',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
          t18nOk: 'common:confirm',
          themeColorOK: 'primary600',
          themeColorTextOK: 'success600',
          flexDirection: 'row',
          onOk: () => {
            updateSeatMap(formData);
          },
        });
        return;
      }

      if (bookingDetail?.System === System.VJ) {
        // loading như thường
        updateSeatMap(formData);
        return;
      }

      showModalConfirm({
        t18nTitle: 'seat_map_update:confirmation_of_ticket_issuance',
        t18nSubtitle: 'seat_map_update:confirmation_of_ticket_issuance_ques',
        renderBody: () => <PriceInModal passengers={formData.passengers} />,
        t18nCancel: 'common:cancel',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
        t18nOk: 'common:confirm',
        themeColorOK: 'success600',
        themeColorTextOK: 'classicWhite',
        flexDirection: 'row',
        onOk: () => {
          updateSeatMap(formData);
        },
      });
    })();
  };

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
        shadow=".3"
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
            t18n="seat_map_update:seat_map_update"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView style={styles.contentContainer}>
          <Block padding={12} colorTheme="neutral100" borderRadius={8}>
            <ListFlight />
          </Block>
        </ScrollView>
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
              t18n="seat_map_update:additional_seats_are_available"
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
                disabled={!formMethod.formState.isDirty}
                size="medium"
                t18n={
                  bookingDetail?.BookingStatus === BookingStatus.TICKETED
                    ? 'order_detail:payment'
                    : 'common:execute'
                }
                textColorTheme="classicWhite"
                textFontStyle="Body14Semi"
                buttonColorTheme="primary500"
              />
            </Block>
          </Block>
        </Block>
      </FormProvider>
    </Screen>
  );
};
