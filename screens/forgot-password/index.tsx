import { images } from '@assets/image';
import {
  Block,
  Button,
  Image,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { useTheme } from '@theme';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStyles } from './style';
import { Form } from './components/form-forgot-password';
import { scale } from '@vna-base/utils';

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
            source={images.logo_color}
            style={{ width: scale(212), height: scale(28) }}
            resizeMode="cover"
          />
        }
      />
      <Block flex={1} paddingHorizontal={16}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <Text
            textAlign="center"
            fontStyle="H224Semi"
            colorTheme="primaryPressed"
            t18n="forgot_password_screen:reset_pass"
            style={styles.welcomeTitle}
          />
          <Text
            textAlign="center"
            fontStyle="Body14Med"
            colorTheme="neutral80"
            t18n="forgot_password_screen:description"
          />
          <Form />
        </KeyboardAwareScrollView>
      </Block>
    </Screen>
  );
};
