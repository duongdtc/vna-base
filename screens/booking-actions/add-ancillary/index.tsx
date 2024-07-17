/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, NormalHeader, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectEncodeFlightInfoAncillary } from '@vna-base/redux/selector';
import { flightBookingFormActions } from '@vna-base/redux/action-slice';
import { HitSlop, dispatch } from '@vna-base/utils';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Baggages, Footer, Services } from './components';
import { useStyles } from './styles';
import { AddAncillaryForm } from './type';
import dayjs from 'dayjs';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const AddAncillary = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.ADD_ANCILLARY>) => {
  const styles = useStyles();

  const { initData, onDone } = route.params;

  const encodeFlightInfo = useSelector(selectEncodeFlightInfoAncillary);

  const formMethod = useForm<AddAncillaryForm>({
    defaultValues: initData,
  });

  useEffect(() => {
    const encodeStr = initData.flights.reduce(
      (total, currFl) =>
        total +
        `${currFl.System}${currFl.StartPoint}${currFl.EndPoint}${dayjs(
          currFl.StartDate,
        ).format('YYYYMMDDHHmm')}${dayjs(currFl.EndDate).format(
          'YYYYMMDDHHmm',
        )}`,
      '',
    );

    if (encodeFlightInfo !== encodeStr) {
      dispatch(flightBookingFormActions.getAncillaries(initData.flights));

      dispatch(
        flightBookingFormActions.saveEncodeFlightInfoAncillary(encodeStr),
      );
    }
  }, [encodeFlightInfo]);

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
            t18n="ancillary_update:baggage_and_service"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Baggages />
          <Services />
        </ScrollView>
        <Footer onDone={onDone} />
      </FormProvider>
    </Screen>
  );
};
