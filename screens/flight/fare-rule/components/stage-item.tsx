/* eslint-disable react-native/no-unused-styles */
import { Block, Icon, Text } from '@vna-base/components';
import { StageFareItemProps } from '@vna-base/screens/flight/type';
import { RuleGroup } from '@services/axios/axios-ibe';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, HairlineWidth, scale } from '@vna-base/utils';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CustomItem } from './custom-item';
import { TerminalItem } from './terminal-item';

export const StageItem = ({
  data,
  type,
  startPoint,
  endPoint,
}: StageFareItemProps) => {
  const styles = useStyles();
  const sharedValue = useSharedValue(0);
  const [isClose, setIsClose] = useState(false);

  const onPress = () => {
    sharedValue.value = withTiming(isClose ? 0 : 180, {
      duration: 200,
    });
    setIsClose(temp => !temp);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 240,
    });
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${sharedValue.value}deg` }],
  }));

  const renderItem = useCallback<ListRenderItem<RuleGroup>>(
    ({ item, index }) => {
      return <TerminalItem data={item} index={index} />;
    },
    [],
  );

  return (
    <Block marginTop={12} colorTheme="neutral100">
      <TouchableOpacity
        onPress={onPress}
        style={styles.titleContainer}
        activeOpacity={ActiveOpacity}>
        <Text
          text={translate('flight:stage_2_params', {
            start_point: data.StartPoint ?? startPoint,
            end_point: data.EndPoint ?? endPoint,
          })}
          fontStyle="Title16Semi"
          colorTheme="neutral900"
        />
        <Animated.View style={iconStyle}>
          <Icon
            icon={'arrow_ios_up_outline'}
            colorTheme="neutral900"
            size={24}
          />
        </Animated.View>
      </TouchableOpacity>
      <Block height={isClose ? 0 : 'auto'} overflow="hidden">
        {type === 'Custom' ? (
          <CustomItem data={data.ListRuleGroup?.[0] as RuleGroup} />
        ) : (
          <FlatList
            scrollEnabled={false}
            data={data.ListRuleGroup}
            keyExtractor={(item, index) => (item.RuleTitle ?? '') + index}
            ItemSeparatorComponent={() => <Block height={8} />}
            renderItem={renderItem}
            style={styles.contentContainerStyle}
          />
        )}
      </Block>
    </Block>
  );
};

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        titleContainer: {
          paddingLeft: scale(16),
          paddingRight: scale(12),
          paddingVertical: scale(8),
          flexDirection: 'row',
          backgroundColor: colors.neutral100,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: colors.neutral50,
          borderBottomWidth: HairlineWidth * 3,
        },
        contentContainerStyle: {
          padding: scale(12),
        },
      }),
    [colors.neutral100, colors.neutral50],
  );
};
