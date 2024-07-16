/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  BookingInfo,
  Button,
  DescriptionsBooking,
  hideLoading,
  NormalHeader,
  RowOfForm,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack, navigate, reset } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions, orderActions } from '@redux-slice';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { delay, dispatch, HitSlop, scale } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer } from '../components';
import { useStyles } from './styles';
import { ReBookForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const ReBook = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.BookingRebook>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);
  const formMethod = useForm<ReBookForm>({
    defaultValues: {
      autoIssue: false,
      autoSendEmail: true,
      newOrder: false,
      cancelOldBooking: true,
    },
  });

  const submit = () => {
    formMethod.handleSubmit(formData => {
      dispatch(
        bookingActionActions.reBook(
          id,
          formData,
          async (isSuccess, { bookingCode, orderId, listTicket }) => {
            if (isSuccess) {
              if (formData.autoIssue) {
                hideLoading({
                  lottie: 'done',
                  t18nTitle: 'common:success',
                  lottieStyle: { width: scale(182), height: scale(72) },
                  t18nSubtitle: 're_book:issue_ticket_success',
                });

                navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
                  flightAction: 'ReBook',
                  tickets: listTicket,
                  bookingId: id,
                });
              } else {
                hideLoading({
                  lottie: 'done',
                  t18nTitle: 'common:success',
                  lottieStyle: { width: scale(182), height: scale(72) },
                  visibleTime: 1200,
                  body: (
                    <Block rowGap={4} alignItems="center">
                      <Text
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                        t18n="re_book:booking_code"
                      />
                      <Text
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                        text={bookingCode}
                      />
                    </Block>
                  ),
                });

                await delay(1200);

                if (formData.newOrder) {
                  reset({
                    index: 1,
                    routes: [
                      {
                        name: APP_SCREEN.BOTTOM_TAB_NAV,
                      },
                      {
                        name: APP_SCREEN.ORDER,
                      },
                      {
                        name: APP_SCREEN.ORDER_DETAIL,
                        params: { id: orderId },
                      },
                    ],
                  });
                } else {
                  dispatch(
                    orderActions.getOrderDetail(bookingDetail!.OrderId!),
                  );
                  goBack();
                }
              }
            } else {
              hideLoading({
                lottie: 'failed',
                t18nSubtitle: 'update_booking:contact_admin_help',
                t18nTitle: 'common:failed',
                lottieStyle: { width: scale(182), height: scale(72) },
              });
            }
          },
        ),
      );
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
            t18n="re_book:re_book"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <BookingInfo
            Airline={bookingDetail?.Airline}
            BookingCode={bookingDetail?.BookingCode}
            System={bookingDetail?.System}
            BookingStatus={bookingDetail?.BookingStatus}
          />
          <DescriptionsBooking t18n="re_book:description" />

          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<ReBookForm>
              type="switch"
              t18n="re_book:auto_issue"
              name="autoIssue"
              fixedTitleFontStyle
              control={formMethod.control}
            />
          </Block>
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<ReBookForm>
              type="switch"
              t18n="re_book:book_new_order"
              name="newOrder"
              fixedTitleFontStyle
              control={formMethod.control}
            />
          </Block>
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<ReBookForm>
              type="switch"
              t18n="re_book:cancel_old_booking"
              name="cancelOldBooking"
              fixedTitleFontStyle
              control={formMethod.control}
            />
          </Block>
        </ScrollView>

        <Footer onSubmit={submit} />
      </FormProvider>
    </Screen>
  );
};
