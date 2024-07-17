import { Screen } from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { agentActions } from '@vna-base/redux/action-slice';
import { dispatch } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Header, MainContent } from './components';
import { useStyles } from './style';
import { CreditInfoForm } from './type';
import { useSelector } from 'react-redux';
import { selectAgentDetailById } from '@vna-base/redux/selector';

export const CreditInfo = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.CREDIT_INFO>) => {
  const styles = useStyles();
  const { id } = route.params;

  const formMethod = useForm<CreditInfoForm>({});

  const agentDetail = useSelector(selectAgentDetailById);

  useEffect(() => {
    dispatch(agentActions.getAgentDetailById(id));
  }, [id]);

  useEffect(() => {
    formMethod.reset({
      Deposit: agentDetail.Deposit?.currencyFormat(),
      Guarantee: agentDetail.Guarantee?.currencyFormat(),
      CreditLimit: agentDetail.CreditLimit?.currencyFormat(),
      Balance: agentDetail.Balance?.currencyFormat(),
    });
  }, [agentDetail, formMethod]);

  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header />
        <MainContent />
      </FormProvider>
    </Screen>
  );
};
