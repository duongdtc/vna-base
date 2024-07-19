import { images } from '@assets/image';
import { navigate } from '@navigation/navigation-service';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import {
  Button,
  Image,
  NormalHeaderGradient,
  Screen,
} from '@vna-base/components';
import { scale } from '@vna-base/utils';
import React from 'react';
import { ScrollView } from 'react-native';
import { EmployeeTurnover, Profit, Revenue, SalesReport } from './components';

export const Report = () => {
  const { styles } = useStyles(styleSheet);

  return (
    <Screen
      unsafe
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <NormalHeaderGradient
        gradientType="gra1"
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SalesReport />
        <Revenue />
        <Profit />
        <EmployeeTurnover />
      </ScrollView>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    backgroundColor: colors.neutral20,
  },
  logo: {
    width: scale(212),
    height: scale(28),
  },
  contentContainer: {
    rowGap: 8,
    paddingTop: 8,
    backgroundColor: colors.neutral20,
    paddingBottom: scale(36),
  },
}));
