/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { agentActions } from '@vna-base/redux/action-slice';
import { dispatch } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';
import { Header, MainContent, TopInfo } from './components';
import { useStyles } from './style';
import { FormNewAgentType } from './type';

export const AddNewAgent = () => {
  const styles = useStyles();

  const formMethod = useForm<FormNewAgentType>({
    mode: 'all',
    defaultValues: {
      Logo: null,
      Active: true,
      CustomerID: null,
      AgentName: null,
      AgentGroup: null,
      AgentType: null,
      Phone: null,
      Email: null,
      Contact: null,
      Address: null,
      SISetId: null,
      OfficeId: null,
      CreditLimit: undefined,
      Guarantee: undefined,
      AllowSearch: false,
      AllowBook: false,
      AllowIssue: false,
      AllowVoid: false,
      UseB2B: false,
    },
  });

  const parseNumber = (str: string) => {
    return parseFloat(str.replace(/,/g, ''));
  };

  const submit = useCallback(() => {
    formMethod.handleSubmit(data => {
      const parsedData: FormNewAgentType = {
        ...data,
        //@ts-ignore
        CreditLimit: parseNumber(data.CreditLimit!),
        //@ts-ignore
        Guarantee: parseNumber(data.Guarantee!),
      };

      dispatch(agentActions.insertNewAgent(parsedData, goBack));
    })();
  }, [formMethod]);

  // render
  return (
    <Screen
      unsafe={true}
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <FormProvider {...formMethod}>
        <Header />
        <ScrollView style={styles.contentContainer}>
          <TopInfo />
          <MainContent />
        </ScrollView>
        <Block style={styles.containerBottom}>
          <Pressable style={{ marginHorizontal: 12 }} onPress={submit}>
            <Block
              borderRadius={8}
              paddingVertical={16}
              alignItems="center"
              justifyContent="center"
              colorTheme="primary600">
              <Text
                t18n="common:save"
                fontStyle="Title16Bold"
                colorTheme="classicWhite"
              />
            </Block>
          </Pressable>
        </Block>
      </FormProvider>
    </Screen>
  );
};
