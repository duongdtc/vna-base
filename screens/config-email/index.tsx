import { BottomSheetHistory, BottomSheetHistoryRef, Screen } from '@vna-base/components';
import { selectConfigEmail } from '@vna-base/redux/selector';
import { configEmailActions } from '@vna-base/redux/action-slice';
import { ObjectHistoryTypes, TicketMimeType, dispatch } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RefreshControl, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import {
  CommonConfig,
  Footer,
  Header,
  HeaderAndFooter,
  Logo,
  MailServerInfo,
  Template,
} from './components';
import { useStyles } from './styles';
import { ConfigEmailForm } from './type';

export const ConfigEmail = () => {
  const styles = useStyles();

  const BTSHistoryRef = useRef<BottomSheetHistoryRef>(null);

  const configEmail = useSelector(selectConfigEmail);

  const formMethod = useForm<ConfigEmailForm>();

  useEffect(() => {
    if (isEmpty(configEmail)) {
      dispatch(configEmailActions.getConfigEmail());
      dispatch(configEmailActions.getTemplates());
    }
  }, []);

  const onRefresh = useCallback(() => {
    if (!isEmpty(configEmail)) {
      dispatch(configEmailActions.getConfigEmail());
    }
  }, [configEmail]);

  useEffect(() => {
    if (!isEmpty(configEmail)) {
      formMethod.reset({
        EnableSSL: configEmail.EnableSSL,
        MailServer: configEmail.MailServer,
        Host: configEmail.Host,
        MailAddress: configEmail.MailAddress,
        Password: configEmail.Password,
        Port: configEmail.Port?.toString(),
        SenderName: configEmail.SenderName,
        CCEmail: configEmail.CCEmail,
        logo: configEmail.Logo,

        showHeader: configEmail.ShowHeader ?? undefined,
        showFooter: configEmail.ShowFooter ?? undefined,
        showPrice: configEmail.ShowPrice ?? undefined,
        showPNR: configEmail.ShowPNR ?? undefined,
        individualTicket: configEmail.IndividualTicket,
        includeETicket: configEmail.IncludeETicket,
        template: configEmail.Template ?? undefined,
        ticketType:
          (configEmail.TicketFormat as TicketMimeType) ?? TicketMimeType.HTML,
      });
    }
  }, [configEmail, formMethod]);

  const openHistory = () => {
    BTSHistoryRef.current?.present({
      ObjectId: configEmail.Id,
      ObjectType: ObjectHistoryTypes.CONFIG_EMAIL,
    });
  };

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header openHistory={openHistory} />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }>
          <MailServerInfo />
          <Template />
          <CommonConfig />
          <HeaderAndFooter />
          <Logo />
        </ScrollView>
        <Footer />
      </FormProvider>
      <BottomSheetHistory ref={BTSHistoryRef} />
    </Screen>
  );
};
