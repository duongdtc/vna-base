/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet, Button, Icon, Text } from '@vna-base/components';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectFilterForm } from '@vna-base/redux/selector';
import { FilterForm } from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity, SnapPoint, delay } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';
import { useFilterContext } from '../filter-provider';
import { Airline } from './airline';
import { DepartureTime } from './departure-time';
import { Duration } from './duration';
import { Fare } from './fare';
import { FareRange } from './fare-range';
import { StopPoint } from './stop-point';
import { TypeTicket } from './type-ticket';

export const Filter = memo(() => {
  const { styles } = useStyles(styleSheet);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { filterFlight } = useFilterContext();

  const defaultFilterForm = useSelector(selectFilterForm);

  const formMethod = useForm<FilterForm>();

  const setValues = (form: FilterForm | undefined) => {
    if (!isEmpty(form)) {
      Object.keys(form).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        formMethod.setValue(key, form[key]);
      });
    }
  };

  useEffect(() => {
    setValues(defaultFilterForm);
  }, [defaultFilterForm]);

  const submit = () => {
    formMethod.handleSubmit(data => {
      filterFlight(data);
    })();
  };

  const onDone = () => {
    submit();
    bottomSheetRef.current?.close();
  };

  const reset = () => {
    setValues(defaultFilterForm!);

    onDone();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          bottomSheetRef.current?.present();
        }}
        activeOpacity={ActiveOpacity}
        style={styles.btnFooterContainer}>
        <Icon icon="options_2_outline" size={20} colorTheme="primaryColor" />
        <Text t18n="common:_filter" fontStyle="Body14Reg" />
      </TouchableOpacity>
      <BottomSheet
        snapPoints={[SnapPoint.Full]}
        type="normal"
        ref={bottomSheetRef}
        useDynamicSnapPoint={false}
        enablePanDownToClose={false}
        t18nTitle="common:_filter"
        showIndicator={false}
        onPressBackDrop={submit}
        t18nDone="common:reset"
        onDone={reset}
        typeBackDrop="gray">
        <Content formMethod={formMethod} onDone={onDone} />
      </BottomSheet>
    </>
  );
}, isEqual);

const Content = ({
  onDone,
  formMethod,
}: {
  formMethod: UseFormReturn<FilterForm, any, undefined>;
  onDone: () => void;
}) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const [isMouted, setIsMounted] = useState(false);

  useEffect(() => {
    const mount = async () => {
      await delay(50);
      setIsMounted(true);
    };

    mount();
  }, []);

  if (!isMouted) {
    return (
      <View style={[bs.flex, bs.justifyCenter]}>
        <ActivityIndicator color={colors.primaryColor} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FormProvider {...formMethod}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerScrollView}>
          <Fare />
          <FareRange />
          <Duration />
          <Airline />
          <TypeTicket />
          <StopPoint />
          <Controller
            control={formMethod.control}
            name="DepartTimeType"
            render={({ field: { value } }) => (
              <DepartureTime initTab={value === 'DepartTimeRange' ? 0 : 1} />
            )}
          />
        </BottomSheetScrollView>
        <View style={styles.footerContainer}>
          <Button
            onPress={onDone}
            buttonStyle={styles.btn}
            t18n="flight:get_result"
            buttonColorTheme="successColor"
            textColorTheme="neutral10"
            fullWidth
          />
        </View>
      </FormProvider>
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings, shadows }) => ({
  container: {
    backgroundColor: colors.neutral10,
    flex: 1,
  },
  btnFooterContainer: {
    flex: 1,
    paddingVertical: spacings[8],
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacings[8],
  },
  contentContainerScrollView: {
    paddingBottom: spacings[12],
  },
  footerContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral10,
    ...shadows.main,
  },
  btn: { margin: spacings[12] },
}));
