import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bookingActionActions } from '@redux-slice';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { delay, dispatch, HitSlop } from '@vna-base/utils';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Baggages, Footer, Services } from './components';
import { useStyles } from './styles';
import { AncillaryUpdateForm } from './type';
import { generateInitialAncillaryUpdateForm } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const AncillaryUpdate = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.AncillaryUpdate>) => {
  const styles = useStyles();

  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const [isMounted, setIsMounted] = useState(false);

  const formMethod = useForm<AncillaryUpdateForm>({
    defaultValues: { passengers: [] },
  });

  useEffect(() => {
    const init = async (bd: Booking) => {
      dispatch(bookingActionActions.getAncillaries(bd));
      formMethod.reset(generateInitialAncillaryUpdateForm(bd));

      await delay(100);

      setIsMounted(true);
    };

    init(bookingDetail?.toJSON() as Booking);
  }, []);

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
        {isMounted ? (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Baggages />
            <Services />
          </ScrollView>
        ) : (
          <Block flex={1} />
        )}
        <Footer />
      </FormProvider>
    </Screen>
  );
};
