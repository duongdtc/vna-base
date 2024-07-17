/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import {
  selectBalanceInfo,
  selectCurrentAccount,
  selectIsShowBalance,
} from '@vna-base/redux/selector';
import { currentAccountActions } from '@vna-base/redux/action-slice';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  CurrencyDetails,
  dispatch,
  HitSlop,
} from '@vna-base/utils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { styles } from './style';
import { useCASLContext } from '@services/casl';
import { APP_SCREEN } from '@utils';

export const InfoCard = ({
  sharedValue,
}: {
  sharedValue: SharedValue<number>;
}) => {
  const [t] = useTranslation();

  const { can } = useCASLContext();

  const currentAccount = useSelector(selectCurrentAccount);
  const { balance, creditLimit } = useSelector(selectBalanceInfo);
  const isShowBalance = useSelector(selectIsShowBalance);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const navToAgentInfoScreen = () => {
    navigate(APP_SCREEN.AGENT_INFO);
  };

  const navToPersonalInfoScreen = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, { id: currentAccount.Id! });
  };

  const opacityForm = useDerivedValue(() =>
    interpolate(
      sharedValue.value,
      [0, 100, 200],
      [1, 0.5, 0],
      Extrapolate.CLAMP,
    ),
  );

  const animatedForm = useAnimatedStyle(() => ({
    opacity: opacityForm.value,
  }));

  return (
    <Animated.View style={[animatedForm]}>
      <Block borderRadius={12} overflow="hidden">
        <Block
          style={StyleSheet.absoluteFill}
          onLayout={e => {
            setSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}>
          <Image
            source={images.profile_card}
            containerStyle={{ width: size.width, height: size.height }}
            resizeMode="stretch"
          />
        </Block>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={navToPersonalInfoScreen}
          style={styles.topContainer}>
          <Block colorTheme="classicWhite" padding={2} borderRadius={28}>
            <Image
              source={currentAccount.Photo ?? images.default_avatar}
              containerStyle={styles.avatar}
              resizeMode="cover"
            />
          </Block>
          <Block rowGap={4} flex={1}>
            <Block
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                fontStyle="Title20Semi"
                colorTheme="classicWhite"
                text={currentAccount.FullName as string}
              />
              <Icon icon="edit_2_outline" colorTheme="classicWhite" size={20} />
            </Block>
            <Text fontStyle="Capture11Reg" colorTheme="classicWhite">
              {`${t('home:account')} `}
              <Text
                text={`${currentAccount.UserGroup?.Code}-${currentAccount.UserGroup?.Name}`}
                fontStyle="Capture11Bold"
                colorTheme="classicWhite"
              />
            </Text>
          </Block>
        </TouchableOpacity>
        {(can('view', 'agent_info_custom') ||
          can('view', 'balance_custom')) && (
          <>
            {can('view', 'agent_info_custom') && (
              <Block style={styles.agentNameContainer}>
                <Text fontStyle="Body12Reg" colorTheme="classicWhite">
                  {`${translate('system:name_agent').toUpperCase()}  `}
                  <Text
                    text={currentAccount.Agent?.AgentName?.toUpperCase()}
                    fontStyle="Body14Semi"
                    colorTheme="classicWhite"
                  />
                </Text>
              </Block>
            )}

            <Block style={styles.agentInfoContainer}>
              {can('view', 'balance_custom') && (
                <TouchableOpacity
                  activeOpacity={ActiveOpacity}
                  hitSlop={HitSlop.Large}
                  onPress={() => {
                    dispatch(
                      currentAccountActions.saveIsShowBalance(!isShowBalance),
                    );
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 4,
                  }}>
                  <Text
                    fontStyle="Title20Semi"
                    colorTheme="classicWhite"
                    text={
                      isShowBalance
                        ? `${(creditLimit + balance).currencyFormat()} ${
                            CurrencyDetails.VND.symbol
                          }`
                        : '***********'
                    }
                  />
                  <Icon
                    icon={isShowBalance ? 'eye_fill' : 'eye_off_fill'}
                    colorTheme="classicWhite"
                    size={16}
                  />
                </TouchableOpacity>
              )}

              <Block
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Text
                  text={
                    can('view', 'balance_custom')
                      ? `${translate('common:amount_issued').toUpperCase()}`
                      : ''
                  }
                  fontStyle="Body12Reg"
                  colorTheme="classicWhite"
                />
                {can('view', 'agent_info_custom') && (
                  <TouchableOpacity
                    hitSlop={HitSlop.Large}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 4,
                    }}
                    activeOpacity={ActiveOpacity}
                    onPress={navToAgentInfoScreen}>
                    <Text
                      t18n="system:info_agent"
                      fontStyle="Body12Med"
                      colorTheme="classicWhite"
                    />
                    <Icon
                      icon="arrow_ios_right_fill"
                      size={16}
                      colorTheme="classicWhite"
                    />
                  </TouchableOpacity>
                )}
              </Block>
            </Block>
          </>
        )}
      </Block>
    </Animated.View>
  );
};
