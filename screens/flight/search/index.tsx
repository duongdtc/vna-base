import { images } from '@assets/image';
import {
  Button,
  Image,
  LinearGradient,
  NormalHeader,
  Screen,
  hideLoading,
  showLoading,
} from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { bs, createStyleSheet, useStyles } from '@theme';
import { delay, resetSearchFlight, scale } from '@vna-base/utils';
import {
  useInterpolateColor,
  useSharedTransition,
} from '@vna-base/utils/animated';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { UnistylesRuntime } from 'react-native-unistyles';
import { SearchForm } from '../components';
import { APP_SCREEN } from '@utils';

export const SearchFlight = () => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const sharedValueScrollView = useSharedTransition(0, { duration: 0 });

  useEffect(() => {
    return () => {
      resetSearchFlight();
    };
  }, []);

  const bgHeader = useInterpolateColor(
    sharedValueScrollView,
    [0, 0, 60],
    ['#00000000', '#00000000', colors.neutral10],
  );

  const bgHeaderStyles = useAnimatedStyle(
    () => ({
      backgroundColor: bgHeader.value,
    }),
    [],
  );

  const cbSubmit = async (byMonth?: boolean) => {
    showLoading();
    await delay(100);
    navigate(
      byMonth
        ? APP_SCREEN.RESULT_SEARCH_FLIGHT_BY_MONTH
        : APP_SCREEN.RESULT_SEARCH_FLIGHT,
    );
    hideLoading();
  };

  // render
  return (
    <Screen
      bottomInsetColor="transparent"
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <View style={styles.bgLinearContainer}>
        <LinearGradient type="gra1" style={styles.bgLinearAbove} />
        <Animated.View style={[styles.bgLinearBelow, bgHeaderStyles]}>
          <LinearGradient type="transparent" style={styles.bgLinearBelow} />
        </Animated.View>
      </View>
      <NormalHeader
        leftContent={
          <Image source={images.logo} style={styles.logo} resizeMode="cover" />
        }
        rightContent={
          <Button
            leftIcon="menu_2_outline"
            leftIconSize={24}
            padding={4}
            onPress={() => {
              navigate(APP_SCREEN.MENU);
            }}
            textColorTheme="white"
          />
        }
      />
      <View style={bs.flex}>
        <SearchForm
          sharedValue={sharedValueScrollView}
          callbackSubmit={cbSubmit}
        />
      </View>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    backgroundColor: colors.neutral10,
  },
  logo: {
    width: scale(212),
    height: scale(28),
  },
  bgLinearContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(56 + 132) + UnistylesRuntime.insets.top,
  },
  bgLinearAbove: { flex: 1 },
  bgLinearBelow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scale(132),
  },
}));
