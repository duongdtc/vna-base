import { images } from '@assets/image';
import { goBack, popWithStep } from '@navigation/navigation-service';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import {
  CameraRoll,
  iosReadGalleryPermission,
} from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { currentAccountActions } from '@redux-slice';
import { bankAccountsOfParent } from '@screens/topup/type';
import { TypeIdMessage } from '@services/mqtt/constants';
import { removeFunOnMessage } from '@services/mqtt/provider';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  Block,
  Button,
  Image,
  LinearGradient,
  NormalHeader,
  Screen,
  Separator,
  showToast,
  Text,
} from '@vna-base/components';
import { translate } from '@vna-base/translations/translate';
import {
  convertStringToNumber,
  CurrencyDetails,
  dispatch,
  HitSlop,
  scale,
} from '@vna-base/utils';
import React, { useEffect } from 'react';
import { Platform, ScrollView } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Line, Svg } from 'react-native-svg';
import { UnistylesRuntime } from 'react-native-unistyles';

export const Pay = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.PAY>) => {
  const { amount, bankId } = route.params.data;
  const bankDetail = bankAccountsOfParent[bankId];

  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  //   const path = images.banking_qrcode;
  const randomCode = Math.random().toString().substring(2, 12);

  const copy = (val: string) => {
    Clipboard.setString(val);

    showToast({
      type: 'success',
      t18n: 'common:saved_to_clipboard',
    });
  };

  const saveQR = async () => {
    try {
      if (Platform.OS === 'ios') {
        await iosReadGalleryPermission('readWrite');
      }

      CameraRoll.saveAsset(
        'file://src/assets/image/source/banking_qrcode.png',
        { type: 'photo' },
      );
      showToast({ type: 'success', t18n: 'pay:saved_qr_success' });
    } catch (error) {
      // console.log('🚀 ~ saveQR ~ error:', error);
      showToast({ type: 'error', t18n: 'pay:saved_qr_failed' });
    }
  };

  const onCreateTriggerNotification = async () => {
    await notifee.requestPermission({
      criticalAlert: true,
    });

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 5000,
    };

    await notifee.createTriggerNotification(
      {
        title: 'Nạp tiền thành công',
        body: `Bạn vừa nạp ${convertStringToNumber(
          amount,
        ).currencyFormat()} vào tài khoản xuất vé`,

        ios: {
          critical: true,
          sound: 'default',
          criticalVolume: 1.0,
        },
      },
      trigger,
    );
  };

  const done = () => {
    popWithStep(2);
  };

  useEffect(() => {
    onCreateTriggerNotification();

    const timeId = setTimeout(() => {
      dispatch(currentAccountActions.addBalance(convertStringToNumber(amount)));
      done();
    }, 5500);

    return () => {
      clearTimeout(timeId);
      ReactNativeBlobUtil.fs.unlink(
        'file://src/assets/image/source/banking_qrcode.png',
      );
    };
  }, []);

  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral10"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        shadow=".3"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_fill"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();

              removeFunOnMessage([
                TypeIdMessage.QRFailed,
                TypeIdMessage.TopupFailed,
                TypeIdMessage.TopupProcessing,
                TypeIdMessage.TopupSuccess,
              ]);
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            t18n="pay:pay"
            colorTheme="neutral900"
          />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.body}
        contentContainerStyle={styles.contentContainer}>
        <Block rowGap={8}>
          <Text
            t18n="pay:transaction_steps"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
          <Block
            colorTheme="neutral100"
            borderRadius={8}
            padding={12}
            rowGap={2}>
            <Block flexDirection="row" columnGap={8}>
              <LinearGradient type="gra1" style={styles.stepContainer}>
                <Text text="1" fontStyle="Title16Bold" colorTheme="neutral10" />
              </LinearGradient>
              <Block flex={1} justifyContent="center">
                <Text
                  t18n="pay:step_1"
                  fontStyle="Body12Med"
                  colorTheme="neutral100"
                />
              </Block>
            </Block>
            <Block height={12} width={34} alignItems="center">
              <Svg height={12} width={2}>
                <Line
                  key={Math.random()}
                  x1={0.5}
                  y1={0}
                  x2={0.5}
                  y2={12}
                  stroke={colors.neutral200}
                  strokeDasharray="2, 1"
                  strokeWidth={1}
                />
              </Svg>
            </Block>
            <Block flexDirection="row" columnGap={8}>
              <LinearGradient type="gra1" style={styles.stepContainer}>
                <Text text="2" fontStyle="Title16Bold" colorTheme="neutral10" />
              </LinearGradient>
              <Block flex={1} justifyContent="center">
                <Text
                  t18n="pay:step_2"
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
                />
              </Block>
            </Block>
          </Block>
        </Block>

        <Block rowGap={8}>
          <Text
            t18n="pay:transfer_information"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
          <Block colorTheme="neutral100" borderRadius={8}>
            <Block
              flexDirection="row"
              columnGap={12}
              paddingHorizontal={12}
              paddingVertical={20}>
              <Block flex={1}>
                <Text
                  fontStyle="Body14Semi"
                  colorTheme="neutral900"
                  text={bankDetail.t18n ?? ''}
                />
              </Block>
              <Image
                source={bankDetail.logo ?? ''}
                containerStyle={styles.logoBank}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              flexDirection="row"
              columnGap={4}
              paddingHorizontal={12}
              paddingVertical={20}>
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral800"
                t18n="pay:account_name"
              />
              <Block flex={1} alignItems="flex-end">
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  fontStyle="Body14Semi"
                  colorTheme="neutral900"
                  text="Vietnam Airline"
                />
              </Block>
            </Block>
            <Separator type="horizontal" />
            <Block
              flexDirection="row"
              columnGap={4}
              alignItems="center"
              paddingHorizontal={12}
              paddingVertical={20}>
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral800"
                t18n="pay:account_number"
              />
              <Block flex={1} alignItems="flex-end">
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  fontStyle="Body14Semi"
                  colorTheme="neutral900"
                  text={`STK${randomCode}`}
                />
              </Block>
              <Button
                hitSlop={HitSlop.Large}
                leftIcon="fi_sr_copy_alt"
                leftIconSize={16}
                padding={0}
                textColorTheme="neutral300"
                onPress={() => {
                  copy(`STK${randomCode}`);
                }}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              flexDirection="row"
              columnGap={4}
              alignItems="center"
              paddingHorizontal={12}
              paddingVertical={20}>
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral800"
                t18n="pay:amount"
              />
              <Block flex={1} alignItems="flex-end">
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  fontStyle="Body14Semi"
                  colorTheme="price">
                  {amount}{' '}
                  <Text
                    fontStyle="Body14Semi"
                    colorTheme="neutral900"
                    text={CurrencyDetails.VND.symbol}
                  />
                </Text>
              </Block>
              <Button
                hitSlop={HitSlop.Large}
                leftIcon="fi_sr_copy_alt"
                leftIconSize={16}
                padding={0}
                onPress={() => {
                  copy(amount);
                }}
                textColorTheme="neutral300"
              />
            </Block>
            <Separator type="horizontal" />

            <Block
              flexDirection="row"
              columnGap={4}
              alignItems="center"
              paddingHorizontal={12}
              paddingVertical={20}>
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral800"
                t18n="pay:topup"
              />
              <Block flex={1} alignItems="flex-end">
                <Text
                  fontStyle="Body14Semi"
                  colorTheme="neutral900"
                  text={`${translate('pay:topup')
                    .removeAccent()
                    .toUpperCase()} ${randomCode}`}
                />
              </Block>
              <Button
                hitSlop={HitSlop.Large}
                leftIcon="fi_sr_copy_alt"
                leftIconSize={16}
                padding={0}
                onPress={() => {
                  copy(`${translate('pay:topup').toUpperCase()} ${randomCode}`);
                }}
                textColorTheme="neutral300"
              />
            </Block>
            <Separator type="horizontal" />

            <Block padding={12} rowGap={12} alignItems="center">
              <Image
                source={images.banking_qrcode}
                containerStyle={styles.qr}
                resizeMode="cover"
              />
              <Button
                fullWidth
                buttonColorTheme="primary50"
                t18n="pay:save_QR"
                size="medium"
                rightIcon="download_fill"
                rightIconSize={24}
                textColorTheme="primary600"
                onPress={saveQR}
              />
            </Block>
          </Block>
        </Block>
        <Block padding={12} borderRadius={8} colorTheme="warning50">
          <Block flexDirection="row" alignItems="flex-start">
            <Block
              margin={6}
              width={4}
              height={4}
              borderRadius={2}
              colorTheme="neutral900"
            />
            <Block flex={1}>
              <Text>
                {translate('pay:deposits_may_be_interrupted_if')}
                <Text
                  t18n="pay:money_transfer_content"
                  fontStyle="Body12Bold"
                  colorTheme="error500"
                />
                {translate('pay:and')}
                <Text
                  t18n="pay:amount"
                  fontStyle="Body12Bold"
                  colorTheme="error500"
                />
                {translate('pay:incorrect')}
              </Text>
            </Block>
          </Block>
          <Block flexDirection="row" alignItems="flex-start">
            <Block
              margin={6}
              width={4}
              height={4}
              borderRadius={2}
              colorTheme="neutral900"
            />
            <Block flex={1}>
              <Text
                t18n="pay:each_transaction_code_can_only_be_used_once"
                fontStyle="Body12Reg"
                colorTheme="neutral900"
              />
            </Block>
          </Block>
        </Block>
      </ScrollView>
      <Block style={styles.footer}>
        <Button
          fullWidth
          t18n="modal_confirm:close"
          buttonColorTheme="neutral30"
          textColorTheme="neutral900"
          onPress={done}
        />
      </Block>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, shadows }) => ({
  container: { backgroundColor: colors.neutral10 },
  contentContainer: {
    padding: scale(12),
    rowGap: scale(12),
  },
  body: {
    backgroundColor: colors.neutral30,
  },
  footer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    backgroundColor: colors.neutral10,
    paddingBottom: scale(12) + UnistylesRuntime.insets.bottom,
    ...shadows.main,
  },
  stepContainer: {
    padding: scale(8),
    width: scale(34),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  logoBank: {
    width: scale(28),
    height: scale(28),
  },
  qr: {
    width: scale(190),
    height: scale(210),
  },
}));
