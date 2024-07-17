import {
  Block,
  Button,
  Icon,
  showModalConfirm,
  Text,
  TextInput,
} from '@vna-base/components';
import { PresentType } from '@vna-base/components/text-input/type';
import Clipboard from '@react-native-clipboard/clipboard';
import { selectErrorMsgResetPassword } from '@vna-base/redux/selector';
import { currentAccountActions } from '@vna-base/redux/action-slice';
import { FormLoginType } from '@screens/login/type';
import { translate } from '@vna-base/translations/translate';
import { dispatch, logout, scale } from '@vna-base/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

export const FormResetPassword = () => {
  const [isShowPass, setIsShowPass] = useState(false);

  const errorMsg = useSelector(selectErrorMsgResetPassword);

  const formMethod = useForm<Pick<FormLoginType, 'Password'>>({
    mode: 'all',
  });

  const onSubmitKey = () => {
    formMethod.handleSubmit(resetPassword)();
  };

  const resetPassword = (data: Pick<FormLoginType, 'Password'>) => {
    dispatch(
      currentAccountActions.resetPassword(data.Password, async pass => {
        showModalConfirm({
          lottie: 'done',
          lottieStyle: {
            width: scale(182),
            height: scale(72),
          },
          t18nTitle: 'reset_password:reset_success',
          t18nCancel: 'modal_confirm:copy',
          themeColorCancel: 'success500',
          themeColorTextCancel: 'classicWhite',
          renderBody: () => (
            <Block rowGap={16}>
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral800"
                textAlign="center">
                {translate('common:password') + ': '}
                <Text
                  text={pass}
                  fontStyle="Body14Semi"
                  colorTheme="neutral800"
                />
              </Text>
              <Block
                padding={12}
                columnGap={12}
                colorTheme="neutral50"
                borderRadius={8}
                flexDirection="row"
                alignItems="center">
                <Icon
                  icon="alert_circle_fill"
                  size={16}
                  colorTheme="neutral800"
                />
                <Block flex={1}>
                  <Text
                    t18n="reset_password:note_before_logout"
                    fontStyle="Body12Reg"
                    colorTheme="neutral900"
                  />
                </Block>
              </Block>
            </Block>
          ),
          onCancel: () => {
            Clipboard.setString(pass);
            logout();
          },
        });
      }),
    );
  };

  const focusInputPassword = () => {
    dispatch(currentAccountActions.setErrorMsgResetPassword(undefined));
  };

  const _present = useMemo<PresentType>(() => {
    switch (true) {
      case errorMsg !== undefined:
        return 'error';

      default:
        return 'normal';
    }
  }, [errorMsg]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      formMethod.setFocus('Password');
    }, 400);

    return () => {
      dispatch(currentAccountActions.setErrorMsgResetPassword(undefined));
      clearTimeout(timeId);
    };
  }, [formMethod]);

  // render
  return (
    <FormProvider {...formMethod}>
      <Controller
        name="Password"
        rules={{
          required: true,
        }}
        render={({ field: { ref, onChange, value } }) => {
          return (
            <Block marginTop={16} rowGap={16}>
              <TextInput
                ref={ref}
                labelI18n="reset_password:input_pass"
                present={_present}
                enableHelperText
                helperTextI18n={errorMsg}
                onChangeText={onChange}
                secureTextEntry={!isShowPass}
                onFocus={focusInputPassword}
                placeholderTextColorTheme="secondary400"
                right={
                  <Pressable
                    onPress={() => setIsShowPass(!isShowPass)}
                    style={{ justifyContent: 'center' }}>
                    <Icon
                      icon={isShowPass ? 'eye_off_fill' : 'eye_fill'}
                      size={24}
                      colorTheme="neutral700"
                    />
                  </Pressable>
                }
              />

              <Button
                fullWidth
                disabled={value === '' || value === undefined}
                buttonColorTheme="gra5"
                t18n="common:update"
                onPress={onSubmitKey}
              />
            </Block>
          );
        }}
      />
    </FormProvider>
  );
};
