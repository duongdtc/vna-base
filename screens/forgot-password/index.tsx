import { images } from '@assets/image';
import { Block, Button, Image, NormalHeader, Screen, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { useTheme } from '@theme';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStyles } from './style';
import { FormForgotPassword } from './components/form-forgot-password';

export const ForgotPassword = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  // render
  return (
    <Screen bottomInsetColor="transparent" backgroundColor={colors.neutral100}>
      <NormalHeader
        leftContent={
          <Button
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={32}
            padding={0}
            onPress={() => {
              goBack();
            }}
          />
        }
        centerContent={
          <Image
            source={images.logo}
            style={{ width: 132, height: 16 }}
            resizeMode="center"
          />
        }
      />
      <Block flex={1} paddingHorizontal={16}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <Text
            fontStyle="Display24Bold"
            colorTheme={'neutral900'}
            t18n="forgot_password_screen:reset_pass"
            style={styles.welcomeTitle}
          />
          <Text
            fontStyle="Body14Reg"
            colorTheme={'neutral900'}
            t18n="forgot_password_screen:note_input"
          />
          <FormForgotPassword />
        </KeyboardAwareScrollView>
      </Block>
    </Screen>
  );
};
