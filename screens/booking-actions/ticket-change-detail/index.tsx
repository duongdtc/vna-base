import { Button, NormalHeader, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectListSelectedFlight } from '@vna-base/redux/selector';
import { HitSlop } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ListNewFlight,
  ListOldFlight,
} from '../flight-change-detail/components';
import { Footer, ListTicket } from './components';
import { useStyles } from './styles';
import { TicketChangeForm } from './type';
import { generateInitialForm } from './utils';

export const TicketChangeDetail = () => {
  const styles = useStyles();

  const listSelectedFlight = useSelector(selectListSelectedFlight);

  const formMethod = useForm<TicketChangeForm>({
    mode: 'all',
    defaultValues: generateInitialForm(listSelectedFlight),
  });

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral10"
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
            t18n="flight_change:ticket_change"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <ListTicket />
          <ListOldFlight />
          <ListNewFlight />
        </ScrollView>
        <Footer />
      </FormProvider>
    </Screen>
  );
};
