import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import { Block } from '@components/block';
import { Modal } from '@components/modal';
import { BlurView } from '@react-native-community/blur';
import { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { styles } from './styles';
import { DrawerProps, DrawerRef } from './type';

export const Drawer = forwardRef(
  ({ children }: DrawerProps, ref: ForwardedRef<DrawerRef>) => {
    const [isVisible, setIsVisible] = useState(false);

    const hide = useCallback(() => {
      setIsVisible(false);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setIsVisible(true);
        },
        hide,
      }),
      [hide],
    );

    // render
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={hide}
        onBackButtonPress={hide}
        entering={SlideInRight}
        exiting={SlideOutRight}
        customBackDrop={
          <BlurView style={styles.backdrop} blurType={'dark'} blurAmount={1} />
        }>
        <Block style={styles.container}>{children}</Block>
      </Modal>
    );
  },
);
