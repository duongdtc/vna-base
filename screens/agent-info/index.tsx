import { Screen } from '@vna-base/components';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { HeaderAgentInfo, MainInfo, TopInfo } from './components';
import { useStyles } from './style';
import { FormAgentInfoType } from './type';
import { useSelector } from 'react-redux';
import { selectCurrentAccount } from '@redux-selector';

export const AgentInfo = () => {
  const styles = useStyles();

  const { Agent } = useSelector(selectCurrentAccount);

  const formMethod = useForm<FormAgentInfoType>({
    mode: 'all',
  });

  useEffect(() => {
    formMethod.reset({
      GeneralTab: {
        CustomerID: Agent?.CustomerID ?? '',
        AgentCode: Agent?.AgentCode,
        Phone: Agent?.Phone ?? '',
        Email: Agent?.Email ?? '',
        Address: Agent?.Address ?? '',
      },
      CompanyInfo: {
        Company: Agent?.Company ?? '',
      },
    });
  }, [Agent, formMethod]);

  // render
  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <HeaderAgentInfo />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          <TopInfo />
          <MainInfo />
        </ScrollView>
      </FormProvider>
    </Screen>
  );
};
