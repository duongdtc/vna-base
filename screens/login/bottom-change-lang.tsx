import { Button, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { createStyleSheet, useStyles, bs } from '@theme';
import { scale } from '@vna-base/utils';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '@translations/type';
import { APP_SCREEN } from '@utils';

type Props = {
  currentLanguage: string | undefined;
  changeLanguage: (lang: Language) => void;
  hideChild?: boolean;
};

export const BottomChangeLangugae = (props: Props) => {
  const { bottom } = useSafeAreaInsets();
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const { currentLanguage, changeLanguage, hideChild = false } = props;

  const _goToForgotPasswordScreen = () => {
    navigate(APP_SCREEN.FORGOT_PASSWORD);
  };

  return (
    <View style={[styles.container, { bottom: bottom + scale(12) }]}>
      {!hideChild && (
        <Button
          type="common"
          t18n="login_screen:forgot_password"
          textFontStyle="Body16Bold"
          textColorTheme="primaryColor"
          alignSelf="center"
          onPress={_goToForgotPasswordScreen}
        />
      )}
      <View style={[bs.flexDirectionRow, bs.contentCenter, bs.columnGap_16]}>
        <TouchableOpacity
          onPress={() => changeLanguage('vi')}
          disabled={currentLanguage === 'vi'}
          style={[
            styles.btnContainer,
            {
              borderBottomColor:
                currentLanguage === 'vi'
                  ? colors.primaryColor
                  : colors.neutral10,
            },
          ]}>
          <Text
            fontStyle="Body16Reg"
            colorTheme={currentLanguage === 'vi' ? 'neutral100' : 'neutral60'}
            text="Tiếng Việt"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeLanguage('en')}
          disabled={currentLanguage === 'en'}
          style={[
            styles.btnContainer,
            {
              borderBottomColor:
                currentLanguage === 'en'
                  ? colors.primaryColor
                  : colors.neutral10,
            },
          ]}>
          <Text
            fontStyle="Body16Reg"
            colorTheme={currentLanguage === 'en' ? 'neutral100' : 'neutral60'}
            text="English"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(({}) => ({
  container: {
    position: 'absolute',
    alignSelf: 'center',
  },
  btnContainer: {
    borderBottomWidth: scale(3),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(8),
    width: scale(104),
  },
}));
