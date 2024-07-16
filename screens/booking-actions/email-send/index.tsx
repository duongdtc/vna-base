import {
  Block,
  Button,
  Icon,
  NormalHeader,
  RowOfForm,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  HitSlop,
  LanguageEmailBooking,
  LanguageSystemDetails,
  SnapPoint,
  System,
} from '@vna-base/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Footer, ListEmail } from './components';
import { useStyles } from './styles';
import { EmailSendForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const EmailSend = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.EmailSend>) => {
  const styles = useStyles();
  const { id } = route.params;

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const formMethod = useForm<EmailSendForm>({
    mode: 'onBlur',
    defaultValues: {
      language: LanguageEmailBooking.VI,
      emails: [{ value: bookingDetail?.ContactEmail ?? '' }],
    },
  });

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
          centerContent={
            <Text
              t18n="send_email:send_email"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
          }
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {bookingDetail?.System === System.VN && (
            <Block
              colorTheme="neutral100"
              borderRadius={8}
              flexDirection="row"
              padding={12}
              columnGap={12}
              alignItems="center">
              <Icon
                icon="alert_circle_fill"
                size={16}
                colorTheme="neutral800"
              />
              <Block flex={1}>
                <Text fontStyle="Body12Reg" colorTheme="neutral900">
                  {translate('common:with')}
                  <Text
                    fontStyle="Body12Bold"
                    colorTheme="neutral900"
                    text=" Vietnam Airline"
                  />
                  {translate('send_email:vn_desc')}
                  <Text
                    fontStyle="Body12Bold"
                    colorTheme="neutral900"
                    text="Sửa liên hệ "
                  />
                  {translate('common:before')}
                </Text>
              </Block>
            </Block>
          )}

          <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
            <RowOfForm<EmailSendForm>
              type="dropdown"
              typeDetails={{
                [LanguageEmailBooking.VI]:
                  LanguageSystemDetails[LanguageEmailBooking.VI],
                [LanguageEmailBooking.EN]:
                  LanguageSystemDetails[LanguageEmailBooking.EN],
              }}
              t18n="common:language"
              t18nBottomSheet="common:language"
              name="language"
              fixedTitleFontStyle={true}
              removeAll
              snapPoint={[SnapPoint['30%']]}
              control={formMethod.control}
            />
          </Block>
          {bookingDetail?.System !== System.VN && <ListEmail />}
        </ScrollView>
        <Footer id={id} />
      </FormProvider>
    </Screen>
  );
};
