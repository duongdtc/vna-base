/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { execFunc, onCheckType } from '@vna-base/utils';
import { sharedTiming } from '@vna-base/utils/animated';
import { useDisableBackHandler } from '@vna-base/utils/hooks';

import { styles } from './styles';
import { ModalProps } from './type';

export const ModalContent = forwardRef(
  (
    {
      style,
      children,
      customBackDrop,
      entering,
      exiting,
      backdropColor = 'black',
      backdropOpacity = 0.5,
      onSetClose,
      onModalHide,
      onModalShow,
      onBackdropPress,
      onModalWillHide,
      onModalWillShow,
      onBackButtonPress: onBackAndroidPress,
    }: CustomOmit<ModalProps, 'isVisible'> & { onSetClose: () => void },
    ref,
  ) => {
    // reanimated state

    const reBackdropOpacity = useSharedValue(0);

    // style
    const backDropStyle = useMemo<StyleProp<ViewStyle>>(
      () => [
        StyleSheet.absoluteFillObject,
        {
          width: '100%',
          height: '100%',
          backgroundColor: backdropColor,
        },
      ],
      [backdropColor],
    );

    const reBackdropStyle = useAnimatedStyle(
      () => ({
        opacity: reBackdropOpacity.value,
      }),
      [],
    );

    // function
    const onEndAnimatedClose = useCallback(
      (isFinished?: boolean) => {
        'worklet';
        if (isFinished) {
          if (typeof onSetClose === 'function') {
            runOnJS(onSetClose)();
          }

          if (typeof onModalHide === 'function') {
            runOnJS(onModalHide)();
          }
        }
      },
      [onModalHide, onSetClose],
    );

    const onEndAnimatedOpen = useCallback(
      (isFinished?: boolean) => {
        'worklet';
        if (isFinished) {
          if (typeof onModalShow === 'function') {
            runOnJS(onModalShow)();
          }
        }
      },
      [onModalShow],
    );

    const openModal = useCallback(() => {
      execFunc(onModalWillShow);

      reBackdropOpacity.value = sharedTiming(
        backdropOpacity,
        undefined,
        isFinished => {
          'worklet';
          if (isFinished) {
            if (!entering) {
              onEndAnimatedOpen(isFinished);
            }
          }
        },
      );
    }, [
      backdropOpacity,
      entering,
      onEndAnimatedOpen,
      onModalWillShow,
      reBackdropOpacity,
    ]);

    const closeModal = useCallback(() => {
      execFunc(onModalWillHide);

      if (exiting) {
        execFunc(onSetClose);
      }

      reBackdropOpacity.value = withTiming(0, undefined, isFinished => {
        'worklet';
        if (isFinished) {
          if (!exiting) {
            onEndAnimatedClose(isFinished);
          }
        }
      });
    }, [
      exiting,
      onEndAnimatedClose,
      onModalWillHide,
      onSetClose,
      reBackdropOpacity,
    ]);

    const renderBackdrop = () => {
      if (customBackDrop) {
        return customBackDrop;
      }

      return (
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <Animated.View style={[backDropStyle, reBackdropStyle]} />
        </TouchableWithoutFeedback>
      );
    };

    const onBackButtonPress = () => {
      if (onCheckType(onBackAndroidPress, 'function')) {
        onBackAndroidPress();
      }

      return true;
    };

    const contentView = () => {
      return (
        <Animated.View pointerEvents="box-none" style={[styles.content, style]}>
          <Animated.View
            //@ts-ignore
            entering={entering?.withCallback(onEndAnimatedOpen)}
            //@ts-ignore
            exiting={exiting?.withCallback(onEndAnimatedClose)}>
            {children}
          </Animated.View>
        </Animated.View>
      );
    };

    // effect
    useImperativeHandle(
      ref,
      () => ({
        dismiss: () => {
          closeModal();

          Keyboard.dismiss();
        },
      }),
      [closeModal],
    );

    useDisableBackHandler(true, onBackButtonPress);

    useEffect(() => {
      openModal();
    }, []);

    // render
    return (
      <View style={styles.modal}>
        {renderBackdrop()}
        {contentView()}
      </View>
    );
  },
);

export type ModalContent = {
  dismiss: () => void;
};
