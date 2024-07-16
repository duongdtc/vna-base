import {
  Block,
  Button,
  Icon,
  NormalHeader,
  RowOfForm,
  Screen,
  Text,
  showToast,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, SnapPoint } from '@vna-base/utils';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Share from 'react-native-share';
import { useStyles } from './styles';
import { LanguageType, LanguageTypeDetails, SMSSendForm } from './type';
import { genContent } from './utils';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const SMSSend = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.SMSSend>) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const bookingId = route.params.id;

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const formMethod = useForm<SMSSendForm>({
    mode: 'all',
    defaultValues: {
      languageType: LanguageType.VI,
      content: genContent(bookingDetail?.toJSON() as Booking, LanguageType.VI),
    },
  });

  const copyContent = () => {
    formMethod.handleSubmit(form => {
      Clipboard.setString(form.content);
      showToast({
        type: 'success',
        t18n: 'sms_send:copied_to_clipboard',
      });
    })();
  };

  const shareContent = () => {
    formMethod.handleSubmit(async form => {
      try {
        await Share.open({
          message: form.content,
        });
      } catch (error) {
        console.log('🚀 ~ shareContent ~ error:', error);
      }
    })();
  };

  useEffect(() => {
    const subscription = formMethod.watch((value, info) => {
      if (info.name === 'languageType' && info.type === 'change') {
        formMethod.setValue(
          'content',
          genContent(bookingDetail?.toJSON() as Booking, value.languageType),
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [bookingDetail, formMethod]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <NormalHeader
          colorTheme="neutral100"
          shadow=".3"
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
          rightContent={
            <Button
              hitSlop={HitSlop.Large}
              type="common"
              size="small"
              leftIcon="share_outline"
              textColorTheme="neutral900"
              leftIconSize={24}
              padding={4}
              onPress={shareContent}
            />
          }
          centerContent={
            <Text
              t18n="sms_send:sms"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
          }
        />
        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
            <RowOfForm<SMSSendForm>
              type="dropdown"
              t18n="sms_send:language"
              t18nBottomSheet="sms_send:language"
              name="languageType"
              fixedTitleFontStyle={true}
              control={formMethod.control}
              typeDetails={LanguageTypeDetails}
              removeAll
              snapPoint={[SnapPoint['40%']]}
              t18nAll="common:not_choose"
            />
          </Block>
          <Controller
            control={formMethod.control}
            name="content"
            render={({ field: { value, onChange, ref } }) => (
              <Pressable
                onPress={() => {
                  formMethod.setFocus('content');
                }}
                style={styles.contentSMSContainer}>
                <Block
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    t18n="sms_send:content"
                    fontStyle="Title16Semi"
                    colorTheme="neutral900"
                  />
                  <Icon icon="edit_2_fill" colorTheme="neutral700" size={20} />
                </Block>
                <TextInput
                  ref={ref}
                  value={value}
                  onChangeText={onChange}
                  placeholder={translate('sms_send:input_sms_content')}
                  placeholderTextColor={colors.neutral400}
                  style={styles.contentSMS}
                  multiline
                />
              </Pressable>
            )}
          />
        </KeyboardAwareScrollView>
        <Block style={styles.footerContainer}>
          <Block flex={1}>
            <Button
              onPress={copyContent}
              fullWidth
              size="medium"
              t18n="sms_send:copy"
              textColorTheme="classicWhite"
              textFontStyle="Body14Semi"
              buttonColorTheme="success600"
            />
          </Block>
        </Block>
      </FormProvider>
    </Screen>
  );
};
