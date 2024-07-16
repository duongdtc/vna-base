import { LinearGradient, Text } from '@components';
import { ActiveOpacity, scale } from '@utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TitleContainerProps, TitleContainerRef } from './type';
import { createStyleSheet, useStyles } from '@theme';

export const TitleContainer = memo(
  forwardRef<TitleContainerRef, TitleContainerProps>(
    ({ titles, onClick, widthTab }, ref) => {
      const { styles } = useStyles(styleSheet);
      const btnWidth = (widthTab - 4) / titles.length;
      const sharedValue = useSharedValue(0);
      const [i, setI] = useState(0);

      const animatedBtnContainerStyle = useAnimatedStyle(() => ({
        transform: [
          {
            translateX: sharedValue.value,
          },
        ],
      }));

      const changeTab = useCallback(
        (index: number) => {
          sharedValue.value = withTiming(btnWidth * index, {
            duration: 100,
            easing: Easing.linear,
          });
          setI(index);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        },
        [btnWidth, sharedValue],
      );

      const _onPressTab = useCallback(
        (index: number) => {
          changeTab(index);
          onClick(index);
        },
        [changeTab, onClick],
      );

      useImperativeHandle(
        ref,
        () => ({
          changeTab,
        }),
        [changeTab],
      );

      return (
        <View style={styles.container}>
          <View style={styles.subContainer}>
            {titles.map(({ t18n, disable }, index) => (
              <TouchableOpacity
                disabled={disable}
                activeOpacity={ActiveOpacity}
                key={index}
                style={[styles.btn, { opacity: disable ? 0.4 : 1 }]}
                onPress={() => _onPressTab(index)}>
                <Text
                  fontStyle="Body16Bold"
                  colorTheme="neutral70"
                  t18n={t18n}
                />
              </TouchableOpacity>
            ))}
            <Animated.View
              style={[
                { width: btnWidth },
                styles.animatedBtnContainer,
                animatedBtnContainerStyle,
              ]}>
              <LinearGradient style={StyleSheet.absoluteFill} type="gra1" />
              <Text
                fontStyle="Body16Bold"
                colorTheme="neutral10"
                t18n={titles[i].t18n}
              />
            </Animated.View>
          </View>
        </View>
      );
    },
  ),
  isEqual,
);

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    padding: scale(2),
    backgroundColor: colors.neutral10,
    borderColor: colors.neutral30,
    borderRadius: scale(8),
  },
  subContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    paddingVertical: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBtnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(6),
    paddingVertical: scale(12),
    overflow: 'hidden',
  },
}));
