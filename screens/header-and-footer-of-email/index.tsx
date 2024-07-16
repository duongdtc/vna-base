import { Block, RowOfForm, Screen, Text } from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { I18nKeys } from '@translations/locales';
import { LanguageSystemDetails, SnapPoint } from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer, Header } from './components';
import { useWatchLanguageChange } from './hooks';
import { useStyles } from './styles';
import { HeaderAndFooterForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const HeaderAndFooterOfEmail = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.HEADER_AND_FOOTER_OF_EMAIL
>) => {
  const { languageKey, ...config } = route.params;
  const styles = useStyles();

  const formMethod = useForm<HeaderAndFooterForm>({
    defaultValues: {
      language: languageKey,
    },
  });

  useWatchLanguageChange(formMethod);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header />
        <Block flex={1}>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
              <RowOfForm<HeaderAndFooterForm>
                type="dropdown"
                typeDetails={LanguageSystemDetails}
                t18n="common:language"
                t18nBottomSheet="common:language"
                name="language"
                fixedTitleFontStyle={true}
                removeAll
                snapPoint={[SnapPoint['40%']]}
                control={formMethod.control}
              />
            </Block>

            {/* Header */}
            <Block paddingTop={8} rowGap={12}>
              <Text
                text="Header"
                fontStyle="Title20Semi"
                colorTheme="neutral900"
              />
              <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
                <RowOfForm<HeaderAndFooterForm>
                  type="html"
                  t18n="common:content"
                  t18nModal={'Header' as I18nKeys}
                  name="Header.Data"
                  fixedTitleFontStyle={true}
                  control={formMethod.control}
                  sharedTransitionTag="sharedTransitionTagHeader"
                />
              </Block>
            </Block>

            {/* Footer */}
            <Block paddingTop={8} rowGap={12}>
              <Text
                text="Footer"
                fontStyle="Title20Semi"
                colorTheme="neutral900"
              />
              <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
                <RowOfForm<HeaderAndFooterForm>
                  type="html"
                  t18n="common:content"
                  t18nModal={'Footer' as I18nKeys}
                  name="Footer.Data"
                  fixedTitleFontStyle={true}
                  control={formMethod.control}
                  sharedTransitionTag="sharedTransitionTagFooter"
                />
              </Block>
            </Block>
          </ScrollView>
        </Block>
        <Footer {...config} />
      </FormProvider>
    </Screen>
  );
};
