import { Block, Icon, Text } from '@vna-base/components';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import { ActiveOpacity, HitSlop, WindowHeight } from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonProps, NormalProps, NormalRef } from '../type';
import { useStyles } from './styles';

const Normal = forwardRef<NormalRef, NormalProps & CommonProps>(
  (props, ref) => {
    const {
      onDismiss,
      children,
      header,
      enablePanDownToClose = true,
      showIndicator = false,
      snapPoints,
      dismissWhenClose = false,
      typeBackDrop = 'gray',
      t18nTitle,
      t18nDone,
      onDone,
      style,
      enableOverDrag = false,
      overDragResistanceFactor = 2.5,
      useDynamicSnapPoint = true,
      useModal = true,
      paddingBottom = true,
      onPressBackDrop,
      disablePressBackDrop,
      showCloseButton = true,
      showLineBottomHeader = true,
      detached,
      bottomInset,
      detachedCenter,
      android_keyboardInputMode = 'adjustResize',
      keyboardBehavior = 'interactive',
      useTopInset = true,
    } = props;

    const { bottom, top } = useSafeAreaInsets();
    const styles = useStyles();
    const normalRef = useRef<BottomSheetModal>(null);
    const initialSnapPoints = useMemo(
      () => snapPoints ?? ['CONTENT_HEIGHT'],
      [snapPoints],
    );

    const [bottomInsetCenter, setBottomInsetCenter] = useState(0);

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

    useImperativeHandle(
      ref,
      () => ({
        close: () => {
          normalRef.current?.close();
        },
        dismiss: () => {
          normalRef.current?.dismiss();
        },
        present: () => {
          normalRef.current?.present();
        },
        collapse: () => {
          normalRef.current?.collapse();
        },
        expand: () => {
          normalRef.current?.expand();
        },
      }),
      [],
    );

    const close = useCallback(() => {
      onPressBackDrop?.();
      if (dismissWhenClose) {
        normalRef.current?.dismiss();
      } else {
        normalRef.current?.close();
      }
    }, [dismissWhenClose, onPressBackDrop]);

    const Header = useMemo(
      () => (
        <>
          {header ?? (
            <Block
              alignItems="center"
              borderBottomWidth={showLineBottomHeader ? 5 : 0}
              borderTopRadius={8}
              paddingHorizontal={12}
              paddingVertical={8}
              colorTheme="neutral100"
              flexDirection="row"
              justifyContent="space-between"
              borderColorTheme="neutral200">
              {showCloseButton && (
                <TouchableOpacity
                  onPress={close}
                  hitSlop={HitSlop.Large}
                  style={{ padding: 4 }}
                  activeOpacity={ActiveOpacity}>
                  <Icon icon="close_outline" colorTheme="neutral900" />
                </TouchableOpacity>
              )}
              {showIndicator && (
                <Block style={styles.indicatorContainer}>
                  <Block style={styles.indicator} colorTheme="neutral300" />
                </Block>
              )}
              {t18nTitle && (
                <Block
                  style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                  justifyContent="center"
                  alignItems="center">
                  <Text
                    colorTheme="neutral900"
                    t18n={t18nTitle}
                    fontStyle="Title16Bold"
                  />
                </Block>
              )}
              {t18nDone && (
                <TouchableOpacity
                  hitSlop={HitSlop.Medium}
                  onPress={onDone}
                  style={{ padding: 4 }}
                  activeOpacity={ActiveOpacity}>
                  <Text
                    fontStyle="Body14Bold"
                    colorTheme="primary500"
                    t18n={t18nDone}
                  />
                </TouchableOpacity>
              )}
            </Block>
          )}
        </>
      ),
      [
        header,
        showLineBottomHeader,
        showCloseButton,
        close,
        showIndicator,
        styles.indicatorContainer,
        styles.indicator,
        t18nTitle,
        t18nDone,
        onDone,
      ],
    );

    const backdropComponent = useCallback(
      (backdropProps: BottomSheetBackdropProps) => {
        switch (typeBackDrop) {
          case 'shadow':
            return (
              <TouchableWithoutFeedback onPress={close}>
                <Block
                  flex={1}
                  style={[styles.backdrop, { backgroundColor: 'transparent' }]}
                />
              </TouchableWithoutFeedback>
            );
          case 'gray':
            return (
              <BottomSheetBackdrop
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                {...backdropProps}
                pressBehavior={disablePressBackDrop ? 'none' : 'close'}
                onPress={() => {
                  onPressBackDrop?.();
                }}
              />
            );

          default:
            return (
              <TouchableWithoutFeedback onPress={close}>
                <BlurView
                  style={styles.backdrop}
                  blurType={'dark'}
                  blurAmount={1.3}
                />
              </TouchableWithoutFeedback>
            );
        }
      },
      [close, styles.backdrop, typeBackDrop, disablePressBackDrop],
    );

    const dynamicSnapPoint = useMemo(
      () =>
        useDynamicSnapPoint
          ? {
              snapPoints: animatedSnapPoints,
              handleHeight: animatedHandleHeight,
              contentHeight: animatedContentHeight,
            }
          : { snapPoints: snapPoints || ['100%'] },
      [
        useDynamicSnapPoint,
        animatedSnapPoints,
        animatedHandleHeight,
        animatedContentHeight,
        snapPoints,
      ],
    );

    const renderContent = useMemo(
      () =>
        useDynamicSnapPoint ? (
          <BottomSheetView
            onLayout={e => {
              handleContentLayout(e);
              if (detachedCenter) {
                setBottomInsetCenter(
                  Math.round((WindowHeight - e.nativeEvent.layout.height) / 2),
                );
              }
            }}
            style={[
              {
                paddingBottom: paddingBottom ? bottom : 0,
              },
            ]}>
            {children}
          </BottomSheetView>
        ) : (
          children
        ),
      [
        useDynamicSnapPoint,
        paddingBottom,
        bottom,
        children,
        handleContentLayout,
        detachedCenter,
      ],
    );

    if (useModal) {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <BottomSheetModal
          enableOverDrag={enableOverDrag}
          overDragResistanceFactor={overDragResistanceFactor}
          animateOnMount
          ref={normalRef}
          style={[
            typeBackDrop === 'shadow' && styles.shadow,
            style,
            styles.container,
          ]}
          backgroundStyle={styles.bgContainer}
          {...dynamicSnapPoint}
          keyboardBehavior={keyboardBehavior}
          keyboardBlurBehavior="none"
          stackBehavior="push"
          topInset={useTopInset ? top : undefined}
          android_keyboardInputMode={android_keyboardInputMode}
          onDismiss={() => {
            onDismiss?.();
            Keyboard.dismiss();
          }}
          handleComponent={() => Header}
          backdropComponent={backdropComponent}
          children={renderContent}
          enablePanDownToClose={enablePanDownToClose}
          detached={detached || detachedCenter}
          bottomInset={bottomInsetCenter || bottomInset}
        />
      );
    } else {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <BottomSheet
          enableOverDrag={enableOverDrag}
          overDragResistanceFactor={overDragResistanceFactor}
          animateOnMount
          onClose={() => {
            onDismiss?.();
            Keyboard.dismiss();
          }}
          index={-1}
          ref={normalRef}
          style={[
            typeBackDrop === 'shadow' && styles.shadow,
            style,
            styles.container,
          ]}
          backgroundStyle={styles.bgContainer}
          {...dynamicSnapPoint}
          keyboardBehavior={keyboardBehavior}
          keyboardBlurBehavior="none"
          android_keyboardInputMode={android_keyboardInputMode}
          handleComponent={() => Header}
          topInset={useTopInset ? top : undefined}
          backdropComponent={backdropComponent}
          children={renderContent}
          enablePanDownToClose={enablePanDownToClose}
          detached={detached || detachedCenter}
          bottomInset={bottomInsetCenter || bottomInset}
        />
      );
    }
  },
);

export default Normal;
