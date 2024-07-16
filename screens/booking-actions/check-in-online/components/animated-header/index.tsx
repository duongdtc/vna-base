import { Block, Button, Icon, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { HitSlop } from '@vna-base/utils';
import React, { RefObject, memo } from 'react';
import isEqual from 'react-fast-compare';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { HEADER_HEIGHT } from '../..';
import { useStyles } from './styles';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

type Props = {
  sharedValue: SharedValue<number>;
  url: string;
  webviewRef: RefObject<WebView<any>>;
};

export const AnimatedHeader = memo(
  ({ sharedValue, url, webviewRef }: Props) => {
    const styles = useStyles();

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: sharedValue.value }],
      height: interpolate(
        sharedValue.value,
        [0.7, 1],
        [HEADER_HEIGHT * 0.7, HEADER_HEIGHT],
      ),
    }));

    const btnAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(sharedValue.value, [0.7, 1], [0, 1]),
      zIndex: interpolate(sharedValue.value, [0.7, 1], [-1, 1]),
    }));

    const reload = () => {
      webviewRef.current?.reload();
    };

    return (
      <Block style={styles.container}>
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          <Block
            zIndex={0}
            flexDirection="row"
            columnGap={4}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            style={StyleSheet.absoluteFill}>
            <Icon icon="lock_fill" size={14} colorTheme="neutral900" />
            <Text
              text={url.split('/')[2]}
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
          </Block>
          <Animated.View style={btnAnimatedStyle}>
            <Button
              hitSlop={HitSlop.Large}
              textFontStyle="Body16Reg"
              text="Done"
              textColorTheme="neutral900"
              padding={4}
              onPress={() => {
                goBack();
              }}
            />
          </Animated.View>
          <Animated.View style={btnAnimatedStyle}>
            <Button
              hitSlop={HitSlop.Large}
              leftIcon="refresh_outline"
              textColorTheme="neutral900"
              leftIconSize={24}
              padding={4}
              onPress={reload}
            />
          </Animated.View>
        </Animated.View>
      </Block>
    );
  },
  isEqual,
);
