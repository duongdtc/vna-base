import { Block, Screen } from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActions } from '@vna-base/redux/action-slice';
import { dispatch } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React, { useEffect } from 'react';
import { Footer, Header, TabContent, TopInfo } from './components';

export const BookingDetailView = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.BOOKING_VERSION_DETAIL
>) => {
  const { id, versionDate } = route.params;

  useEffect(() => {
    dispatch(bookingActions.getBookingVersionDetail(id));

    return () => {
      dispatch(bookingActions.saveViewingBookingVersion(null));
    };
  }, []);

  return (
    <Screen>
      <Header />
      <Block flex={1}>
        <TopInfo versionDate={versionDate} />
        <TabContent />
      </Block>
      <Footer />
    </Screen>
  );
};
