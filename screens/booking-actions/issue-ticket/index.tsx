/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  BookingInfo,
  Button,
  DescriptionsBooking,
  hideLoading,
  Icon,
  NormalHeader,
  RowOfForm,
  Screen,
  Separator,
  showLoading,
  showModalConfirm,
  showToast,
  Text,
} from '@vna-base/components';
import Clipboard from '@react-native-clipboard/clipboard';
import { goBack, navigate } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  BookingStatusDetails,
  dispatch,
  HitSlop,
  scale,
} from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { Footer } from '../components';
import { useStyles } from './styles';
import { APP_SCREEN, RootStackParamList } from '@utils';

export type IssueTicketForm = {
  Tourcode: string | null;
  AccountCode: string | null;
};

export const IssueTicket = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.TicketIssue>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<IssueTicketForm>({
    defaultValues: {
      Tourcode: bookingDetail?.Tourcode,
      AccountCode: bookingDetail?.AccountCode,
    },
  });

  const submit = () => {
    formMethod.handleSubmit(formData => {
      showLoading({
        lottie: 'loading',
        t18nSubtitle: 'common:please_wait_a_several_minute',
        t18nTitle: 'issue_ticket:issuing_ticket',
        lottieStyle: { width: scale(182), height: scale(72) },
      });

      dispatch(
        bookingActionActions.issueTicket(
          id,
          formData,
          (isSuccess, { listTicket, error }) => {
            if (isSuccess) {
              navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
                flightAction: 'TicketIssue',
                tickets: listTicket,
                bookingId: id,
              });

              hideLoading({
                lottie: 'done',
                t18nSubtitle: 'issue_ticket:successfully_issued',
                t18nTitle: 'update_booking:success',
                lottieStyle: { width: scale(182), height: scale(72) },
              });
            } else {
              hideLoading();

              showModalConfirm({
                lottie: 'failed',
                lottieStyle: { width: scale(182), height: scale(72) },
                renderBody: () => (
                  <Block rowGap={12}>
                    <Text
                      textAlign="center"
                      fontStyle="Title20Semi"
                      colorTheme="neutral900">
                      {translate('issue_ticket:issue_ticket')}{' '}
                      <Text
                        t18n="issue_ticket:error"
                        fontStyle="Title20Semi"
                        colorTheme="error500"
                      />
                    </Text>
                    <Text
                      textAlign="center"
                      t18n="issue_ticket:check_info"
                      fontStyle="Body14Reg"
                      colorTheme="neutral800"
                    />
                    <Block
                      paddingHorizontal={12}
                      paddingVertical={8}
                      rowGap={8}
                      colorTheme="warning50"
                      borderRadius={8}>
                      <Pressable
                        hitSlop={HitSlop.Large}
                        onPress={() => {
                          Clipboard.setString(error.code);
                          showToast({
                            type: 'success',
                            t18n: 'sms_send:copied_to_clipboard',
                          });
                        }}>
                        <Block
                          flexDirection="row"
                          alignItems="center"
                          columnGap={4}
                          justifyContent="center">
                          <Text
                            t18n="issue_ticket:error_code"
                            fontStyle="Body12Med"
                            colorTheme="neutral700"
                          />
                          <Text
                            text={error.code}
                            fontStyle="Body14Bold"
                            colorTheme="error500"
                          />
                          <Icon
                            icon="fi_sr_copy_alt"
                            size={16}
                            colorTheme="neutral300"
                          />
                        </Block>
                      </Pressable>
                      <Text
                        fontStyle="Body12Reg"
                        colorTheme="neutral900"
                        text={error.message}
                        textAlign="center"
                      />
                    </Block>
                    <Block
                      paddingHorizontal={12}
                      paddingVertical={8}
                      rowGap={4}
                      colorTheme="neutral50"
                      borderRadius={8}>
                      <Text
                        t18n="issue_ticket:u_can"
                        fontStyle="Body12Med"
                        colorTheme="neutral700"
                        style={{ marginBottom: 2 }}
                      />

                      <Text
                        t18n="issue_ticket:retrieve_booking_again"
                        fontStyle="Body12Reg"
                        colorTheme="neutral900"
                      />
                      <Text
                        t18n="issue_ticket:do_not_issue_ticket_again"
                        fontStyle="Body12Reg"
                        colorTheme="neutral900"
                      />
                      <Text
                        t18n="issue_ticket:contact_admin"
                        fontStyle="Body12Reg"
                        colorTheme="neutral900"
                      />
                    </Block>
                    <Text
                      style={{ marginHorizontal: 4 }}
                      fontStyle="Body12Med"
                      colorTheme="neutral800"
                      t18n="issue_ticket:deny_responsibility"
                      textAlign="center"
                    />
                  </Block>
                ),

                t18nCancel: 'modal_confirm:close',
                themeColorCancel: 'neutral50',
                themeColorTextCancel: 'neutral900',
                onCancel: () => goBack(),
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
            t18n="issue_ticket:issue_ticket"
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
          rowGap={12}
          padding={12}>
          <BookingInfo
            Airline={bookingDetail?.Airline}
            BookingCode={bookingDetail?.BookingCode}
            System={bookingDetail?.System}
            BookingStatus={bookingDetail?.BookingStatus}
          />
          <DescriptionsBooking t18n="issue_ticket:description" />
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<IssueTicketForm>
              t18n="issue_ticket:tour_code"
              name="Tourcode"
              fixedTitleFontStyle
              control={formMethod.control}
              maxLength={20}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<IssueTicketForm>
              typeDetails={BookingStatusDetails}
              t18n="issue_ticket:account_code"
              name="AccountCode"
              fixedTitleFontStyle
              control={formMethod.control}
            />
          </Block>
        </Block>
        <Footer onSubmit={submit} />
      </FormProvider>
    </Screen>
  );
};
