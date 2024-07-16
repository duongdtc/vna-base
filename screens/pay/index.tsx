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
import { goBack, popWithStep } from '@navigation/navigation-service';
import {
  CameraRoll,
  iosRequestReadWriteGalleryPermission,
} from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import { selectAllBankAccountsOfParent, selectQR } from '@redux/selector/bank';
import { TypeIdMessage } from '@services/mqtt/constants';
import { removeFunOnMessage } from '@services/mqtt/provider';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { CurrencyDetails, HitSlop } from '@vna-base/utils';
import React, { useEffect } from 'react';
import { Platform, ScrollView } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Line, Svg } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { useHandleTopupMQTT } from './hooks/use-handle-topup-mqtt';
import { useStyles } from './styles';

export const Pay = () => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { bank, path, amount, randomCode } = useSelector(selectQR);
  const allAccount = useSelector(selectAllBankAccountsOfParent);

  useHandleTopupMQTT();

  const bankDetail = allAccount[bank];

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
        await iosRequestReadWriteGalleryPermission();
      }

      await CameraRoll.saveToCameraRoll(path, 'photo');

      showToast({ type: 'success', t18n: 'pay:saved_qr_success' });
    } catch (error) {
      console.log('🚀 ~ saveQR ~ error:', error);
      showToast({ type: 'error', t18n: 'pay:saved_qr_failed' });
    }
  };

  useEffect(() => {
    return () => {
      ReactNativeBlobUtil.fs.unlink(path);
    };
  }, [path]);

  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
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
              <LinearGradient type="005" style={styles.stepContainer}>
                <Text
                  text="1"
                  fontStyle="Title16Bold"
                  colorTheme="neutral900"
                />
              </LinearGradient>
              <Block flex={1} justifyContent="center">
                <Text
                  t18n="pay:step_1"
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
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
              <LinearGradient type="005" style={styles.stepContainer}>
                <Text
                  text="2"
                  fontStyle="Title16Bold"
                  colorTheme="neutral900"
                />
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
                  text={bankDetail.Description ?? ''}
                />
              </Block>
              <Image
                source={bankDetail?.Image ?? ''}
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
                  text={bankDetail.AccountName ?? ''}
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
                  text={`${bankDetail.AccountNumb}${randomCode}`}
                />
              </Block>
              <Button
                hitSlop={HitSlop.Large}
                leftIcon="fi_sr_copy_alt"
                leftIconSize={16}
                padding={0}
                textColorTheme="neutral300"
                onPress={() => {
                  copy(`${bankDetail.AccountNumb}${randomCode}`);
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
                  {amount.currencyFormat()}{' '}
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
                  copy(amount.toString());
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
                source={{
                  uri: `${Platform.OS === 'ios' ? '' : 'file://'}${path}`,
                }}
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
          buttonColorTheme="neutral50"
          textColorTheme="neutral900"
          onPress={() => {
            popWithStep(2);
          }}
        />
      </Block>
    </Screen>
  );
};
