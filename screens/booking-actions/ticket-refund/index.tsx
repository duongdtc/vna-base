import {
  Block,
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
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { HitSlop, System, TicketType } from '@vna-base/utils';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer, ListTicket } from './components';
import { useStyles } from './styles';
import { RfndTicketForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const TicketRefund = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.TicketRfnd>) => {
  const styles = useStyles();
  const bookingId = route.params.id;

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const formMethod = useForm<RfndTicketForm>({
    defaultValues: {
      isCancelBooking: false,
      isRfndAllTicket: true,
      tickets: bookingDetail?.Tickets?.filter(
        tk => tk.TicketType === TicketType.OPEN,
      ).map(ticket => ({
        ...ticket,
        isSelected: true,
      })),
    },
  });

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
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
              t18n="refund_ticket:refund"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
          }
        />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Controller
            control={formMethod.control}
            name="tickets"
            render={({ field: { value } }) => {
              return value?.length > 0 ? (
                <>
                  {bookingDetail?.System !== System.QH && (
                    <Block
                      borderRadius={8}
                      colorTheme="neutral100"
                      overflow="hidden">
                      <RowOfForm<RfndTicketForm>
                        type="switch"
                        t18n="refund_ticket:cancel_booking"
                        name="isCancelBooking"
                        control={formMethod.control}
                      />
                    </Block>
                  )}
                  <Block paddingTop={8} rowGap={8}>
                    <Text
                      t18n="refund_ticket:options"
                      fontStyle="Title20Semi"
                      colorTheme="neutral900"
                    />
                    <Block
                      borderRadius={8}
                      colorTheme="neutral100"
                      overflow="hidden">
                      <RowOfForm<RfndTicketForm>
                        type="radio"
                        t18n="refund_ticket:rfnd_all"
                        name="isRfndAllTicket"
                        control={formMethod.control}
                      />
                      <Separator type="horizontal" />
                      <RowOfForm<RfndTicketForm>
                        type="radio"
                        t18n="refund_ticket:rfnd_each_ticket"
                        name="isRfndAllTicket"
                        control={formMethod.control}
                        revertValue
                      />
                    </Block>
                  </Block>
                  <Block paddingTop={8} rowGap={8}>
                    <Text
                      t18n="refund_ticket:select_ticket"
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
                  t18n="refund_ticket:all_ticket_are_rfnded"
                  colorTheme="neutral100"
                />
              );
            }}
          />
        </ScrollView>
        <Footer bookingIdRouteParam={bookingId} />
      </FormProvider>
    </Screen>
  );
};
