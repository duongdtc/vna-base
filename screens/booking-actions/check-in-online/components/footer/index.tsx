import { Block, Button } from '@vna-base/components';
import { HitSlop } from '@vna-base/utils';
import React, { RefObject, memo } from 'react';
import isEqual from 'react-fast-compare';
import { Alert, Linking } from 'react-native';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import WebView from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
import { useStyles } from './styles';

type Props = {
  sharedValue: SharedValue<number>;
  url: string;
  webviewState: Pick<
    WebViewNavigationEvent,
    'canGoBack' | 'canGoForward' | 'loading'
  >;
  webviewRef: RefObject<WebView<any>>;
};

export const Footer = memo(
  ({ url, webviewState, sharedValue, webviewRef }: Props) => {
    const styles = useStyles();
    const { bottom } = useSafeAreaInsets();

    const openExplorer = async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    };

    const shareUrl = async () => {
      try {
        await Share.open({
          message: url,
        });
      } catch (error) {
        console.log('🚀 ~ shareContent ~ error:', error);
      }
    };

    const goBack = () => {
      webviewRef.current?.goBack();
    };

    const goForward = () => {
      webviewRef.current?.goForward();
    };

    const containerStyle = useAnimatedStyle(() => ({
      height: interpolate(sharedValue.value, [0.7, 1], [0, bottom + 49]),
    }));

    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <Block style={styles.contentContainer}>
          <Button
            disabled={!webviewState.canGoBack}
            hitSlop={HitSlop.Medium}
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={goBack}
          />
          <Button
            disabled={!webviewState.canGoForward}
            hitSlop={HitSlop.Medium}
            leftIcon="arrow_ios_right_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={goForward}
          />
          <Button
            hitSlop={HitSlop.Medium}
            leftIcon="share_ios"
            textColorTheme="info500"
            leftIconSize={24}
            padding={4}
            onPress={shareUrl}
          />
          <Button
            hitSlop={HitSlop.Medium}
            leftIcon="fi_sr_globe"
            textColorTheme="info500"
            leftIconSize={24}
            padding={4}
            onPress={openExplorer}
          />
        </Block>
      </Animated.View>
    );
  },
  isEqual,
);
