import { images } from '@assets/image';
import { navigate } from '@navigation/navigation-service';
import { LinearBg } from '@screens/flight/search/components';
import { bs, createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import {
  Button,
  Image,
  NormalHeader,
  Screen,
  hideLoading,
  showLoading,
} from '@vna-base/components';
import { delay, resetSearchFlight, scale } from '@vna-base/utils';
import { useSharedTransition } from '@vna-base/utils/animated';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SearchForm } from '../components';

export const SearchFlight = () => {
  const { styles } = useStyles(styleSheet);

  const sharedValueScrollView = useSharedTransition(0, { duration: 0 });

  useEffect(() => {
    return () => {
      resetSearchFlight();
    };
  }, []);

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
      <LinearBg sharedValueScrollView={sharedValueScrollView} />
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
}));
