/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  Icon,
  NormalHeader,
  Screen,
  Text,
  TouchableScale,
} from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { goBack, navigate } from '@navigation/navigation-service';
import { selectListSelectedFlight } from '@vna-base/redux/selector';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, dispatch } from '@vna-base/utils';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { AddAncillaryForm } from '../add-ancillary/type';
import {
  Footer,
  ListNewFlight,
  ListOldFlight,
  OldAncillariesBottomSheet,
} from './components';
import { useStyles } from './styles';
import { FlightChangeForm } from './type';
import { generateInitialForm } from './utils';
import { flightBookingFormActions } from '@vna-base/redux/action-slice';
import { AddPreSeatForm } from '../add-pre-seat/type';
import { useWatchCancelFlight } from './hooks';
import { APP_SCREEN } from '@utils';

export const FlightChangeDetail = () => {
  const styles = useStyles();
  const btsRef = useRef<NormalRef>(null);
  // const contentFlightBottomSheetRef = useRef<BottomSheetContentFlightRef>(null);

  const listSelectedFlight = useSelector(selectListSelectedFlight);

  const formMethod = useForm<FlightChangeForm>({
    mode: 'all',
    defaultValues: generateInitialForm(listSelectedFlight),
  });

  useWatchCancelFlight({
    control: formMethod.control,
    setValue: formMethod.setValue,
  });

  const navToAddAncillary = () => {
    const initData: AddAncillaryForm = {
      passengers: formMethod.getValues().newPassengers,
      flights: [],
    };

    listSelectedFlight.forEach(airOption => {
      airOption.ListFlightOption![0]?.ListFlight?.forEach(flight => {
        initData.flights.push({
          ...flight,
          FareOption:
            airOption.ListFlightOption![0].ListFlight!.length > 1
              ? undefined
              : airOption.ListFareOption![0],
          FlightOptionId: airOption.ListFlightOption![0].OptionId!,
          AirlineOptionId: airOption.OptionId!,
          System: airOption.System!,
        });
      });
    });

    navigate(APP_SCREEN.ADD_ANCILLARY, {
      initData,
      onDone: data => {
        data.passengers.forEach((p, pIdx) => {
          //@ts-ignore
          formMethod.setValue(`newPassengers.${pIdx}.Baggages`, p.Baggages, {
            shouldDirty: true,
          });
          formMethod.setValue(`newPassengers.${pIdx}.Services`, p.Services, {
            shouldDirty: true,
          });
        });
      },
    });
  };

  const navToAddPreSeat = () => {
    const initData: AddPreSeatForm = {
      passengers: formMethod.getValues().newPassengers,
      flights: [],
    };

    listSelectedFlight.forEach(airOption => {
      airOption.ListFlightOption![0]?.ListFlight?.forEach(flight => {
        initData.flights.push({
          ...flight,
          FareOption:
            airOption.ListFlightOption![0].ListFlight!.length > 1
              ? undefined
              : airOption.ListFareOption![0],
          FlightOptionId: airOption.ListFlightOption![0].OptionId!,
          AirlineOptionId: airOption.OptionId!,
          System: airOption.System!,
        });
      });
    });

    navigate(APP_SCREEN.ADD_PRE_SEAT, {
      initData,
      onDone: data => {
        data.passengers.forEach((p, pIdx) => {
          formMethod.setValue(`newPassengers.${pIdx}.PreSeats`, p.PreSeats, {
            shouldDirty: true,
          });
        });
      },
    });
  };

  useEffect(() => {
    dispatch(flightBookingFormActions.saveEncodeFlightInfoAncillary(null));
    dispatch(flightBookingFormActions.saveEncodeFlightInfoPreSeat(null));
  }, []);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
        shadow=".3"
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
            t18n="flight_change:flight_change"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <ListOldFlight
          // bottomSheetRef={contentFlightBottomSheetRef}
          />
          <ListNewFlight
          //  bottomSheetRef={contentFlightBottomSheetRef}
          />
          <Block
            paddingHorizontal={12}
            paddingTop={12}
            paddingBottom={8}
            rowGap={8}
            colorTheme="warning50"
            borderRadius={8}>
            <Block>
              <Block flexDirection="row" alignItems="flex-start">
                <Block
                  colorTheme="neutral900"
                  width={4}
                  height={4}
                  borderRadius={2}
                  margin={6}
                />
                <Text fontStyle="Body12Reg" colorTheme="neutral900">
                  {translate('flight_change_detail:sub_service_1_1')}
                  <Text
                    t18n="common:cancel"
                    fontStyle="Body12Bold"
                    colorTheme="error500"
                  />
                  {translate('flight_change_detail:sub_service_1_2')}
                </Text>
              </Block>
              <Block flexDirection="row" alignItems="flex-start">
                <Block
                  colorTheme="neutral900"
                  width={4}
                  height={4}
                  borderRadius={2}
                  margin={6}
                />
                <Text
                  t18n="flight_change_detail:sub_service_2"
                  fontStyle="Body12Reg"
                  colorTheme="neutral900"
                />
              </Block>
            </Block>
            <Button
              onPress={() => {
                btsRef.current?.present();
              }}
              t18n="flight_change_detail:view_old_ancillaries"
              textColorTheme="primary600"
              textFontStyle="Capture11Reg"
              rightIcon="external_link_fill"
              rightIconSize={12}
              paddingVertical={6}
              fullWidth
            />
          </Block>
          <TouchableScale
            containerStyle={styles.pressableNav}
            onPress={navToAddAncillary}>
            <Text
              t18n="flight_change_detail:add_baggages_services"
              fontStyle="Title16Semi"
              colorTheme="neutral900"
            />
            <Icon
              icon="arrow_ios_right_outline"
              size={24}
              colorTheme="neutral900"
            />
          </TouchableScale>
          <TouchableScale
            containerStyle={styles.pressableNav}
            onPress={navToAddPreSeat}>
            <Text
              t18n="flight_change_detail:add_preseat"
              fontStyle="Title16Semi"
              colorTheme="neutral900"
            />
            <Icon
              icon="arrow_ios_right_outline"
              size={24}
              colorTheme="neutral900"
            />
          </TouchableScale>
        </ScrollView>
        <Footer />
        <OldAncillariesBottomSheet ref={btsRef} />
      </FormProvider>
      {/* <BottomSheetContentFlight
        ref={contentFlightBottomSheetRef}
        useModal={false}
      /> */}
    </Screen>
  );
};
