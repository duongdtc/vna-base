/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { goBack } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TypeIdMessage } from '@services/mqtt/constants';
import { removeFunOnMessage } from '@services/mqtt/provider';
import { TopupRealm } from '@services/realm/models';
import { useObject } from '@services/realm/provider';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  Block,
  Button,
  Icon,
  Image,
  NormalHeader,
  Screen,
  showToast,
  Text,
} from '@vna-base/components';
import { topupActions } from '@vna-base/redux/action-slice';
import { TransactionStatus } from '@vna-base/screens/pay/hooks/use-handle-topup-mqtt';
import {
  CurrencyDetails,
  dispatch,
  HitSlop,
  scale,
  TopupMethod,
  TopupMethodDetails,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { RealmObject } from 'realm/dist/public-types/Object';
import { useStyles } from './style';

export const TopupDetail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.TOPUP_DETAIL>) => {
  const styles = useStyles();
  const { id, realtime } = route.params;

  const topupDetail =
    useObject<TopupRealm>(TopupRealm.schema.name, id) ??
    ({} as RealmObject<TopupRealm, never> & TopupRealm);

  const isPositive = (topupDetail.Amount ?? 0) > 0;

  const status = useMemo(() => {
    switch (true) {
      case realtime:
        return realtimeStatus!;

      case topupDetail.Approved === true:
        return TransactionStatus.SUCCESS;

      case topupDetail.Approved === false:
        return TransactionStatus.FAILED;

      default:
        return TransactionStatus.PROCESSING;
    }
  }, [realtime, realtimeStatus, topupDetail.Approved]);

  const calStatusView = useMemo(() => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return (
          <Block
            padding={12}
            colorTheme="success50"
            borderRadius={8}
            flexDirection="row"
            alignItems="center"
            columnGap={8}>
            <Block
              padding={4}
              borderRadius={16}
              colorTheme="success500"
              margin={2}>
              <Icon icon="checkmark_fill" size={14} colorTheme="classicWhite" />
            </Block>
            <Block flex={1}>
              <Text
                t18n="transaction_detail:success"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
              />
            </Block>
          </Block>
        );

      case TransactionStatus.FAILED:
        return (
          <Block
            padding={12}
            colorTheme="error50"
            borderRadius={8}
            flexDirection="row"
            alignItems="center"
            columnGap={8}>
            <Block
              padding={4}
              borderRadius={16}
              colorTheme="error500"
              margin={2}>
              <Icon icon="close_fill" size={14} colorTheme="classicWhite" />
            </Block>
            <Block flex={1}>
              <Text
                t18n="transaction_detail:failed"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
              />
            </Block>
          </Block>
        );

      default:
        return (
          <Block rowGap={2}>
            <Block flexDirection="row" alignItems="center" columnGap={8}>
              <Block
                padding={4}
                borderRadius={16}
                colorTheme="success500"
                margin={2}>
                <Icon
                  icon="checkmark_fill"
                  size={14}
                  colorTheme="classicWhite"
                />
              </Block>
              <Block flex={1}>
                <Text
                  t18n="transaction_detail:confirm"
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
                />
              </Block>
              <Text
                t18n="common:success"
                fontStyle="Body12Med"
                colorTheme="success500"
              />
            </Block>
            <Block
              height={16}
              width={1}
              colorTheme="success500"
              marginLeft={12}
            />

            <Block flexDirection="row" alignItems="center" columnGap={8}>
              <Block padding={2}>
                <Animated.View style={animatedStyle}>
                  <Image
                    source={images.loading}
                    containerStyle={{ width: scale(20), height: scale(20) }}
                  />
                </Animated.View>
              </Block>
              <Block flex={1}>
                <Text
                  t18n="transaction_detail:processing"
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
                />
              </Block>
              <Text
                t18n="common:processing"
                fontStyle="Body12Med"
                colorTheme="warning500"
              />
            </Block>
          </Block>
        );
    }
  }, [animatedStyle, status]);

  const amount = useMemo(
    () =>
      status === TransactionStatus.PROCESSING
        ? topupDetail.RequestAmount
        : topupDetail.Amount,
    [status, topupDetail.Amount, topupDetail.RequestAmount],
  );

  useEffect(() => {
    if (realtime) {
      dispatch(topupActions.getTopupDetailByIdAndParentId(id));
    }
  }, []);

  return (
    <Screen backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
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
            t18n="transaction_detail:transaction_detail"
            colorTheme="neutral900"
          />
        }
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Block colorTheme="neutral100" borderRadius={8} shadow="small">
          <Block
            paddingHorizontal={12}
            paddingBottom={12}
            paddingTop={16}
            rowGap={16}>
            <Block flexDirection="row" columnGap={12} alignItems="center">
              <Icon
                icon={isPositive ? 'log_in_fill' : 'log_out_fill'}
                size={42}
                colorTheme={isPositive ? 'success500' : 'error500'}
              />
              <Block rowGap={4} flex={1}>
                <Text
                  text={(
                    allTypes[topupDetail.EntryType!]?.ViewVi ?? ''
                  ).toUpperCase()}
                  fontStyle="Body14Semi"
                  colorTheme="neutral900"
                />
                <Text
                  fontStyle="Title20Semi"
                  colorTheme={isPositive ? 'success500' : 'error500'}>
                  {`${isPositive ? '+' : ''}${(amount ?? 0).currencyFormat()} `}
                  <Text
                    text={CurrencyDetails.VND.symbol}
                    fontStyle="Title20Semi"
                    colorTheme="neutral900"
                  />
                </Text>
              </Block>
            </Block>
            {calStatusView}
          </Block>
          {status === TransactionStatus.FAILED && (
            <Pressable onPress={() => {}} hitSlop={HitSlop.Large}>
              <Block
                borderTopWidth={10}
                borderColorTheme="neutral50"
                padding={12}
                justifyContent="center"
                alignItems="center">
                <Text
                  t18n="transaction_detail:contact"
                  fontStyle="Body14Semi"
                  colorTheme="primary600"
                />
              </Block>
            </Pressable>
          )}
        </Block>

        <Block rowGap={8}>
          <Text
            t18n="transaction_detail:transaction_info"
            colorTheme="neutral900"
            fontStyle="Title20Semi"
          />
          <Block borderRadius={8} rowGap={1} overflow="hidden">
            <Pressable
              onPress={() => {
                Clipboard.setString(topupDetail.RefNumb ?? '');
                showToast({
                  type: 'success',
                  t18n: 'sms_send:copied_to_clipboard',
                });
              }}>
              <Block style={styles.infoItemContainer}>
                <Text
                  t18n="transaction_detail:transaction_code"
                  style={styles.infoItemTitle}
                />
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Text
                    text={topupDetail.RefNumb ?? ''}
                    style={styles.infoItemValue}
                  />
                  <Icon
                    icon="fi_sr_copy_alt"
                    size={16}
                    colorTheme="neutral300"
                  />
                </Block>
              </Block>
            </Pressable>
            <Block style={styles.infoItemContainer}>
              <Text
                t18n="transaction_detail:date"
                style={styles.infoItemTitle}
              />
              <Text
                text={dayjs(topupDetail.CreatedDate).format('DD/MM/YYYY HH:mm')}
                style={styles.infoItemValue}
              />
            </Block>
            <Block style={styles.infoItemContainer}>
              <Text
                t18n="transaction_detail:method"
                style={styles.infoItemTitle}
              />
              <Text
                t18n={
                  TopupMethodDetails[topupDetail.PaymentMethod as TopupMethod]
                    ?.t18n
                }
                style={styles.infoItemValue}
              />
            </Block>
            {topupDetail.PaymentMethod === TopupMethod.CASH ? (
              <Block style={styles.infoItemContainer}>
                <Text
                  t18n="transaction_detail:remark"
                  style={styles.infoItemTitle}
                />
                <Text
                  text={topupDetail.Remark ?? ''}
                  style={styles.infoItemValue}
                />
              </Block>
            ) : (
              <>
                <Block style={styles.infoItemContainer}>
                  <Text
                    t18n="transaction_detail:receive_bank"
                    style={styles.infoItemTitle}
                  />
                  <Text
                    text={bank?.BankBrand ?? ''}
                    style={styles.infoItemValue}
                  />
                </Block>
                <Block style={styles.infoItemContainer}>
                  <Text
                    t18n="transaction_detail:account_name"
                    style={styles.infoItemTitle}
                  />
                  <Text
                    text={bank?.AccountName ?? ''}
                    style={styles.infoItemValue}
                  />
                </Block>
                <Block style={styles.infoItemContainer}>
                  <Text
                    t18n="transaction_detail:account_num"
                    style={styles.infoItemTitle}
                  />
                  <Text
                    text={`${bank?.AccountNumb}${topupDetail.RefNumb}`}
                    style={styles.infoItemValue}
                  />
                </Block>
              </>
            )}
          </Block>
        </Block>
      </ScrollView>
    </Screen>
  );
};
