import { BottomSheetHistory, BottomSheetHistoryRef, Screen } from '@vna-base/components';
import { selectConfigTicket } from '@vna-base/redux/selector';
import { configTicketActions } from '@vna-base/redux/action-slice';
import { ObjectHistoryTypes, TEMPLATE_E_TICKET, dispatch } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RefreshControl, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import {
  CommonConfig,
  Footer,
  Header,
  Logo,
  Template,
  TitleAndRemark,
} from './components';
import { useStyles } from './styles';
import { ConfigTicketForm } from './type';

export const ConfigTicket = () => {
  const styles = useStyles();

  const configTicket = useSelector(selectConfigTicket);
  const historyBTSRef = useRef<BottomSheetHistoryRef>(null);

  const formMethod = useForm<ConfigTicketForm>();

  useEffect(() => {
    // nếu chưa lấy config ticket thì lấy
    if (isEmpty(configTicket)) {
      dispatch(configTicketActions.getConfigTicket());
      dispatch(configTicketActions.getTemplates());
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(configTicket)) {
      formMethod.reset({
        foreColor: configTicket.ForeColor ?? undefined,
        logo: configTicket.Logo,
        mainColor: configTicket.MainColor ?? undefined,
        PNRColor: configTicket.PNRColor ?? undefined,
        showTicketNumber: configTicket.ShowTicket,
        template: configTicket.Template ?? TEMPLATE_E_TICKET.Temp1,
      });
    }
  }, [configTicket]);

  const onRefresh = useCallback(() => {
    if (!isEmpty(configTicket)) {
      dispatch(configTicketActions.getConfigTicket());
    }
  }, [configTicket]);

  const openHistoryBts = useCallback(() => {
    historyBTSRef.current?.present({
      ObjectId: configTicket?.Id,
      ObjectType: ObjectHistoryTypes.CONFIG_TICKET,
    });
  }, [configTicket]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header openHistoryBts={openHistoryBts} />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          <Template />
          <CommonConfig />
          <TitleAndRemark />
          <Logo />
        </ScrollView>
        <Footer />
      </FormProvider>
      <BottomSheetHistory ref={historyBTSRef} />
    </Screen>
  );
};
