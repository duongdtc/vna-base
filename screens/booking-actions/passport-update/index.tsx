/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, NormalHeader, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { dispatch, HitSlop } from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer } from '../components';
import { ListPassengers } from './components';
import { useStyles } from './style';
import { PassportUpdateForm } from './type';
import { getDefaultValues } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const PassportUpdate = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.PassportUpdate>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<PassportUpdateForm>({
    mode: 'all',
    defaultValues: getDefaultValues(bookingDetail?.toJSON() as Booking),
  });

  const submit = (data: PassportUpdateForm) => {
    data.ListPassenger.forEach(passenger => {
      const dateOfBirth = passenger.DateOfBirth;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      passenger.BirthDate = passenger.DateOfBirth;
      if (dateOfBirth) {
        passenger.DateOfBirth = dayjs(dateOfBirth).format('DDMMYYYY');
      }

      const documentExpiry = passenger.Passport?.DocumentExpiry;
      if (documentExpiry) {
        passenger.Passport!.DocumentExpiry =
          dayjs(documentExpiry).format('DDMMYYYY');
      }
    });

    dispatch(
      bookingActionActions.passportUpdate(data, isSuccess => {
        if (isSuccess) {
          goBack();
        }
      }),
    );
  };

  return (
    <Screen
      unsafe={true}
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="dark-content">
      <NormalHeader
        colorTheme="neutral100"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_fill"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            t18n="passport_update:passport_update"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <ListPassengers bookingId={id} />
        </ScrollView>
        <Footer<PassportUpdateForm>
          onSubmit={submit}
          disableSubmit={!formMethod.formState.isDirty}
        />
      </FormProvider>
    </Screen>
  );
};
