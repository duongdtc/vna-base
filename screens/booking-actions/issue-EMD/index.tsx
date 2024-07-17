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
import { BookingStatusDetails, dispatch, HitSlop } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Footer } from '../components';
import { useStyles } from './styles';
import { APP_SCREEN, RootStackParamList } from '@utils';

export type IssueEMDForm = {
  Tourcode: string | null;
  AccountCode: string | null;
};

export const IssueEMD = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.TicketEMD>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);
  const formMethod = useForm<IssueEMDForm>({
    defaultValues: {
      Tourcode: bookingDetail?.Tourcode,
      AccountCode: bookingDetail?.AccountCode,
    },
  });

  const _save = () => {
    formMethod.handleSubmit(formData => {
      dispatch(
        bookingActionActions.issueEMD(id, formData, (isSuccess, listTicket) => {
          if (isSuccess) {
            navigate(APP_SCREEN.BOOKING_ACTION_SUCCESS, {
              flightAction: 'TicketEMD',
              tickets: listTicket,
              bookingId: id,
            });
          } else {
            goBack();
          }
        }),
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
          padding={12}
          rowGap={12}>
          <BookingInfo
            Airline={bookingDetail?.Airline}
            BookingCode={bookingDetail?.BookingCode}
            System={bookingDetail?.System}
            BookingStatus={bookingDetail?.BookingStatus}
          />
          <DescriptionsBooking t18n="issue_ticket:description" />

          <Block flex={1}>
            <Block colorTheme="neutral100" borderRadius={8}>
              <RowOfForm<IssueEMDForm>
                t18n="issue_ticket:tour_code"
                name="Tourcode"
                fixedTitleFontStyle
                control={formMethod.control}
                maxLength={20}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<IssueEMDForm>
                typeDetails={BookingStatusDetails}
                t18n="issue_ticket:account_code"
                name="AccountCode"
                fixedTitleFontStyle
                control={formMethod.control}
              />
            </Block>
          </Block>
        </Block>
        <Footer onSubmit={_save} />
      </FormProvider>
    </Screen>
  );
};
