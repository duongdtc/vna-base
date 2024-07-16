/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, BottomSheet, Icon, Text } from '@vna-base/components';
import {
  ColorPicker as ColorPickerType,
  CommonProps,
} from '@vna-base/components/row-of-form/type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '@theme';
import { WindowWidth } from '@vna-base/utils';
import React, { useRef, useState } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';
import ColorPickerBase, {
  HueSlider,
  InputWidget,
  Panel1,
} from 'reanimated-color-picker';
import { useStyles } from '../../styles';

export function ColorPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ColorPickerType & CommonProps<TFieldValues, TName>) {
  const styles = useStyles();
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const {
    t18n,
    control,
    name,
    isRequire,
    disable,
    fixedTitleFontStyle,
    colorThemeValue,
    titleFontStyle,
    colorTheme = 'neutral100',
  } = props;

  const [pickedColor, setPickedColor] = useState('#000000');

  const {
    field: { value: colorValue, onChange: onChangeColorValue },
  } = useController({
    control: control,
    //@ts-ignore
    name: name,
  });

  const showBottomSheet = () => {
    setPickedColor(colorValue);
    bottomSheetRef.current?.present();
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors[colorTheme] }]}
      disabled={disable}
      onPress={showBottomSheet}>
      <Block style={[styles.leftContainer, { paddingLeft: 16 }]}>
        <Text
          t18n={t18n}
          colorTheme="neutral900"
          fontStyle={
            titleFontStyle ??
            (!fixedTitleFontStyle ? 'Title16Semi' : 'Body16Reg')
          }
        />
        {isRequire && (
          <Text text="*" fontStyle="Body16Reg" colorTheme="error500" />
        )}
      </Block>
      <Block style={styles.rightContainer}>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          {colorValue ? (
            <>
              <Text
                fontStyle="Body14Semi"
                colorTheme={colorThemeValue ?? 'neutral900'}
                text={colorValue}
              />
              <Block
                style={{ backgroundColor: colorValue }}
                shadow="main"
                width={20}
                height={20}
                borderRadius={2}
              />
            </>
          ) : (
            <>
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral700"
                t18n="common:not_selected"
              />
              <Icon
                icon="arrow_ios_right_outline"
                colorTheme={colorValue ? 'neutral900' : 'neutral700'}
                size={20}
              />
            </>
          )}
        </Block>
      </Block>
      {!disable && (
        <BottomSheet
          type="normal"
          onDismiss={() => {
            onChangeColorValue(pickedColor);
          }}
          typeBackDrop={'gray'}
          ref={bottomSheetRef}
          android_keyboardInputMode="adjustPan"
          enablePanDownToClose={false}
          t18nTitle="common:select_color"
          showIndicator={false}>
          <Block
            paddingHorizontal={32}
            width={WindowWidth}
            paddingVertical={20}>
            <ColorPickerBase
              sliderThickness={20}
              thumbSize={28}
              style={{ rowGap: 16 }}
              value={pickedColor}
              onComplete={cl => {
                setPickedColor(cl.hex);
              }}>
              <Panel1 />
              <HueSlider />
              <InputWidget />
            </ColorPickerBase>
          </Block>
        </BottomSheet>
      )}
    </Pressable>
  );
}
