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
import { goBack, navigate } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { dispatch, HitSlop, TicketType } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import dayjs from 'dayjs';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer } from '../components';
import { ListTicket } from './components';
import { useStyles } from './styles';
import { VoidTicketForm } from './type';

export const TicketVoid = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.TicketVoid>) => {
  const styles = useStyles();
  const bookingId = route.params.id;

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );
  const formMethod = useForm<VoidTicketForm>({
    defaultValues: {
      isCancelBooking: false,
      isVoidAllTicket: true,
      tickets: bookingDetail?.Tickets?.filter(tk => {
        if (
          tk.TicketType === TicketType.OPEN ||
          tk.TicketType === TicketType.EMD
        ) {
          return dayjs().isSame(dayjs(tk.IssueDate).toDate(), 'date');
        }

        return false;
      }).map(ticket => ({
        ...ticket,
        isSelected: true,
      })),
    },
  });

  const onSubmit = (data: VoidTicketForm) => {
    dispatch(
      bookingActionActions.voidTicket(bookingId, data, (isSuccess, tickets) => {
        if (isSuccess) {
          // chuyển sang màn thành công
          navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
            flightAction: 'TicketVoid',
            t18nAnnouncement: data.isCancelBooking
              ? 'void_booking:cancel_booking_success'
              : undefined,
            tickets,
            bookingId,
          });
        } else {
          goBack();
        }
      }),
    );
  };

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <NormalHeader
          colorTheme="neutral10"
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
              t18n="void_booking:void_ticket"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
          }
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <BookingInfo
            Airline={bookingDetail?.Airline}
            BookingCode={bookingDetail?.BookingCode}
            System={bookingDetail?.System}
            BookingStatus={bookingDetail?.BookingStatus}
          />
          <Controller
            control={formMethod.control}
            name="tickets"
            render={({ field: { value } }) =>
              value?.length > 0 ? (
                <>
                  <Block
                    borderRadius={8}
                    colorTheme="neutral100"
                    overflow="hidden">
                    <RowOfForm<VoidTicketForm>
                      type="switch"
                      t18n="void_booking:cancel_booking"
                      name="isCancelBooking"
                      control={formMethod.control}
                    />
                  </Block>
                  <Block paddingTop={8} rowGap={8}>
                    <Text
                      t18n="void_booking:options"
                      fontStyle="Title20Semi"
                      colorTheme="neutral900"
                    />
                    <Block
                      borderRadius={8}
                      colorTheme="neutral100"
                      overflow="hidden">
                      <RowOfForm<VoidTicketForm>
                        type="radio"
                        t18n="void_booking:void_all"
                        name="isVoidAllTicket"
                        control={formMethod.control}
                      />
                      <Separator type="horizontal" />
                      <RowOfForm<VoidTicketForm>
                        type="radio"
                        t18n="void_booking:void_each_ticket"
                        name="isVoidAllTicket"
                        control={formMethod.control}
                        revertValue
                      />
                    </Block>
                  </Block>
                  <Block paddingTop={8} rowGap={8}>
                    <Text
                      t18n="void_booking:select_ticket"
                      fontStyle="Title20Semi"
                      colorTheme="neutral900"
                    />
                    <Block
                      borderRadius={8}
                      colorTheme="neutral100"
                      overflow="hidden"
                      borderWidth={10}
                      borderColorTheme="neutral200">
                      <ListTicket />
                    </Block>
                  </Block>
                </>
              ) : (
                <DescriptionsBooking
                  t18n="void_booking:all_ticket_are_voided"
                  colorTheme="neutral100"
                />
              )
            }
          />
        </ScrollView>
        <Footer<VoidTicketForm>
          onSubmit={onSubmit}
          disableSubmit={!formMethod.formState.isValid}
        />
      </FormProvider>
    </Screen>
  );
};
