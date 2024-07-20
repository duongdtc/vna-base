import { SubmitBtn } from '@screens/forgot-password/components/submit-btn';
import { FontStyle } from '@theme/typography';
import { Block } from '@vna-base/components';
import { FormForgotPassword } from '@vna-base/screens/forgot-password/type';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useStyles } from '../style';
import { Input } from './input';

export const Form = () => {
  const styles = useStyles();

  // state
  const formMethod = useForm<FormForgotPassword>({
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
  const forgotPass = (data: FormForgotPassword) => {
    console.log(
      '🚀 ~ file: form-reset-password.tsx:33 ~ forgotPass ~ data:',
      data,
    );
  };

  // render
  return (
    <FormProvider {...formMethod}>
      <Block marginTop={32} rowGap={16}>
        <Input<FormForgotPassword>
          name={'Email'}
          style={[styles.inputBaseStyle, FontStyle.Title16Bold]}
          onSubmitEditing={onSubmitKey}
          returnKeyType="done"
          labelI18n="common:email"
        />
        <SubmitBtn onPress={onSubmitKey} />
      </Block>
    </FormProvider>
  );
};
