/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectEncodeFlightInfoPreSeat } from '@vna-base/redux/selector';
import { flightBookingFormActions } from '@vna-base/redux/action-slice';
import { HitSlop, dispatch, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ListFlight, TotalPrice } from './components';
import { useStyles } from './styles';
import { AddPreSeatForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const AddPreSeat = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.ADD_PRE_SEAT>) => {
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();

  const { initData, onDone } = route.params;

  const encodeFlightInfo = useSelector(selectEncodeFlightInfoPreSeat);

  const formMethod = useForm<AddPreSeatForm>({
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
      dispatch(flightBookingFormActions.getSeatMaps(initData.flights));

      dispatch(flightBookingFormActions.saveEncodeFlightInfoPreSeat(encodeStr));
    }
  }, [encodeFlightInfo]);

  const submit = () => {
    formMethod.handleSubmit(formData => {
      goBack();
      onDone({ passengers: formData.passengers });
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
            t18n="add_pre_seat:add_pre_seat"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView style={styles.contentContainer}>
          <Block padding={12} colorTheme="neutral100" borderRadius={8}>
            <ListFlight />
          </Block>
        </ScrollView>
        <Block
          shadow="main"
          colorTheme="neutral100"
          paddingHorizontal={12}
          paddingTop={8}
          style={{ paddingBottom: scale(12) + bottom }}
          rowGap={8}>
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              t18n="input_info_passenger:total_fare"
              colorTheme="neutral900"
              fontStyle="Body14Semi"
            />
            <TotalPrice />
          </Block>
          <Block flexDirection="row" columnGap={10}>
            <Block flex={1}>
              <Button
                fullWidth
                size="medium"
                t18n="common:cancel"
                textColorTheme="neutral900"
                textFontStyle="Body14Semi"
                buttonColorTheme="neutral50"
                onPress={() => {
                  goBack();
                }}
              />
            </Block>
            <Block flex={1}>
              <Button
                onPress={submit}
                fullWidth
                disabled={!formMethod.formState.isDirty}
                size="medium"
                t18n="common:continue"
                textColorTheme="classicWhite"
                textFontStyle="Body14Semi"
                buttonColorTheme="primary500"
              />
            </Block>
          </Block>
        </Block>
      </FormProvider>
    </Screen>
  );
};
