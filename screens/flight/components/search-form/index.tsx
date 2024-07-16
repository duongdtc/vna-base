/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, PagerWithHeader } from '@vna-base/components';
import { SceneWithTitle } from '@vna-base/components/pager/type';
import { navigate } from '@navigation/navigation-service';
import { selectNotification, selectSearchForm } from '@redux-selector';
import { Airport } from '@redux/type';
import {
  AirportPickerContext,
  ModalAirportPicker,
  Notification,
  PassengerPicker,
  SubmitButton,
} from '@vna-base/screens/flight/components';
import {
  Flight,
  ModalAirportPickerRef,
  OptionsForm,
  SearchForm as SearchFormType,
  SearchFormProps,
} from '@vna-base/screens/flight/type';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN } from '@utils';
import { scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { MultiStage } from './multi-stage';
import { OneStage } from './one-stage';
import { RoundStage } from './round-stage';
import { ScrollView } from './scroll-view';

const TabKey = {
  ONE_STAGE: 'ONE_STAGE',
  ROUND_STAGE: 'ROUND_STAGE',
  MULTI_STAGE: 'MULTI_STAGE',
};

export const SearchForm = ({
  sharedValue,
  callbackSubmit,
  initPassengers,
  hidePassengers: hidePassenger,
  disableMultiStage,
  disableRoundStage,
  Footer,
}: SearchFormProps) => {
  const notification = useSelector(selectNotification);
  const formSearch = useSelector(selectSearchForm);
  const airportPickerRef = useRef<ModalAirportPickerRef>(null);

  const initTab = useMemo(() => {
    switch (formSearch.Type) {
      case 'MultiStage':
        return 2;
      case 'RoundStage':
        return 1;

      default:
        return 0;
    }
  }, [formSearch]);

  const formMethod = useForm<SearchFormType>({
    defaultValues: formSearch,
  });

  const showModalAirportPicker = (data: {
    t18nTitle: I18nKeys;
    dataItemIgnore?: Flight | undefined;
    onSubmit: (data: Airport) => void;
  }) => {
    airportPickerRef.current?.present(data);
  };

  const closeModalAirportPicker = () => {
    airportPickerRef.current?.close();
  };

  useEffect(() => {
    if (!isEmpty(formSearch)) {
      Object.keys(formSearch).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        formMethod.setValue(key, formSearch[key]);
      });
    }
  }, [formSearch]);

  useEffect(() => {
    if (!isEmpty(initPassengers)) {
      formMethod.setValue('Passengers', initPassengers);
    }
  }, [initPassengers]);

  const renderScene = useMemo<Array<SceneWithTitle>>(
    () => [
      {
        tabKey: TabKey.ONE_STAGE,
        t18n: 'flight:one_stage',
        child: props => <OneStage {...props} />,
      },
      {
        tabKey: TabKey.ROUND_STAGE,
        t18n: 'flight:round_stage',
        child: props => <RoundStage {...props} />,
        disable: disableRoundStage,
      },
      {
        tabKey: TabKey.MULTI_STAGE,
        t18n: 'flight:multi_stage',
        child: props => <MultiStage {...props} />,
        disable: disableMultiStage,
      },
    ],
    [disableMultiStage, disableRoundStage],
  );

  const onChangeTab = (i: number) => {
    formMethod.setValue(
      'Type',
      // eslint-disable-next-line no-nested-ternary
      i === 0 ? 'OneStage' : i === 1 ? 'RoundStage' : 'MultiStage',
    );
  };

  const onDoneSetOption = useCallback(
    (data: OptionsForm) => {
      Object.keys(data).forEach(key => {
        //@ts-ignore
        formMethod.setValue(key, data[key]);
      });
    },
    [formMethod],
  );

  const navToOptions = () => {
    const data = formMethod.getValues();
    navigate(APP_SCREEN.MORE_OPTIONS_SEARCH_FLIGHT, {
      data: {
        SeatClass: data.SeatClass,
        Nearby: data.Nearby,
        Straight: data.Straight,
        Corporation: data.Corporation,
        FareType: data.FareType,
        PassengerSearchType: data.PassengerSearchType,
      },
      onDone: onDoneSetOption,
    });
  };

  return (
    <AirportPickerContext.Provider
      value={{ showModalAirportPicker, closeModalAirportPicker }}>
      <FormProvider {...formMethod}>
        <ScrollView sharedValue={sharedValue}>
          {!isEmpty(notification) && <Notification content={notification} />}
          <PagerWithHeader
            initTab={initTab}
            onChangeTab={onChangeTab}
            renderScene={renderScene}
            style={styles.pagerWithHeader}
          />
          <Animated.View>
            {/* {!hidePassenger && (
              <Controller
                control={formMethod.control}
                name="ByMonth"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    activeOpacity={ActiveOpacity}
                    style={styles.btnSearchByMonth}
                    onPress={() => {
                      onChange(!value);
                    }}>
                    <Text
                      t18n="flight:find_by_month"
                      fontStyle="Title16Semi"
                      colorTheme="neutral900"
                    />
                    <Switch value={value} disable opacity={1} />
                  </TouchableOpacity>
                )}
              />
            )} */}
            {!hidePassenger && <PassengerPicker />}
            <SubmitButton
              callback={callbackSubmit}
              style={{ marginTop: hidePassenger ? 16 : 0 }}
            />

            <Button
              leftIcon="options_2_fill"
              textColorTheme="primaryColor"
              leftIconSize={20}
              t18n="flight:more_options"
              fullWidth
              onPress={navToOptions}
              buttonColorTheme="neutral20"
              buttonStyle={styles.btnMore}
            />

            {Footer}
          </Animated.View>
        </ScrollView>
        <ModalAirportPicker ref={airportPickerRef} />
      </FormProvider>
    </AirportPickerContext.Provider>
  );
};

const styles = StyleSheet.create({
  pagerWithHeader: { paddingHorizontal: scale(16) },
  btnMore: { marginHorizontal: scale(16), marginTop: scale(16) },
  // btnSearchByMonth: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginHorizontal: scale(16),
  //   paddingHorizontal: scale(12),
  //   paddingVertical: scale(8),
  //   marginTop: scale(8),
  // },
});
