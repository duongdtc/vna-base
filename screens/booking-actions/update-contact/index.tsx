/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  BookingInfo,
  Button,
  NormalHeader,
  RowOfForm,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions, orderActions } from '@redux-slice';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import {
  BookingStatusDetails,
  HitSlop,
  dispatch,
  rxEmail,
} from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Footer } from '../components';
import { useStyles } from './styles';

export type UpdateContactForm = {
  Phone: string | null;
  Email: string | null;
};

export const UpdateContact = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.UpdateContact>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<UpdateContactForm>({
    defaultValues: {
      Phone: bookingDetail?.ContactPhone,
      Email: bookingDetail?.ContactEmail,
    },
  });

  const submit = () => {
    formMethod.handleSubmit(formData => {
      dispatch(
        bookingActionActions.updateContact(id, formData, isSuccess => {
          if (isSuccess) {
            dispatch(orderActions.getOrderDetail(bookingDetail!.OrderId!));
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
            t18n="update_contact:update_contact"
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
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<UpdateContactForm>
              t18n="update_contact:phone"
              name="Phone"
              fixedTitleFontStyle
              control={formMethod.control}
              maxLength={20}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<UpdateContactForm>
              typeDetails={BookingStatusDetails}
              t18n="update_contact:email"
              name="Email"
              fixedTitleFontStyle
              control={formMethod.control}
              pattern={rxEmail}
            />
          </Block>
        </Block>
        <Footer
          onSubmit={submit}
          disableSubmit={!formMethod.formState.isDirty}
        />
      </FormProvider>
    </Screen>
  );
};
