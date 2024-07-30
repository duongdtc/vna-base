import {
  Block,
  Button,
  EmptyList,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectFareRule } from '@vna-base/redux/selector';
import { flightResultActions } from '@vna-base/redux/action-slice';
import { FareRule as FareRuleType } from '@services/axios/axios-ibe';
import { useTheme } from '@theme';
import { APP_SCREEN, RootStackParamList } from '@utils';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect } from 'react';
import { FlatList, ListRenderItem, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { StageItem } from './components';

export const FareRule = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.FareRuleGet>) => {
  const { dark } = useTheme();
  const { bottom } = useSafeAreaInsets();

  const fareRule = useSelector(selectFareRule);

  useEffect(() => {
    dispatch(flightResultActions.getFareRule(route.params));

    return () => {
      dispatch(flightResultActions.saveFareRule(null));
    };
  }, [route.params]);

  const renderItem = useCallback<ListRenderItem<FareRuleType>>(
    ({ item }) => (
      <StageItem
        data={item}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        type={fareRule!.type}
        startPoint={route.params.StartPoint}
        endPoint={route.params.EndPoint}
      />
    ),
    [fareRule, route.params.EndPoint, route.params.StartPoint],
  );

  return (
    <Screen unsafe>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <NormalHeader
        shadow=".3"
        colorTheme="neutral10"
        leftContent={
          <Button
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={32}
            padding={0}
            onPress={() => {
              goBack();
            }}
          />
        }
        centerContent={
          <Text
            t18n="flight:ticket_fare_rule"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1} colorTheme="neutral50">
        {fareRule && (
          <FlatList
            contentContainerStyle={{ paddingBottom: bottom }}
            data={fareRule.list}
            renderItem={renderItem}
            ListEmptyComponent={
              <EmptyList
                height={500}
                image="emptyListFareRule"
                t18nTitle="flight:no_fare_rule"
                imageStyle={{ width: 182, height: 120 }}
              />
            }
          />
        )}
      </Block>
    </Screen>
  );
};
