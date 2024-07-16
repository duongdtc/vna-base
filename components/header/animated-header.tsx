import { LinearGradient } from '@vna-base/components';
import { createStyleSheet, useStyles, bs } from '@theme';
import { Colors } from '@theme/type';
import { WindowWidth } from '@vna-base/utils';
import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ChildHeaderProps = {
  colorTheme: Colors;
};

type AnimatedHeaderProps = {
  zIndexSecond: SharedValue<number>;
  zIndexMain: SharedValue<number>;
  transFooterY?: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  leftContent?: (props: ChildHeaderProps) => React.JSX.Element;
  rightContent?: (props: ChildHeaderProps) => React.JSX.Element;
  centerContent?: (props: ChildHeaderProps) => React.JSX.Element;
  bottomContent?: (props: ChildHeaderProps) => React.JSX.Element;
  shadow?: boolean;
  animatedBackground?: boolean;
  onLayout: (e: LayoutChangeEvent) => void;
};

export const AnimatedHeader = memo((props: AnimatedHeaderProps) => {
  const {
    zIndexSecond,
    zIndexMain,
    transFooterY,
    style,
    leftContent,
    rightContent,
    centerContent,
    bottomContent,
    shadow = true,
    animatedBackground = true,
    onLayout,
  } = props;
  const { top } = useSafeAreaInsets();
  const { styles } = useStyles(styleSheet);
  const _transFooterY = useSharedValue(0);
  const [height, setHeight] = useState(0);

  const mainStyles = useAnimatedStyle(() => ({
    zIndex: zIndexMain.value,
    opacity: zIndexMain.value,
  }));

  const secondStyles = useAnimatedStyle(() => ({
    zIndex: zIndexSecond.value,
    opacity: zIndexSecond.value,
  }));

  const footerStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: (transFooterY ?? _transFooterY).value }],
  }));

  const onLayoutMain = useCallback(
    (e: LayoutChangeEvent) => {
      setHeight(e.nativeEvent.layout.height);
      onLayout(e);
    },
    [onLayout],
  );

  return (
    <View
      style={[
        bottomContent && {
          position: 'absolute',
          width: WindowWidth,
          zIndex: 10,
        },
        // rootStyles,
      ]}>
      <Animated.View
        style={[
          styles.container,
          styles.animatedContainer,
          style,
          animatedBackground && secondStyles,
          !bottomContent && shadow && styles.shadow,
        ]}>
        <View style={[{ height: top }, styles.statusBar]} />
        <View
          style={[
            bs.p_12,
            bs.flexDirectionRow,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          {leftContent?.({ colorTheme: 'neutral100' })}
          {centerContent?.({ colorTheme: 'neutral100' })}
          {rightContent?.({ colorTheme: 'neutral100' })}
        </View>
        {/* <View paddingBottom={!bottomContent ? 0 : 8}>
          {bottomContent?.({ colorTheme: 'neutral900' })}
        </View> */}
      </Animated.View>
      <Animated.View
        style={[styles.container, style, animatedBackground && mainStyles]}
        onLayout={onLayoutMain}>
        <LinearGradient type="gra3" style={[style]}>
          <View style={[{ height: top }]} />
          <View
            style={[
              bs.p_12,
              bs.flexDirectionRow,
              {
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            {leftContent?.({ colorTheme: 'white' })}
            {centerContent?.({ colorTheme: 'white' })}
            {rightContent?.({ colorTheme: 'white' })}
          </View>
        </LinearGradient>
      </Animated.View>
      <Animated.View
        style={[styles.footer, { top: height - 12 }, footerStyles]}>
        <LinearGradient type="gra3" style={[{ paddingTop: 12 }, style]}>
          {bottomContent?.({ colorTheme: 'white' })}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}, isEqual);

// const useStyles = () => {
//   const { colors, shadows } = useTheme();

//   return useMemo(
//     () =>
//       StyleSheet.create({
//         container: {},
//         animatedContainer: {
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: colors.neutral100,
//         },
//         shadow: shadows.small,
//         statusBar: { backgroundColor: '#D4D4D4' },
//         footer: {
//           position: 'absolute',
//           zIndex: -1,
//           left: 0,
//           right: 0,
//         },
//       }),
//     [colors, shadows],
//   );
// };

const styleSheet = createStyleSheet(({ colors, shadows }) => ({
  container: {},
  animatedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral100,
  },
  shadow: shadows.small,
  statusBar: { backgroundColor: '#D4D4D4' },
  footer: {
    position: 'absolute',
    zIndex: -1,
    left: 0,
    right: 0,
  },
}));
