/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  DescriptionsBooking,
  NormalHeader,
  RowOfForm,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useRealm } from '@services/realm/provider';
import { dispatch, HitSlop } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer } from '../components';
import { ListPassenger } from './components';
import { useStyles } from './style';
import { SplitPassengersForm } from './type';
import { getDefaultValues } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const PassengerSplit = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.PassengerSplit>) => {
  const styles = useStyles();

  const { id } = route.params;
  const realm = useRealm();

  const bookingRealm = realm.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    id,
  );

  const formMethod = useForm<SplitPassengersForm>({
    mode: 'all',
    defaultValues: getDefaultValues(bookingRealm?.toJSON() as Booking),
  });

  const submit = (data: SplitPassengersForm) => {
    const requestData = {
      BookingId: id,
      BookingCode: bookingRealm?.BookingCode,
      Airline: bookingRealm?.Airline,
      System: bookingRealm?.System,
      passengers: data.passengers.filter(psg => psg.isSelected),
      createNewOrder: data.createNewOrder,
    };
    dispatch(
      bookingActionActions.passengersSplit(requestData, isSuccess => {
        if (isSuccess) {
          //navigate sang booking detail
        } else {
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
            t18n="split_passenger:split_passenger"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Block paddingTop={8} rowGap={8}>
            <Text
              t18n="split_passenger:choose_split"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
            <ListPassenger />
          </Block>
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<SplitPassengersForm>
              type="switch"
              t18n="split_passenger:create_new_order"
              name="createNewOrder"
              fixedTitleFontStyle={true}
              control={formMethod.control}
            />
          </Block>
          <DescriptionsBooking t18n="split_passenger:description" />
        </ScrollView>
        <Footer<SplitPassengersForm>
          onSubmit={submit}
          disableSubmit={!formMethod.formState.isValid}
        />
      </FormProvider>
    </Screen>
  );
};
