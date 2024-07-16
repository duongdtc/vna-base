import { Screen } from '@vna-base/components';
import React from 'react';
import {
  EmployeeTurnover,
  Header,
  Profit,
  Revenue,
  SalesReport,
} from './components';
import { useStyles } from './styles';
import { ScrollView } from 'react-native';

export const Report = () => {
  const styles = useStyles();

  return (
    <Screen
      unsafe
      backgroundColor={styles.container.backgroundColor}
      statusBarStyle="light-content">
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SalesReport />
        <Revenue />
        <Profit />
        <EmployeeTurnover />
      </ScrollView>
    </Screen>
  );
};
