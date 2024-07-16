import { Block, Button, Modal, Text } from '@vna-base/components';
import { ModalWidth, scale } from '@vna-base/utils';
import React, {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useStyles } from './styles';
import { ModalConfirmComponentProps } from './type';
import LottieView from 'lottie-react-native';
import { lotties } from '@assets/lottie';

const ModalConfirmComponent = forwardRef((_, ref) => {
  const styles = useStyles();

  const [data, setData] = useState<ModalConfirmComponentProps | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const _onCancel = useCallback(() => {
    setIsVisible(false);
    if (typeof data?.onCancel === 'function') {
      data.onCancel();
    }
  }, [data]);

  const _onOk = useCallback(() => {
    if (typeof data?.onOk === 'function') {
      data.onOk();
    }

    if (data?.hideWhenDone) {
      setIsVisible(false);
    }
  }, [data]);

  useImperativeHandle(
    ref,
    () => ({
      show: (params: ModalConfirmComponentProps) => {
        setData({ ...params, hideWhenDone: params?.hideWhenDone ?? true });
        setIsVisible(true);
      },
      hide: () => {
        setIsVisible(false);
        setData(null);
      },
    }),
    [],
  );

  // render
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={data?.onCancel}
      onBackButtonPress={data?.onCancel}
      entering={SlideInDown}
      exiting={SlideOutDown}>
      <Block
        colorTheme="neutral100"
        borderRadius={16}
        minWidth={scale(300)}
        alignSelf="center"
        maxWidth={ModalWidth}
        padding={12}
        paddingTop={24}>
        <Block paddingBottom={24} rowGap={16}>
          {data?.lottie && (
            <Block alignItems="center">
              <LottieView
                autoPlay
                speed={1}
                loop={false}
                source={lotties[data.lottie]}
                style={data?.lottieStyle}
                resizeMode="cover"
              />
            </Block>
          )}
          {/* {data?.iconName && <Block />} */}
          {/* {data?.svg && <data?.svg />} */}
          {data?.t18nTitle && (
            <Text
              textAlign="center"
              t18n={data?.t18nTitle}
              fontStyle="Title20Semi"
              colorTheme="neutral900"
              numberOfLines={2}
            />
          )}
          {data?.t18nSubtitle && (
            <Text
              textAlign="center"
              style={styles.subtitle}
              t18n={data?.t18nSubtitle}
              fontStyle="Body14Reg"
              colorTheme="neutral800"
              numberOfLines={2}
            />
          )}
          {data?.renderBody?.()}
        </Block>
        <Block
          flexDirection={data?.flexDirection ?? 'column'}
          rowGap={12}
          columnGap={12}>
          <Block
            flex={data?.flexDirection === 'row' ? 1 : undefined}
            width={data?.flexDirection === 'row' ? undefined : '100%'}>
            <Button
              t18n={data?.t18nCancel ?? 'modal_confirm:close'}
              onPress={_onCancel}
              fullWidth
              size="medium"
              buttonColorTheme={data?.themeColorCancel ?? 'primary500'}
              textColorTheme={data?.themeColorTextCancel ?? 'classicWhite'}
            />
          </Block>
          {/* {typeof data?.optionThird === 'function' && (
            <>
            <Block
            style={[styles.separator, { width: StyleSheet.hairlineWidth }]}
            />
            <Button
            flex={1}
            t18n={data?.t18nOptionThird ?? 'modal_confirm:ok'}
            onPress={_onOk}
            alignContent="center"
            textFontStyle="body"
            textColorTheme={data?.themeColorOptionThird ?? 'accent.blue100'}
            />
            </>
          )} */}
          {typeof data?.onOk === 'function' && (
            <Block
              flex={data?.flexDirection === 'row' ? 1 : undefined}
              width={data?.flexDirection === 'row' ? undefined : '100%'}>
              <Button
                t18n={data?.t18nOk ?? 'modal_confirm:ok'}
                onPress={_onOk}
                fullWidth
                size="medium"
                buttonColorTheme={data?.themeColorOK ?? 'primary500'}
                textColorTheme={data?.themeColorTextOK ?? 'classicWhite'}
              />
            </Block>
          )}
        </Block>
      </Block>
    </Modal>
  );
});

export type ModalConfirm = {
  show: (params: ModalConfirmComponentProps) => void;
  hide: () => void;
};

export const modalConfirmRef = createRef<ModalConfirm>();

export const ModalConfirm = () => (
  <ModalConfirmComponent ref={modalConfirmRef} />
);

export const showModalConfirm = (params: ModalConfirmComponentProps) => {
  modalConfirmRef.current?.show(params);
};

export const hideModalConfirm = () => {
  modalConfirmRef.current?.hide();
};
