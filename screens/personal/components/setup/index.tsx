import { Block, Row, Separator, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectLanguage, selectThemeOption } from '@vna-base/redux/selector';
import { appActions } from '@vna-base/redux/action-slice';
import { ThemeOptions } from '@theme/type';
import { I18nKeys } from '@translations/locales';
import { SnapPoint, dispatch } from '@vna-base/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { Language } from '@translations/type';
import { APP_SCREEN } from '@utils';

type LanguageDetail = { key: Language; t18n: I18nKeys };

const LanguageDetails: Record<Language, LanguageDetail> = {
  en: {
    key: 'en',
    t18n: 'system:english',
  },
  vi: {
    key: 'vi',
    t18n: 'system:vietnamese',
  },
};

type ThemeDetail = { key: ThemeOptions; t18n: I18nKeys };

const ThemeDetails: Record<ThemeOptions, ThemeDetail> = {
  [ThemeOptions.Dark]: {
    key: ThemeOptions.Dark,
    t18n: 'system:on',
  },
  [ThemeOptions.Light]: {
    key: ThemeOptions.Light,
    t18n: 'system:off',
  },
  [ThemeOptions.System]: {
    key: ThemeOptions.System,
    t18n: 'system:system',
  },
};

export const Setup = () => {
  const lng = useSelector(selectLanguage);
  const themeOption = useSelector(selectThemeOption);

  return (
    <Block rowGap={16} paddingTop={8}>
      <Text
        t18n="system:normal_setting"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
        <Row
          type="nav"
          t18n="forgot_password_screen:reset_pass"
          fixedTitleFontStyle
          onPress={() => {
            navigate(APP_SCREEN.RESET_PASS);
          }}
          leftIcon="lock_fill"
        />
        <Separator type="horizontal" size={3} />
        <Row
          type="dropdown"
          t18n="system:language"
          t18nBottomSheet="system:language"
          fixedTitleFontStyle
          value={lng}
          removeAll
          snapPoint={[SnapPoint['30%']]}
          typeDetails={LanguageDetails}
          onChange={(val: Language) => {
            dispatch(appActions.changeLanguage(val));
          }}
          leftIcon="en_fill"
        />
        <Separator type="horizontal" size={3} />
        <Row
          type="dropdown"
          t18n="system:dark_mode"
          t18nBottomSheet="system:dark_mode"
          fixedTitleFontStyle
          value={themeOption}
          typeDetails={ThemeDetails}
          removeAll
          snapPoint={[SnapPoint['30%']]}
          onChange={(val: ThemeOptions) => {
            dispatch(appActions.changeThemeOption(val));
          }}
          leftIcon="crescent_moon_fill"
        />
        <Separator type="horizontal" size={3} />
      </Block>
    </Block>
  );
};
