import { ContinueBtn } from '@screens/flight/passenger-detail/components/continue-btn';
import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Text } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  selectCustomFeeTotal,
  selectIsLoadingVerifiedFlights,
} from '@vna-base/redux/selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, WindowHeight, WindowWidth } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';
import { calculateTotalPrice } from '../../utils';
import { ListInsurance } from '../service-tab/insurances';

export const Footer = ({
  summaryBottomSheetRef,
  navNextTab,
}: {
  summaryBottomSheetRef: React.RefObject<NormalRef>;
  navNextTab: () => void;
}) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const { Total } = useSelector(selectCustomFeeTotal);
  const isLoadingVerifiedFlights = useSelector(selectIsLoadingVerifiedFlights);

  const { control, getValues } = useFormContext<PassengerForm>();

  const arrKeyListener = useMemo(() => {
    const passengers = getValues().Passengers;
    const listKey = passengers.reduce(
      (arr, _, currPassengerIndex) =>
        arr.concat([
          `Passengers.${currPassengerIndex}.FullName`,
          `Passengers.${currPassengerIndex}.LastName`,
          `Passengers.${currPassengerIndex}.FirstName`,
          `Passengers.${currPassengerIndex}.PreSeats`,
          `Passengers.${currPassengerIndex}.Baggages`,
          `Passengers.${currPassengerIndex}.Services`,
        ]),
      new Array<string>(0),
    );

    listKey.unshift('SplitFullName');

    return { listKey, passengerCount: passengers.length };
  }, []);

  const TotalFareFlight = useWatch({
    control,
    name: 'TotalFareFlight',
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const services = useWatch({
    control,
    name: arrKeyListener.listKey,
  }) as Array<any>;

  const insurance = useWatch({
    control,
    name: 'Insurance',
  });

  const totalPrice = useMemo(
    () =>
      calculateTotalPrice(
        services,
        arrKeyListener.passengerCount,
        TotalFareFlight,
      ) +
      (insurance
        ? ListInsurance.find(it => it.value === insurance)?.price ?? 0
        : 0),

    [TotalFareFlight, arrKeyListener.passengerCount, services, insurance],
  );

  const onPressFare = () => {
    summaryBottomSheetRef.current?.expand();
  };

  const next = () => {
    summaryBottomSheetRef.current?.close();
    navNextTab();
  };

  return (
    <Block
      flexDirection="row"
      alignItems="center"
      colorTheme="neutral100"
      justifyContent="space-between"
      padding={12}
      style={styles.footerContainer}>
      <TouchableOpacity
        disabled={isLoadingVerifiedFlights}
        activeOpacity={ActiveOpacity}
        onPress={onPressFare}
        style={styles.fareContainer}>
        <Text
          fontStyle="Body12Reg"
          t18n="input_info_passenger:total_fare"
          colorTheme="neutral100"
        />
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text
            fontStyle="H320Semi"
            text={(isLoadingVerifiedFlights
              ? 0
              : totalPrice + Total
            ).currencyFormat()}
            colorTheme="price"
          />
          <Text fontStyle="H320Semi" text="VND" colorTheme="neutral100" />
          {isLoadingVerifiedFlights ? (
            <ActivityIndicator size="small" color={colors.neutral40} />
          ) : (
            <Icon icon="info_outline" size={20} colorTheme="primaryColor" />
          )}
        </Block>
      </TouchableOpacity>
      <ContinueBtn onPress={next} />
    </Block>
  );
};

const styleSheet = createStyleSheet(({ radius, spacings, shadows }) => ({
  footerContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom + 12,
    ...shadows.main,
  },
  view: {
    paddingVertical: spacings[12],
    width: WindowWidth,
    height: WindowHeight,
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: radius[8],
    borderTopRightRadius: radius[8],
  },
  fareContainer: { rowGap: spacings[4], flex: 1 },
}));
