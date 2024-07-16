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
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { HitSlop, RootStackParamList } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer, ListRoute } from './components';
import { useWatchIsCancelAll } from './hooks';
import { useStyles } from './styles';
import { BookingCancelForm } from './type';
import { getDefaultValues } from './utils';
import { APP_SCREEN } from '@utils';

export const BookingCancel = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.BookingCancel>) => {
  const styles = useStyles();
  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<BookingCancelForm>({
    defaultValues: getDefaultValues(bookingDetail?.toJSON() as Booking),
  });

  useWatchIsCancelAll(formMethod);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
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
              t18n="booking_cancel:booking_cancel"
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
          <Block paddingTop={8} rowGap={8}>
            <Text
              t18n="booking_cancel:options"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
            <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
              <RowOfForm<BookingCancelForm>
                type="radio"
                t18n="booking_cancel:cancel_all"
                name="isCancelAll"
                control={formMethod.control}
              />
              <Separator type="horizontal" />
              <RowOfForm<BookingCancelForm>
                type="radio"
                t18n="booking_cancel:cancel_separate"
                name="isCancelAll"
                control={formMethod.control}
                revertValue
              />
            </Block>
          </Block>
          <Block paddingTop={8} rowGap={8}>
            <Text
              t18n="booking_cancel:select_routes"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
            <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
              <ListRoute />
            </Block>
          </Block>
        </ScrollView>
        <Footer id={id} />
      </FormProvider>
    </Screen>
  );
};
