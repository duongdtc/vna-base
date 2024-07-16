import { Block, Text } from '@vna-base/components';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from './styles';
import { EmployeeItemProps } from '@vna-base/screens/report/type';

export const EmployeeItem = ({
  employeeFullName,
  revenue,
  maxRevenue,
}: EmployeeItemProps) => {
  const styles = useStyles();
  const sharedValue = useSharedValue(0);

  useEffect(() => {
    sharedValue.value = withTiming(Math.floor((revenue * 100) / maxRevenue), {
      duration: 140,
    });
  }, [maxRevenue, revenue, sharedValue]);

  const animatedFilterBarStyle = useAnimatedStyle(() => ({
    width: `${sharedValue.value}%`,
  }));

  return (
    <Block rowGap={6}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Text
          text={employeeFullName}
          fontStyle="Body14Reg"
          colorTheme="neutral900"
        />
        <Text fontStyle="Body12Med" colorTheme="primary500">
          {revenue.currencyFormat()}{' '}
          <Text text="VND" fontStyle="Body12Med" colorTheme="neutral800" />
        </Text>
      </Block>
      <Block
        height={8}
        borderRadius={2}
        overflow="hidden"
        colorTheme="neutral200">
        <Animated.View style={[styles.filterBar, animatedFilterBarStyle]} />
      </Block>
    </Block>
  );
};
