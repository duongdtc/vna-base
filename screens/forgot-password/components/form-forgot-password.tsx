import { Block, Button } from '@vna-base/components';
import { FormLoginType } from '@vna-base/screens/login/type';
import { FontStyle } from '@theme/typography';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useStyles } from '../style';
import { Input } from './input';

export const FormForgotPassword = () => {
  const styles = useStyles();

  // state
  const formMethod = useForm<FormLoginType>({
    mode: 'all',
  });

  /**
   * pass into submit button
   */
  const onSubmitKey = () => {
    formMethod.handleSubmit(forgotPass)();
  };

  /**
   * dispatch Action login and then save account by saveAccount function
   * @param data
   */
  const forgotPass = (data: FormLoginType) => {
    console.log(
      '🚀 ~ file: form-reset-password.tsx:33 ~ forgotPass ~ data:',
      data,
    );
  };

  const focusInputAgentCode = () => {
    formMethod.setFocus('AgentCode');
  };

  const focusInputUsername = () => {
    formMethod.setFocus('Username');
  };

  // render
  return (
    <FormProvider {...formMethod}>
      <Block marginTop={32} rowGap={16}>
        <Input<FormLoginType>
          name={'AgentCode'}
          style={[styles.inputBaseStyle, FontStyle.Title16Bold]}
          onSubmitEditing={focusInputAgentCode}
          returnKeyType="next"
          labelI18n="login_screen:agentCode"
        />
        <Input<FormLoginType>
          name={'Username'}
          style={[styles.inputBaseStyle, FontStyle.Title16Bold]}
          onSubmitEditing={focusInputUsername}
          returnKeyType="next"
          labelI18n="login_screen:username"
        />

        <Button
          fullWidth
          buttonColorTheme="primary500"
          t18n="common:confirm"
          onPress={onSubmitKey}
        />
      </Block>
    </FormProvider>
  );
};
