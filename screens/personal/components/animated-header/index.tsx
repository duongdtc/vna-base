import { images } from '@assets/image';
import { Avatar, Block, Button, Icon, Image, Text } from '@vna-base/components';
import { navigate, useDrawer } from '@navigation/navigation-service';
import { selectCurrentAccount } from '@vna-base/redux/selector';
import { useTheme } from '@theme';
import { ActiveOpacity, HitSlop, getState } from '@vna-base/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useStyles } from './style';
import { ColorLight } from '@theme/color';
import { useCASLContext } from '@services/casl';
import { APP_SCREEN } from '@utils';

export const AnimatedHeader = ({
  sharedValue,
}: {
  sharedValue: SharedValue<number>;
}) => {
  const styles = useStyles();
  const { open } = useDrawer();
  const [t] = useTranslation();
  const { colors } = useTheme();

  const { can } = useCASLContext();

  const currentAccount = useSelector(selectCurrentAccount);

  const opacity = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [0, 0.5], Extrapolate.CLAMP),
  );

  const opacityBtn = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [0, 1], Extrapolate.CLAMP),
  );

  const bgcl = useDerivedValue(
    () =>
      interpolateColor(
        sharedValue.value,
        [0, 100],
        ['transparent', colors.neutral100],
      ),
    [colors],
  );

  const bgColor = useAnimatedStyle(() => ({
    backgroundColor: bgcl.value,
  }));

  const topStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const btnStyles = useAnimatedStyle(() => ({
    opacity: opacityBtn.value,
  }));

  const headerOpacity = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [0, 1], Extrapolate.CLAMP),
  );

  const headerOpacityStyles = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const navToPersonalInfoScreen = () => {
    const { Id } = getState('currentAccount').currentAccount;
    navigate(APP_SCREEN.PERSONAL_INFO, { id: Id! });
  };

  const translateYBottomHeader = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [0, 36], Extrapolate.CLAMP),
  );

  const translateYLogo = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [0, -100], Extrapolate.CLAMP),
  );

  const opacityBottomHeader = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [0, 1], Extrapolate.CLAMP),
  );

  const opacityLogo = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 100], [1, 0], Extrapolate.CLAMP),
  );

  const animatedStyleBottomHeader = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYBottomHeader.value }],
    opacity: opacityBottomHeader.value,
  }));

  const animatedStyleLogo = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYLogo.value }],
    opacity: opacityLogo.value,
  }));

  const navToAgentInfoScreen = () => {
    navigate(APP_SCREEN.AGENT_INFO);
  };

  return (
    <>
      <Animated.View style={[bgColor, styles.container]}>
        <Animated.View style={[styles.top, topStyles]} />
        <Animated.View style={[styles.logoContainer, animatedStyleLogo]}>
          <Image
            source={images.logo}
            containerStyle={styles.logo}
            resizeMode="center"
            tintColor={ColorLight.classicWhite}
          />
        </Animated.View>
        <Block
          flexDirection="row"
          paddingHorizontal={12}
          alignItems="center"
          columnGap={8}
          justifyContent="space-between">
          <Block paddingVertical={12}>
            <Block padding={4}>
              <Icon icon="menu_2_outline" colorTheme="classicWhite" size={24} />
            </Block>
            <Animated.View style={[styles.btn, btnStyles]}>
              <Button
                leftIcon="menu_2_outline"
                leftIconSize={24}
                textColorTheme="neutral900"
                onPress={open}
                padding={4}
                hitSlop={HitSlop.Medium}
              />
            </Animated.View>
          </Block>
          <Animated.View style={[headerOpacityStyles, styles.titleContainer]}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={navToPersonalInfoScreen}
              style={styles.infoInHeader}>
              <Avatar source={currentAccount.Photo ?? images.default_avatar} />
              <Block rowGap={4} flex={1}>
                <Block>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    fontStyle="Title20Semi"
                    colorTheme="neutral900"
                    text={currentAccount.FullName as string}
                  />
                </Block>
                <Text fontStyle="Capture11Reg" colorTheme="neutral900">
                  {`${t('home:account')} `}
                  <Text
                    text={currentAccount.Username as string}
                    fontStyle="Capture11Bold"
                    colorTheme="neutral900"
                  />
                </Text>
              </Block>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[headerOpacityStyles]}>
            <Button
              hitSlop={HitSlop.Medium}
              leftIcon="edit_2_fill"
              leftIconSize={24}
              padding={4}
              textColorTheme="neutral900"
              onPress={navToPersonalInfoScreen}
            />
          </Animated.View>
        </Block>
      </Animated.View>

      {can('view', 'agent_info_custom') && (
        <Animated.View style={[styles.bottomHeader, animatedStyleBottomHeader]}>
          <Pressable onPress={navToAgentInfoScreen}>
            <Block
              borderTopWidth={10}
              borderBottomWidth={10}
              paddingVertical={10}
              paddingHorizontal={16}
              borderColorTheme="neutral200"
              colorTheme="neutral100"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Text
                t18n="system:info_agent"
                fontStyle="Body12Med"
                colorTheme="neutral900"
              />
              <Icon
                icon="arrow_ios_right_fill"
                size={16}
                colorTheme="neutral900"
              />
            </Block>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};
