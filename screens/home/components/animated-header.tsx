import { Avatar, Button, Icon } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectCurrentAccount } from '@redux-selector';
import { createStyleSheet, useStyles, bs } from '@theme';
import { HitSlop, scale } from '@vna-base/utils';
import { useInterpolateColor } from '@vna-base/utils/animated';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';

export const AnimatedHeader = ({
  sharedValue,
}: {
  sharedValue: SharedValue<number>;
}) => {
  const { top } = useSafeAreaInsets();
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const [t] = useTranslation();

  const currentAccount = useSelector(selectCurrentAccount);

  const opacity = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 72], [0, 0.5], Extrapolate.CLAMP),
  );

  const opacityBtn = useDerivedValue(() =>
    interpolate(sharedValue.value, [0, 72], [1, 0], Extrapolate.CLAMP),
  );

  const topStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const btnStyles = useAnimatedStyle(() => ({
    opacity: opacityBtn.value,
  }));

  const color = useInterpolateColor(
    sharedValue,
    [0, 0, 72],
    [colors.neutral10, colors.neutral10, colors.neutral100],
  );

  const txtStyles = useAnimatedStyle(() => ({
    color: color.value,
  }));

  const navToUserAccount = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, { id: currentAccount.Id! });
  };

  return (
    <View>
      <Animated.View style={[styles.statusBar, { height: top }, topStyles]} />
      <View style={styles.container}>
        <Avatar
          source={currentAccount.Photo}
          size={36}
          onPress={navToUserAccount}
        />
        <View style={styles.nameAndAvatarContainer}>
          <Animated.Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.fullName, txtStyles]}>
            {currentAccount.FullName as string}
          </Animated.Text>
          <View style={styles.positionContainer}>
            <Animated.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.accountTxt, txtStyles]}>
              {`${t('home:account')} `}
            </Animated.Text>
            <Animated.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.position, txtStyles]}>
              {`${currentAccount.UserGroup?.Code}-${currentAccount.UserGroup?.Name}`}
            </Animated.Text>
          </View>
        </View>
        <View>
          <View style={[bs.padding_4]}>
            <Icon icon="notification_fill" colorTheme="neutral100" size={24} />
            <View style={styles.dotNotiContainer}>
              <View style={styles.dotNoti} />
            </View>
          </View>
          <Animated.View style={[styles.btn, btnStyles]}>
            <Button
              hitSlop={{ ...HitSlop.MediumInset, right: 4 }}
              leftIcon="notification_fill"
              leftIconSize={24}
              textColorTheme="neutral10"
              onPress={() => {}}
              padding={4}
            />
            <View style={styles.dotNotiContainer}>
              <View style={styles.dotNoti} />
            </View>
          </Animated.View>
        </View>
        <View>
          <View style={[bs.padding_4]}>
            <Icon icon="menu_2_outline" colorTheme="neutral100" size={24} />
          </View>
          <Animated.View style={[styles.btn, btnStyles]}>
            <Button
              hitSlop={{ ...HitSlop.MediumInset, left: 4 }}
              leftIcon="menu_2_outline"
              leftIconSize={24}
              textColorTheme="neutral10"
              onPress={() => {
                navigate(APP_SCREEN.MENU);
              }}
              padding={4}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors, textPresets, spacings }) => ({
  container: {
    zIndex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacings[8],
    paddingRight: spacings[12],
    paddingLeft: spacings[16],
    columnGap: spacings[8],
  },
  statusBar: { width: '100%', backgroundColor: colors.neutral40 },
  nameAndAvatarContainer: {
    rowGap: spacings[2],
    flex: 1,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
  btn: { position: 'absolute' },
  fullName: textPresets.H320Semi,
  accountTxt: textPresets.Body10Reg,
  position: textPresets.Body10Bold,
  dotNotiContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    top: spacings[6],
    right: spacings[6],
    width: scale(7),
    height: scale(7),
    borderRadius: spacings[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotNoti: {
    backgroundColor: colors.errorColor,
    width: scale(5),
    height: scale(5),
    borderRadius: scale(3),
  },
}));
