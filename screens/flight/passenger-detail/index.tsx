/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/no-unstable-nested-components */
import {
  Block,
  Button,
  Icon,
  Image,
  LinearGradient,
  Modal,
  Screen,
  Text,
} from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { PagerRef } from '@vna-base/components/pager/type';
import { navigate } from '@navigation/navigation-service';
import { selectListSelectedFlight, selectSession } from '@redux-selector';
import { flightBookingFormActions, flightResultActions } from '@redux-slice';
import { BookFlightRes } from '@services/axios/axios-ibe';
import { createStyleSheet, useStyles } from '@theme';
import {
  BookFlight,
  ModalWidth,
  WindowHeight,
  WindowWidth,
  dispatch,
  generateInitialPassengerFormData,
  scale,
  validatePassengerForm,
} from '@vna-base/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import {
  SlideInDown,
  SlideOutDown,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { BottomSheetContentFlight } from '../results/components/content-flight-bottom-sheet';
import {
  BottomSheetContentFlightRef,
  FlightOfPassengerForm,
  ModalSubmitRef,
  PassengerForm,
} from '../type';
import {
  BillingInfoTab,
  Footer,
  Header,
  InfoPassengerTab,
  ModalSubmit,
  Pager,
  ServiceTab,
  Summary,
} from './components';

import { images } from '@assets/image';
import { useFocusEffect } from '@react-navigation/native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { UnistylesRuntime } from 'react-native-unistyles';
import { APP_SCREEN } from '@utils';

// Hiện tại màn này chưa có đối tượng nào khiến rerender nên không cần useCallbak, useMemo
export const TabName = {
  INFO_PASSENGER: 'INFO_PASSENGER',
  SERVICE: 'SERVICE',
  BILLING_INFO: 'BILLING_INFO',
};

export const PassengerDetail = () => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const { top } = useSafeAreaInsets();

  const sharedValue = useSharedValue(0);

  const contentFlightBottomSheetRef = useRef<BottomSheetContentFlightRef>(null);
  const summaryBottomSheetRef = useRef<NormalRef>(null);
  const pagerRef = useRef<PagerRef>(null);
  const modalSubmit = useRef<ModalSubmitRef>(null);

  const listSelectedFlight = useSelector(selectListSelectedFlight);
  const session = useSelector(selectSession);

  const [failedMessageVerify, setFailedMessageVerify] = useState<string | null>(
    null,
  );

  const formMethod = useForm<PassengerForm>({
    mode: 'all',
    defaultValues: generateInitialPassengerFormData(listSelectedFlight),
  });

  // Nếu sếp muốn lưu thay đổi sau mỗi 2 giây thì bỏ comment dòng sau đây
  // useWatchFormChange(formMethod);

  const continuesFlow = () => {
    dispatch(
      flightBookingFormActions.bookFlight(
        formMethod.getValues(),
        (
          success: boolean,
          orderInfo: Pick<BookFlightRes, 'OrderId' | 'ListBooking'> & {
            Type: BookFlight;
          },
        ) => {
          navigate(APP_SCREEN.BOOKING_FLIGHT_DONE, {
            success,
            orderInfo,
          });
        },
      ),
    );
  };

  const onChangeTab = (i: number) => {
    formMethod.setValue('TabIndex', i);
  };

  const onPressNext = () => {
    const currTab = formMethod.getValues().TabIndex;
    if (validatePassengerForm(formMethod.getValues(), formMethod.trigger)) {
      if (currTab < 2) {
        pagerRef.current?.changeTab(currTab + 1);
        if (Platform.OS === 'android') {
          formMethod.setValue('TabIndex', currTab + 1);
        }
      } else {
        modalSubmit.current?.show();
      }
    }
  };

  const saveForm = () => {
    const val = formMethod.getValues();
    dispatch(
      flightBookingFormActions.savePassengerForm({
        Passengers: val.Passengers.map(passenger => ({
          ...passenger,
          Baggages: new Array(passenger.Baggages.length),
          Services: new Array(passenger.Services.length),
          PreSeats: new Array(passenger.PreSeats.length),
        })),
        ContactInfo: val.ContactInfo,
        SubmitOption: val.SubmitOption,
      }),
    );
  };

  const backTab = () => {
    const currTab = formMethod.getValues().TabIndex;
    if (currTab > 0) {
      pagerRef.current?.changeTab(currTab - 1);
      if (Platform.OS === 'android') {
        formMethod.setValue('TabIndex', currTab - 1);
      }
    } else {
      // Nếu sếp muốn cải thiện hiệu năng, chỉ lưu khi ấn nút back thì bỏ comment dòng sau
      saveForm();
      navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT);
    }
  };

  useFocusEffect(
    useCallback(() => {
      AvoidSoftInput.setShouldMimicIOSBehavior(true);
      AvoidSoftInput.setEnabled(true);
      AvoidSoftInput.setShowAnimationDuration(100);
      AvoidSoftInput.setHideAnimationDuration(100);

      return () => {
        AvoidSoftInput.setEnabled(false);
        AvoidSoftInput.setShouldMimicIOSBehavior(false);
      };
    }, []),
  );

  useEffect(() => {
    dispatch(
      flightResultActions.verifyFlights(
        listSelectedFlight.map(fl => ({
          FareOptionId: fl.ListFareOption![0].OptionId,
          FlightOptionId: fl.ListFlightOption![0].OptionId,
          AirlineOptionId: fl.OptionId,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          Session: session,
        })),

        ({ verifiedFlights, errMsg }) => {
          if (errMsg) {
            // hiện modal thông báo lỗi
            setFailedMessageVerify(errMsg);
          } else {
            let i = 0;

            formMethod.setValue(
              'FLights',
              verifiedFlights.flatMap(verifiedFlight =>
                verifiedFlight.ListFlight!.map(
                  fl =>
                    ({
                      ...fl,
                      AirlineOptionId: listSelectedFlight[i].OptionId,
                      FlightOptionId:
                        listSelectedFlight[i++].ListFlightOption![0].OptionId,
                      FareOption: verifiedFlight.FareInfo,
                      System: verifiedFlight.System,
                      verified: true,
                    } as FlightOfPassengerForm),
                ),
              ),
            );

            const totalFareFlight = verifiedFlights.reduce(
              (total, currFl) => total + currFl.FareInfo!.TotalFare!,
              0,
            );

            formMethod.setValue('TotalFareFlight', totalFareFlight);

            formMethod.setValue(
              'VerifiedSessions',
              verifiedFlights.map(flf => flf.Session!),
            );
          }
        },
      ),
    );
  }, []);

  const renderScene = [
    {
      tabKey: TabName.INFO_PASSENGER,
      child: () => (
        <InfoPassengerTab
          contentFlightBottomSheetRef={contentFlightBottomSheetRef}
        />
      ),
    },
    {
      tabKey: TabName.SERVICE,
      child: () => <ServiceTab />,
    },
    {
      tabKey: TabName.BILLING_INFO,
      child: () => <BillingInfoTab />,
    },
  ];

  return (
    <Screen
      unsafe
      statusBarStyle="light-content"
      backgroundColor={colors.neutral20}>
      <Block style={[styles.bgLinearContainer, { height: scale(156) + top }]}>
        <LinearGradient type="gra1" style={styles.bgLinearAbove} />
        {/* <LinearGradient type="transparent_50" style={styles.bgLinearBelow} /> */}
      </Block>
      <FormProvider {...formMethod}>
        <Block flex={1}>
          <Header onPressBack={backTab} sharedValue={sharedValue} />
          <Pager
            renderScene={renderScene}
            onChangeTab={onChangeTab}
            ref={pagerRef}
            sharedValue={sharedValue}
          />
          <Summary ref={summaryBottomSheetRef} />
        </Block>
        <Footer
          summaryBottomSheetRef={summaryBottomSheetRef}
          navNextTab={onPressNext}
        />
        <ModalSubmit ref={modalSubmit} onSubmit={continuesFlow} />
      </FormProvider>
      <BottomSheetContentFlight
        ref={contentFlightBottomSheetRef}
        useModal={false}
      />
      <Modal
        isVisible={!!failedMessageVerify}
        entering={SlideInDown}
        exiting={SlideOutDown}>
        <Block
          rowGap={16}
          colorTheme="neutral100"
          borderRadius={12}
          padding={16}
          width={ModalWidth}
          alignSelf="center">
          <Block rowGap={12} alignItems="center">
            <Image
              source={images.default_avatar}
              containerStyle={{ width: 182, height: 72 }}
              resizeMode="contain"
            />
            <Text
              t18n="flight:verify_flight_failed"
              fontStyle="H320Semi"
              colorTheme="primaryColor"
            />
          </Block>
          <Block alignItems="center">
            <Text
              text={failedMessageVerify!}
              fontStyle="Body14Reg"
              colorTheme="neutral80"
              textAlign="center"
            />
          </Block>
          <Block
            borderRadius={8}
            padding={12}
            colorTheme="neutral50"
            flexDirection="row"
            alignItems="center"
            columnGap={12}>
            <Icon icon="alert_circle_fill" size={16} colorTheme="neutral80" />
            <Block flex={1}>
              <Text
                t18n="flight:verify_flight_failed_subtitle"
                fontStyle="Body12Reg"
                colorTheme="neutral100"
                numberOfLines={2}
              />
            </Block>
          </Block>
          <Button
            onPress={() => {
              setFailedMessageVerify(null);
              saveForm();
              navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT);
            }}
            fullWidth
            size="medium"
            t18n="order:closed"
            textColorTheme="neutral100"
            buttonColorTheme="neutral50"
          />
        </Block>
      </Modal>
    </Screen>
  );
};

const styleSheet = createStyleSheet(
  ({ colors, shadows, spacings, radius }) => ({
    container: {
      backgroundColor: colors.neutral10,
    },
    bgLinearContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    bgLinearAbove: {
      flex: 1,
      borderBottomLeftRadius: spacings[8],
      borderBottomRightRadius: spacings[8],
    },
    bgLinearBelow: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: scale(132),
      backgroundColor: '#00000000',
    },
    headerContainer: { flexDirection: 'row', alignItems: 'center' },
    titleSearchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacings[4],
    },
    rightHeader: { alignItems: 'center', gap: spacings[4] },
    footerContainer: {
      paddingBottom: UnistylesRuntime.insets.bottom + spacings[12],
      ...shadows.main,
    },
    btnFooterContainer: {
      flex: 1,
      paddingVertical: spacings[8],
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacings[8],
    },
    inputBaseStyle: {
      color: colors.neutral10,
    },
    btn: { margin: spacings[12] },
    view: {
      paddingVertical: spacings[12],
      width: WindowWidth,
      height: WindowHeight,
      position: 'absolute',
      zIndex: 99,
      top: 0,
      borderTopLeftRadius: radius[8],
      borderTopRightRadius: radius[8],
    },
  }),
);
