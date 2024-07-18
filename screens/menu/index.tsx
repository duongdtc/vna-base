import { Screen } from '@vna-base/components';
import React from 'react';
import { createStyleSheet, useStyles } from '@theme';
import { Header } from './components/header';
import { Body } from '@screens/menu/components/body';

export const Menu = () => {
  const { styles } = useStyles(styleSheet);
  return (
    <Screen unsafe={false} backgroundColor={styles.container.backgroundColor}>
      <Header />
      <Body />
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: { backgroundColor: colors.neutral10 },
}));
