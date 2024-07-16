import { Screen } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TaxInfo as TaxInfoType } from '../type';

import { Header, MainContent } from './components';

export const TaxInfo = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.TAX_INFO>) => {
  const { taxInfo, onSubmit } = route.params;

  const formMethod = useForm<TaxInfoType>({
    defaultValues: taxInfo,
    mode: 'all',
  });

  const _onSubmit = () => {
    formMethod.handleSubmit(data => {
      onSubmit(data);
      goBack();
    })();
  };

  return (
    <Screen unsafe>
      <FormProvider {...formMethod}>
        <Header onSubmit={_onSubmit} />
        <MainContent onSubmit={_onSubmit} />
      </FormProvider>
    </Screen>
  );
};
