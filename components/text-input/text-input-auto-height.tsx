import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { HairlineWidth, scale } from '@utils';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { TextInputAutoHeightProps } from './type';

export const TextInputAutoHeight = forwardRef<
  TextInput,
  TextInputAutoHeightProps
>((props, ref) => {
  const { colors } = useTheme();
  const {
    right,
    fontStyle = 'Body16Reg',
    style,
    styleInput,
    placeholderTextColor = colors.neutral500,
    disable,
    useBottomSheetInput = false,
    numberOfLines = 3,
    ...subProps
  } = props;
  const styles = useStyles();
  const inputRef = useRef<any>(null);

  const [textHeight, setTextHeight] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

  useImperativeHandle(ref, () => inputRef.current, []);

  return (
    <TouchableOpacity
      disabled={disable}
      style={[
        styles.container,
        style,
        { borderColor: isFocus ? colors.primary500 : colors.neutral300 },
      ]}
      activeOpacity={1}
      onPress={() => {
        inputRef.current?.focus();
      }}>
      {useBottomSheetInput ? (
        <BottomSheetTextInput
          ref={inputRef}
          {...subProps}
          multiline
          onContentSizeChange={({
            nativeEvent: {
              contentSize: { height },
            },
          }) => {
            if (!textHeight) {
              setTextHeight(height);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={!disable}
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.input,
            FontStyle[fontStyle],
            styleInput,
            {
              maxHeight: (textHeight || 17) * numberOfLines,
            },
          ]}
        />
      ) : (
        <TextInput
          ref={inputRef}
          {...subProps}
          multiline
          onContentSizeChange={({
            nativeEvent: {
              contentSize: { height },
            },
          }) => {
            if (!textHeight) {
              setTextHeight(height);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={!disable}
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.input,
            FontStyle[fontStyle],
            styleInput,
            {
              maxHeight: (textHeight || 17) * numberOfLines,
            },
          ]}
        />
      )}
      {right}
    </TouchableOpacity>
  );
});

const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          flexDirection: 'row',
          columnGap: scale(4),
          borderRadius: 8,
          padding: scale(12),
          borderWidth: HairlineWidth * 3,
        },
        input: {
          flex: 1,
          color: colors.neutral900,
        },
      }),
    [colors.neutral900],
  );
};
