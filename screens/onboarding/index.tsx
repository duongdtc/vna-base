import { images } from '@assets/image';
import { Block, Button, Image, Screen } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectLanguage } from '@redux-selector';
import { appActions } from '@redux-slice';
import { ScreenHeight, dispatch } from '@vna-base/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';
import { Language } from '@translations/type';
import { BottomChangeLangugae } from '../login/bottom-change-lang';

export const OnboardingScreen = () => {
  const currentLanguage = useSelector(selectLanguage);
  const _changeLanguage = (lang: Language) => {
    dispatch(appActions.changeLanguage(lang));
  };

  const continueFlow = () => {
    navigate(APP_SCREEN.LOGIN);
  };

  // render
  return (
    <Screen>
      <Block
        alignSelf="center"
        style={{ height: 36, width: 298, marginTop: ScreenHeight / 5 }}>
        <Image
          source={images.logo}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </Block>
      <Block
        alignItems="center"
        marginHorizontal={24}
        style={{ marginTop: ScreenHeight / 2.5 }}>
        <Button
          t18n={'onboarding_screen:login'}
          buttonColorTheme="primary500"
          type="common"
          fullWidth
          onPress={continueFlow}
        />
        {/* <Button
          textStyle={styles.txtContact}
          t18n={'onboarding_screen:contact'}
          onPress={() => {}}
        /> */}
      </Block>
      <BottomChangeLangugae
        hideChild={true}
        currentLanguage={currentLanguage}
        changeLanguage={_changeLanguage}
      />
    </Screen>
  );
};
