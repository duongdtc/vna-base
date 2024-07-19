import { images } from '@assets/image';
import { navigate } from '@navigation/navigation-service';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import {
  Block,
  Button,
  Icon,
  Image,
  NormalHeaderGradient,
  Screen,
  Text,
} from '@vna-base/components';
import { scale } from '@vna-base/utils';
import React from 'react';
import { ScrollView } from 'react-native';
import { EmployeeTurnover, Profit, Revenue, SalesReport } from './components';
import dayjs from 'dayjs';

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
      <Block
        paddingVertical={8}
        paddingHorizontal={12}
        borderBottomWidth={10}
        borderColorTheme="neutral50"
        flexDirection="row"
        colorTheme="neutral100"
        alignItems="center"
        justifyContent="space-between">
        <Block flexDirection="row" alignItems="center" columnGap={8}>
          <Block padding={2}>
            <Icon icon="calendar_fill" size={24} colorTheme="neutral80" />
          </Block>
          <Text
            text={`${dayjs()
              .subtract(7, 'day')
              .format('DD/MM/YYYY')} - ${dayjs().format('DD/MM/YYYY')}`}
            fontStyle="Body14Reg"
            colorTheme="neutral80"
          />
        </Block>
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={8}
          borderLeftWidth={10}
          borderColorTheme="neutral50"
          paddingLeft={8}>
          <Text
            text="Tất cả đại lý"
            fontStyle="Body14Reg"
            colorTheme="neutral80"
          />
          <Icon icon="arrow_ios_down_fill" size={24} colorTheme="neutral700" />
        </Block>
      </Block>
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
