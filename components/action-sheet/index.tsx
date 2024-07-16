import { Block, BottomSheet, Icon, Text } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ColorLight } from '@theme/color';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity } from '@utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity } from 'react-native';
import { useStyles } from './styles';
import { ActionSheetProps, OptionData } from './type';

export const ActionSheet = memo(
  forwardRef((props: ActionSheetProps, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const styles = useStyles();
    // state

    const {
      type,
      typeBackDrop = 'gray',
      onPressOption,
      option = [],
      selectedKey,
      t18nTitle,
    } = props;

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          bottomSheetRef.current?.present();
        },
      }),
      [],
    );

    // function
    const onPress = useCallback(
      (item: OptionData, index: number) => {
        return () => {
          bottomSheetRef.current?.close();

          onPressOption && onPressOption(item, index);
        };
      },
      [onPressOption],
    );

    const renderContent = useCallback(
      (_option: OptionData[]) =>
        _option.map((item: OptionData, index: number) => (
          <Block key={index} flex={1}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={onPress(item, index)}
              style={[
                styles.wrapTextOption,
                type === 'select' ? styles.pH16 : styles.jCC,
              ]}>
              {item.icon && (
                <Icon
                  icon={item.icon}
                  size={20}
                  colorTheme={item.iconTheme ?? 'neutral900'}
                />
              )}
              <Block rowGap={4}>
                <Text
                  t18n={item.t18n as I18nKeys}
                  fontStyle={
                    type === 'menu' || item?.key === selectedKey
                      ? 'Title16Semi'
                      : 'Body16Reg'
                  }
                  style={
                    type === 'menu' || item?.key === selectedKey
                      ? styles.textHighLight
                      : styles.textNormal
                  }
                />
                {item.subtitle && (
                  <Text
                    t18n={item.subtitle as I18nKeys}
                    fontStyle="Body12Reg"
                    style={styles.textSubtitle}
                  />
                )}
              </Block>
              {item?.key === selectedKey && (
                <Block style={styles.iconCheck}>
                  <Icon
                    icon="checkmark_fill"
                    size={20}
                    color={ColorLight.primary600}
                  />
                </Block>
              )}
            </TouchableOpacity>
          </Block>
        )),
      [onPress, styles, type, selectedKey],
    );

    // render
    return (
      <BottomSheet
        type="normal"
        typeBackDrop={typeBackDrop}
        ref={bottomSheetRef}
        enablePanDownToClose
        style={styles.container}
        t18nTitle={t18nTitle}
        showCloseButton={false}
        showLineBottomHeader={false}
        showIndicator={true}>
        <Block>{renderContent(option)}</Block>
      </BottomSheet>
    );
  }),
  isEqual,
);

export interface ActionSheet {
  show(): void;
}
