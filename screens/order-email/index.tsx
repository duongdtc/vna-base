/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  Icon,
  NormalHeader,
  RowOfForm,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectEmail, selectViewingOrderId } from '@vna-base/redux/selector';
import {
  CurrencyDetails,
  Currency as CurrencyType,
  EmailType,
  EmailTypeDetails,
  HitSlop,
  LanguageSystem,
  LanguageSystemDetails,
  OrderStatus as OrderStatusType,
  SnapPoint,
  TicketMimeType,
  rxMultiEmail,
} from '@vna-base/utils';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { ETicketOptions, Footer, Input, TicketType } from './components';
import { useWatchGetETicket, useWatchGetEmail } from './hooks';
import { useStyles } from './styles';
import { EmailForm } from './type';
import { useObject } from '@services/realm/provider';
import { OrderRealm } from '@services/realm/models/order';

function getEmailType(orderStatus: OrderStatusType) {
  switch (true) {
    case orderStatus === OrderStatusType.NEW ||
      orderStatus === OrderStatusType.DOING:
      return EmailType.ORDER_INFO;

    case orderStatus === OrderStatusType.PAID:
      return EmailType.ORDER_CONFIRM;

    case orderStatus === OrderStatusType.DONE:
      return EmailType.ORDER_PAID;

    case orderStatus === OrderStatusType.CLOSED:
      return EmailType.ORDER_CANCEL;
  }
}

export const OrderEmail = () => {
  const styles = useStyles();

  const { Subject } = useSelector(selectEmail);

  const viewingOrderId = useSelector(selectViewingOrderId);

  const orderDetail = useObject<OrderRealm>(OrderRealm.schema.name, viewingOrderId!);

  const formMethod = useForm<EmailForm>({
    defaultValues: {
      emailType: orderDetail?.OrderStatus
        ? getEmailType(orderDetail?.OrderStatus as OrderStatusType)
        : EmailType.ORDER_INFO,
      language: (orderDetail?.Language ?? LanguageSystem.VI) as LanguageSystem,
      currency: (orderDetail?.Currency ?? CurrencyType.VND) as CurrencyType,
      ticketType: TicketMimeType.HTML,
      allPassenger: true,
      attachETicket: true,
      email: orderDetail?.ContactEmail ?? '',
      orderId: viewingOrderId!,
      showFooter: true,
      showHeader: true,
      showPNR: true,
      showPrice: true,
    },
    // resolver: zodResolver(emailFormValidate),
    mode: 'all',
  });

  useWatchGetEmail(formMethod);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  useWatchGetETicket(formMethod, orderDetail?.Bookings);

  useEffect(() => {
    if (Subject && Subject !== '') {
      formMethod.setValue('subject', Subject);
    }
  }, [Subject]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
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
              t18n="order_email:send_email"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
          }
        />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          <Input name="subject" t18n="common:subject" multiline required />

          <Input
            name="email"
            t18n="common:email"
            autoCapitalize="none"
            textContentType="emailAddress"
            multiline
            pattern={rxMultiEmail}
          />

          <Block
            padding={12}
            columnGap={12}
            flexDirection="row"
            borderRadius={8}
            colorTheme="warning50">
            <Icon icon="alert_circle_fill" size={16} colorTheme="neutral800" />
            <Block flex={1}>
              <Text
                t18n="common:email_separate"
                numberOfLines={2}
                ellipsizeMode="tail"
                fontStyle="Body12Reg"
                colorTheme="neutral900"
              />
            </Block>
          </Block>

          <Block paddingTop={8} rowGap={8}>
            <Text
              t18n="common:options"
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
            <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
              <RowOfForm<EmailForm>
                type="dropdown"
                t18n="common:type"
                t18nBottomSheet="common:type"
                name="emailType"
                fixedTitleFontStyle
                control={formMethod.control}
                typeDetails={EmailTypeDetails}
                colorThemeValue="neutral900"
                removeAll
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<EmailForm>
                type="dropdown"
                t18n="common:language"
                t18nBottomSheet="common:language"
                name="language"
                fixedTitleFontStyle
                control={formMethod.control}
                typeDetails={LanguageSystemDetails}
                colorThemeValue="neutral900"
                removeAll
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<EmailForm>
                type="dropdown"
                snapPoint={[SnapPoint['30%']]}
                t18n="common:currency"
                t18nBottomSheet="common:currency"
                name="currency"
                fixedTitleFontStyle
                control={formMethod.control}
                typeDetails={CurrencyDetails}
                colorThemeValue="neutral900"
                removeAll
              />
              <TicketType />
            </Block>
          </Block>
          <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
            <RowOfForm<EmailForm>
              type="switch"
              t18n="order_email:show_price"
              name="showPrice"
              fixedTitleFontStyle={true}
              control={formMethod.control}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<EmailForm>
              type="switch"
              t18n="order_email:show_header"
              name="showHeader"
              fixedTitleFontStyle={true}
              control={formMethod.control}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<EmailForm>
              type="switch"
              t18n="order_email:show_footer"
              name="showFooter"
              fixedTitleFontStyle={true}
              control={formMethod.control}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<EmailForm>
              type="switch"
              t18n="order_email:show_booking_code"
              name="showPNR"
              fixedTitleFontStyle={true}
              control={formMethod.control}
            />
          </Block>

          <ETicketOptions />
        </ScrollView>
        <Footer />
      </FormProvider>
    </Screen>
  );
};
