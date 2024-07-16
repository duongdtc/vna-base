/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  hideLoading,
  Icon,
  NormalHeader,
  Screen,
  showLoading,
  Text,
} from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchForm } from '@vna-base/screens/flight/components';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import {
  delay,
  getState,
  HitSlop,
  resetSearchFlight,
  System,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { useStyles } from './styles';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const FlightChange = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.FlightChange>) => {
  const styles = useStyles();
  const { id } = route.params;
  const sharedValue = useSharedValue(0);

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isEmpty(bookingDetail) && (bookingDetail?.Id === id || !id)) {
      setIsMounted(true);
    }
  }, [bookingDetail, id]);

  useEffect(() => {
    return () => {
      resetSearchFlight();
    };
  }, []);

  const cbSubmit = async () => {
    showLoading();
    const screenWhenDone =
      getState('bookingAction').currentFeature.featureId === 'TicketExch'
        ? APP_SCREEN.TICKET_CHANGE_DETAIL
        : APP_SCREEN.FLIGHT_CHANGE_DETAIL;

    await delay(100);
    navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT, {
      hideBookingSystems: true,
      hidePassengers: true,
      screenWhenDone,
      disableCustomFee: true,
    });
    hideLoading();
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
            t18n={
              getState('bookingAction').currentFeature.featureId ===
              'TicketExch'
                ? 'flight_change:ticket_change'
                : 'flight_change:flight_change'
            }
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1}>
        {isMounted && (
          <SearchForm
            callbackSubmit={cbSubmit}
            sharedValue={sharedValue}
            initPassengers={{
              Adt: bookingDetail!.Adt!,
              Chd: bookingDetail?.Chd,
              Inf: bookingDetail?.Inf,
            }}
            initSystem={bookingDetail?.System as System}
            hideBookingSystems={true}
            hidePassengers={true}
            disableRoundStage={bookingDetail?.System === System.VJ}
            disableMultiStage={bookingDetail?.System === System.VJ}
            Footer={
              bookingDetail?.System === System.VJ ? (
                <Block
                  marginHorizontal={16}
                  marginTop={16}
                  colorTheme="neutral100"
                  borderRadius={8}
                  padding={12}
                  flexDirection="row"
                  alignItems="center"
                  columnGap={12}>
                  <Icon
                    icon="alert_circle_fill"
                    size={16}
                    colorTheme="neutral900"
                  />
                  <Text
                    t18n="flight_change:vj_sub"
                    fontStyle="Body12Reg"
                    colorTheme="neutral900"
                  />
                </Block>
              ) : undefined
            }
          />
        )}
      </Block>
    </Screen>
  );
};
