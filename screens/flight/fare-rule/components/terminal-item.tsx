/* eslint-disable react-native/no-unused-styles */
import { Block, Icon, Text } from '@vna-base/components';
import { FareItemProps } from '@vna-base/screens/flight/type';
import { useTheme } from '@theme';
import { ActiveOpacity, HitSlop } from '@vna-base/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const TerminalItem = ({ data, index }: FareItemProps) => {
  const styles = useStyles();
  const sharedValue = useSharedValue(0);
  const { colors } = useTheme();
  const [isClose, setIsClose] = useState(true);

  const onPress = useCallback(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 240,
    });
    setIsClose(temp => !temp);
    sharedValue.value = withTiming(isClose ? 180 : 0, {
      duration: 200,
    });
  }, [isClose, sharedValue]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${sharedValue.value}deg` }],
  }));

  return (
    <Block borderWidth={10} borderColorTheme="neutral200" borderRadius={8}>
      <TouchableOpacity
        hitSlop={HitSlop.Small}
        onPress={onPress}
        style={[
          styles.titleContainer,
          !isClose && { backgroundColor: colors.secondary50 },
        ]}
        activeOpacity={ActiveOpacity}>
        <Text
          text={`${index}. ${data.RuleTitle}`}
          fontStyle="Body12Med"
          colorTheme="neutral800"
        />
        <Animated.View style={iconStyle}>
          <Icon
            icon={isClose ? 'plus_outline' : 'minus_outline'}
            colorTheme="neutral900"
            size={16}
          />
        </Animated.View>
      </TouchableOpacity>
      <Block
        height={isClose ? 0 : undefined}
        overflow="hidden"
        borderBottomRadius={8}>
        <Block padding={12} colorTheme="neutral100">
          <Text
            text={data.ListRuleText?.reduce(
              (total, curr, currIndex) =>
                total + (currIndex !== 0 ? '\n' : '') + curr,
              '',
            )}
            style={styles.content}
          />
        </Block>
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.neutral100,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
        },
        content: {
          fontSize: 12,
          fontWeight: '400',
          color: colors.neutral900,
          letterSpacing: -0.1,
          fontFamily: 'Roboto Mono',
        },
      }),
    [colors.neutral100, colors.neutral900],
  );
};
