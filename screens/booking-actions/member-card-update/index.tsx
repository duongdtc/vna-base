import {
  BookingInfo,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { dispatch, HitSlop } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer } from '../components';
import { ListPassenger } from './components';
import { useStyles } from './style';
import { MemberCardUpdateForm } from './type';
import { getDefaultValues } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const MemberCardUpdate = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.MemberUpdate>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<MemberCardUpdateForm>({
    mode: 'all',
    defaultValues: getDefaultValues(bookingDetail?.toJSON() as Booking),
  });

  const submit = (data: MemberCardUpdateForm) => {
    dispatch(
      bookingActionActions.membershipUpdate(data, isSuccess => {
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
        shadow=".3"
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
            t18n="member_card_udpate:member_card"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView style={styles.contentContainer}>
          <BookingInfo
            Airline={bookingDetail?.Airline}
            BookingCode={bookingDetail?.BookingCode}
            System={bookingDetail?.System}
            BookingStatus={bookingDetail?.BookingStatus}
          />
          <ListPassenger />
        </ScrollView>
        <Footer<MemberCardUpdateForm>
          onSubmit={submit}
          disableSubmit={!formMethod.formState.isDirty}
        />
      </FormProvider>
    </Screen>
  );
};
