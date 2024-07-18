import { LinearGradient, Screen } from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectIsCryptic } from '@vna-base/redux/selector';
import { flightResultActions } from '@vna-base/redux/action-slice';
import { bs, createStyleSheet, useStyles } from '@theme';
import { clearSearchFlightResult, dispatch, scale } from '@vna-base/utils';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';
import {
  DateHeaderSearchFlight,
  FilterProvider,
  Header,
  ListFlight,
  TabHeaderFlightRoute,
} from './components';
import { APP_SCREEN, RootStackParamList } from '@utils';
import { Footer } from '@screens/flight/results/components/footer';

export const ResultSearchFlight = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.RESULT_SEARCH_FLIGHT
>) => {
  const { styles } = useStyles(styleSheet);
  const isCryptic = useSelector(selectIsCryptic);

  useEffect(() => {
    AvoidSoftInput.setAdjustNothing();

    dispatch(
      flightResultActions.changeDisableCustomFeeTotal(
        !!route.params?.disableCustomFee,
      ),
    );

    return () => {
      AvoidSoftInput.setAdjustPan();
      clearSearchFlightResult(true);
    };
  }, []);

  // render
  return (
    <Screen style={styles.container} statusBarStyle="light-content">
      <View style={styles.bgLinearContainer}>
        <LinearGradient type="gra1" style={bs.flex} />
      </View>
      <FilterProvider routeParams={route.params}>
        <Header />
        {isCryptic ? (
          <TabHeaderFlightRoute>
            <ListFlight />
          </TabHeaderFlightRoute>
        ) : (
          <View style={bs.flex}>
            <DateHeaderSearchFlight />
            <ListFlight />
          </View>
        )}
        <Footer />
      </FilterProvider>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    backgroundColor: colors.neutral10,
  },
  bgLinearContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(160) + UnistylesRuntime.insets.top,
  },
}));
