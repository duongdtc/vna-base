import { LottieTypes, lotties } from '@assets/lottie';
import { Block, Modal, Text } from '@components';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import { WindowWidth, delay, scale } from '@utils';
import { useDisableBackHandler, useDismissKeyboard } from '@utils/hooks';
import LottieView from 'lottie-react-native';
import React, {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import {
  FadeInUp,
  FadeOutUp,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

export type ShowDialogConfig = {
  lottie: LottieTypes;
  lottieStyle: StyleProp<ViewStyle>;
  t18nTitle: I18nKeys;
  t18nSubtitle: I18nKeys;
  /** default 2 */
  speed?: number;
  body?: React.ReactNode;
};

export type HideDialogConfig = {
  lottie: LottieTypes;
  lottieStyle?: StyleProp<ViewStyle>;
  t18nTitle?: I18nKeys;
  t18nSubtitle?: I18nKeys;
  /** default 1 */
  speed?: number;
  body?: React.ReactNode;
  /**
   * @default 200
   */
  visibleTime?: number;
};

export type ProgressDialogRef = {
  show(config?: ShowDialogConfig): void;
  hide(config?: HideDialogConfig): void;
};

const ProgressDialogComponent = forwardRef<ProgressDialogRef, any>((_, ref) => {
  const theme = useTheme();

  const lottieRef = useRef<LottieView>(null);

  const [visible, setVisible] = useState(false);
  const [contentLottie, setContentLottie] = useState<
    | (Pick<ShowDialogConfig, 'lottie' | 'lottieStyle' | 'speed'> & {
        hide?: boolean;
        loop?: boolean;
        visibleTime?: number;
      })
    | null
  >(null);

  const [contentText, setContentText] = useState<Pick<
    ShowDialogConfig,
    't18nSubtitle' | 't18nTitle' | 'body'
  > | null>(null);

  const hideModal = useCallback(async () => {
    setVisible(false);

    await delay(100);

    setContentText(null);
    setContentLottie(null);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: cf => {
        if (cf) {
          setContentLottie({
            lottie: cf.lottie,
            lottieStyle: cf.lottieStyle,
            speed: cf.speed || 2,
          });

          setContentText({
            t18nTitle: cf.t18nTitle,
            t18nSubtitle: cf.t18nSubtitle,
            body: cf.body,
          });
        }

        setVisible(true);
      },
      hide: cf => {
        if (cf) {
          setContentLottie({
            lottie: cf.lottie,
            lottieStyle: cf.lottieStyle,
            hide: true,
            loop: false,
            speed: cf.speed || 1.2,
            visibleTime: cf.visibleTime,
          });

          setContentText(prev =>
            prev
              ? {
                  t18nTitle: cf.t18nTitle ?? prev.t18nTitle,
                  t18nSubtitle: cf.t18nSubtitle ?? prev.t18nSubtitle,
                  body: cf.body,
                }
              : null,
          );
        } else {
          hideModal();
        }
      },
    }),
    [hideModal],
  );

  useDisableBackHandler(visible);

  useDismissKeyboard(visible);

  const onAnimationFinish = useCallback(async () => {
    if (contentLottie?.hide) {
      await delay(contentLottie?.visibleTime ?? 500);
      hideModal();
    }
  }, [contentLottie, hideModal]);

  // if (!visible) {
  //   return null;
  // }

  if (contentLottie && contentText) {
    return (
      <Modal isVisible={visible} entering={SlideInDown} exiting={SlideOutDown}>
        <Block
          colorTheme="neutral100"
          borderRadius={14}
          minWidth={scale(270)}
          alignSelf="center"
          maxWidth={(3 * WindowWidth) / 4}
          paddingHorizontal={16}
          paddingBottom={16}
          paddingTop={8}>
          <Block alignItems="center">
            <LottieView
              ref={lottieRef}
              autoPlay
              speed={contentLottie.speed}
              onAnimationFinish={onAnimationFinish}
              loop={contentLottie.loop}
              source={lotties[contentLottie.lottie]}
              style={contentLottie.lottieStyle}
              resizeMode="cover"
            />
          </Block>
          <Block rowGap={16} alignItems="center" marginTop={12}>
            <Text
              textAlign="center"
              t18n={contentText.t18nTitle}
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
            {contentText.body ?? (
              <Text
                textAlign="center"
                t18n={contentText.t18nSubtitle}
                fontStyle="Body14Reg"
                colorTheme="neutral800"
              />
            )}
          </Block>
        </Block>
      </Modal>
    );
  }

  return (
    <Modal isVisible={visible} entering={FadeInUp} exiting={FadeOutUp}>
      <ActivityIndicator color={theme.colors.background} size={'large'} />
    </Modal>
  );
});

export const progressDialogRef = createRef<ProgressDialogRef>();

export const ProgressDialog = () => (
  <ProgressDialogComponent ref={progressDialogRef} />
);

export const showLoading = (cf?: ShowDialogConfig) => {
  progressDialogRef.current?.show(cf);
};

export const hideLoading = (cf?: HideDialogConfig) => {
  progressDialogRef.current?.hide(cf);
};
