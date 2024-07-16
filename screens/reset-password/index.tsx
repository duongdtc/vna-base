import { Block, Button, NormalHeader, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import React from 'react';
import { FormResetPassword } from './components/form-forgot-password';
import { useStyles } from './style';
import { HitSlop } from '@vna-base/utils';

export const ResetPassword = () => {
  const styles = useStyles();

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        shadow=".3"
        colorTheme="neutral100"
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
            t18n="forgot_password_screen:reset_pass"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1} paddingHorizontal={16}>
        <FormResetPassword />
      </Block>
    </Screen>
  );
};
