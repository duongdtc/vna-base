import { Button, NormalHeader, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { HitSlop } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer, ListPassengers } from './components';
import { useStyles } from './style';
import { PassengerUpdateForm } from './type';
import { getDefaultValues } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const PassengerUpdate = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.PassengerUpdate>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<PassengerUpdateForm>({
    mode: 'all',
    defaultValues: getDefaultValues(bookingDetail?.toJSON() as Booking),
  });

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
            t18n="update_passenger:update_passenger"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView style={styles.contentContainer}>
          <ListPassengers bookingId={id} />
        </ScrollView>
        <Footer />
      </FormProvider>
    </Screen>
  );
};
