import { Block, Icon, Text } from '@vna-base/components';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { ActiveOpacity, HitSlop } from '@utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonProps, NormalRef, ScreenProps } from '../type';
import { useStyles } from './styles';

const Screen = forwardRef<NormalRef, ScreenProps & CommonProps>(
  (props, ref) => {
    const {
      onDismiss,
      dismissWhenClose = false,
      t18nTitle,
      style,
      useModal = true,
      ...rest
    } = props;
    const { top } = useSafeAreaInsets();
    const styles = useStyles();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      close: () => {
        bottomSheetRef.current?.close();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
      present: () => {
        bottomSheetRef.current?.present();
      },
      collapse: () => {
        bottomSheetRef.current?.collapse();
      },
      expand: () => {
        bottomSheetRef.current?.expand();
      },
    }));

    const close = useCallback(() => {
      if (dismissWhenClose) {
        bottomSheetRef.current?.dismiss();
      } else {
        bottomSheetRef.current?.close();
      }
    }, [dismissWhenClose]);

    const Header = useMemo(
      () => (
        <Block>
          <Block height={top} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            borderBottomWidth={5}
            paddingHorizontal={12}
            paddingVertical={12}
            colorTheme="neutral100"
            borderColorTheme="neutral200">
            <TouchableOpacity
              hitSlop={HitSlop.Large}
              onPress={close}
              style={{ padding: 4 }}
              activeOpacity={ActiveOpacity}>
              <Icon
                icon="arrow_ios_left_outline"
                size={24}
                colorTheme="neutral900"
              />
            </TouchableOpacity>
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
          </Block>
        </Block>
      ),
      [close, t18nTitle, top],
    );

    const backdropComponent = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          {...backdropProps}
        />
      ),
      [],
    );

    if (useModal) {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <BottomSheetModal
          animateOnMount
          ref={bottomSheetRef}
          backgroundStyle={[styles.bgContainer]}
          style={[styles.container, style]}
          snapPoints={['100%']}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="none"
          stackBehavior="push"
          android_keyboardInputMode="adjustResize"
          onDismiss={onDismiss}
          handleComponent={() => Header}
          enableOverDrag={false}
          backdropComponent={backdropComponent}
          enablePanDownToClose={false}
          showIndicator={false}
          {...rest}
        />
      );
    } else {
      return (
        <BottomSheet
          animateOnMount
          ref={bottomSheetRef}
          backgroundStyle={[styles.bgContainer]}
          style={[styles.container, style]}
          snapPoints={['100%']}
          index={-1}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="none"
          android_keyboardInputMode="adjustResize"
          enableOverDrag={false}
          handleComponent={() => Header}
          backdropComponent={backdropComponent}
          enablePanDownToClose={false}
          showIndicator={false}
          {...rest}
        />
      );
    }
  },
);

export default Screen;
