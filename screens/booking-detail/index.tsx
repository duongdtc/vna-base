import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  Block,
  BottomSheetHistory,
  BottomSheetHistoryRef,
  Screen,
} from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { bookingActions } from '@vna-base/redux/action-slice';
import {
  BookingStatus,
  ObjectHistoryTypes,
  System,
  dispatch,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  BottomInfoFlightBookingOrder,
  FlightActionBottomSheet,
  HeaderBookingOrderDetail,
  TabContent,
  TicketFareBottomSheet,
  TopInfo,
} from './components';
import { FlightActionBottomSheetRef, FormBookingDetail } from './type';

export const BookingDetail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.BOOKING_DETAIL>) => {
  const { id, system, bookingCode, surname } = route.params;

  const bottomSheetRef = useRef<NormalRef>(null);
  const flightActionRef = useRef<FlightActionBottomSheetRef>(null);
  const BTSHistoryRef = useRef<BottomSheetHistoryRef>(null);

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<FormBookingDetail>({
    mode: 'all',
  });

  const _onShowContentBottom = () => {
    bottomSheetRef.current?.present();
  };

  const _showFlightAction = () => {
    flightActionRef.current?.present({ bookingId: id });
  };

  useEffect(() => {
    dispatch(
      bookingActions.getBookingByIdOrBookingCode(
        { id, system, bookingCode, surname },
        { isViewing: true },
      ),
    );

    return () => {
      dispatch(bookingActions.saveViewingBookingId(null));
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(bookingDetail)) {
      formMethod.reset(
        {
          BookingCode: bookingDetail.BookingCode,
          BookingStatus: bookingDetail.BookingStatus as BookingStatus,
          Passengers: bookingDetail.Passengers?.map(psg => ({
            BirthDate: psg.BirthDate,
            DocumentExpiry: psg.DocumentExpiry,
            DocumentNumb: psg.DocumentNumb,
            Gender: psg.Gender,
            GivenName: psg.GivenName,
            IssueCountry: psg.IssueCountry,
            Membership: psg.Membership,
            Nationality: psg.Nationality,
            PaxType: psg.PaxType,
            Surname: psg.Surname,
          })),
        },
        { keepDirty: true },
      );
    }
  }, [bookingDetail]);

  return (
    <Screen unsafe>
      <FormProvider {...formMethod}>
        <HeaderBookingOrderDetail
          info={{
            id: bookingDetail?.Id,
            system: bookingDetail?.System as System,
            airline: bookingDetail?.Airline,
          }}
          onPressHistory={() => {
            BTSHistoryRef.current?.present({
              ObjectId: bookingDetail?.Id,
              ObjectType: ObjectHistoryTypes.BOOKING,
            });
          }}
        />
        <Block flex={1}>
          <TopInfo
            info={{
              expirationDate: bookingDetail?.ExpirationDate,
              timePurchase: bookingDetail?.TimePurchase,
              bookingDate: bookingDetail?.BookingDate,
            }}
          />
          <TabContent id={id} />
        </Block>
      </FormProvider>
      <BottomInfoFlightBookingOrder
        expand={_onShowContentBottom}
        showFlightAction={_showFlightAction}
      />
      {/* {bookingId && (
        <> */}
      <TicketFareBottomSheet ref={bottomSheetRef} />
      <FlightActionBottomSheet ref={flightActionRef} />
      {/* </>
      )} */}
      <BottomSheetHistory ref={BTSHistoryRef} />
    </Screen>
  );
};
