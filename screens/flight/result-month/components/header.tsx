import { Button, NormalHeader, Switch, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { flightResultMonthActions } from '@vna-base/redux/action-slice';
import { ActiveOpacity, HitSlop, dispatch } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { selectViewChart } from '@vna-base/redux/selector';

export const Header = memo(() => {
  const styles = useStyles();
  const viewChart = useSelector(selectViewChart);

  const onToggle = async () => {
    dispatch(flightResultMonthActions.changeViewChart());
  };

  return (
    <NormalHeader
      borderBottomWidth={3}
      borderColorTheme="neutral200"
      colorTheme="neutral100"
      leftContent={
        <Button
          hitSlop={HitSlop.Large}
          type="common"
          size="small"
          leftIcon="arrow_ios_left_fill"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={() => {
            goBack();
          }}
        />
      }
      centerContent={
        <Text
          t18n="result_by_month:find_by_month"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
      }
      rightContent={
        <TouchableOpacity
          hitSlop={HitSlop.Large}
          style={styles.rightHeader}
          activeOpacity={ActiveOpacity}
          onPress={onToggle}>
          <Text
            t18n={'result_by_month:chart'}
            colorTheme="neutral900"
            fontStyle="Capture11Reg"
          />
          <Switch value={viewChart} disable opacity={1} />
        </TouchableOpacity>
      }
    />
  );
}, isEqual);
