/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Icon } from '@vna-base/components/icon';
import { TouchableScale } from '@vna-base/components/touch-scale';
import { useStyles } from '@theme';
import { DisableOpacity, MinScaleButton } from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from '../text';
import { styleSheet } from './styles';
import { ButtonProps, stylesText } from './type';
import { LinearGradient } from '@vna-base/components';
import { Opacity } from '@theme/color';

export const Button = memo((props: ButtonProps) => {
  // state
  const {
    text,
    t18n,
    textColorTheme,
    buttonColorTheme,
    buttonStyle: styleOverride = {},
    textStyle: textStyleOverride = {},
    leftIcon,
    leftIconSize,
    rightIcon,
    rightIconSize,
    size = 'medium',
    type = 'common',
    scale: canScale = true,
    columnGap = 8,
    disabled,
    shadow,
    numberOfLines,
    ellipsizeMode,
    isLoading,
    activityIndicatorColorTheme = 'white',

    // * container
    fullWidth,
    style: containerStyle = {},
    margin,
    marginBottom,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginTop,
    marginVertical,
    alignSelf,
    padding,
    paddingHorizontal,
    paddingVertical,
    textFontStyle,
    ...rest
  } = props;

  const {
    styles: stylesButton,
    theme: { colors, shadows, spacings, radius },
  } = useStyles(styleSheet);

  const _containerStyle = useMemo(() => {
    const style = [
      margin && { margin: spacings[margin] },
      marginBottom && { marginBottom: spacings[marginBottom] },
      marginHorizontal && { marginHorizontal: spacings[marginHorizontal] },
      marginLeft && { marginLeft: spacings[marginLeft] },
      marginRight && { marginRight: spacings[marginRight] },
      marginTop && { marginTop: spacings[marginTop] },
      alignSelf && { alignSelf: alignSelf },
      marginVertical && { marginVertical: spacings[marginVertical] },
      containerStyle,
    ];

    if (fullWidth) {
      style.push({ width: '100%' });
    } else {
      style.push({ alignItems: 'baseline' });
    }

    return style;
  }, [
    alignSelf,
    containerStyle,
    fullWidth,
    margin,
    marginBottom,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginTop,
    marginVertical,
    spacings,
  ]);

  // style
  const btnStyle = useMemo(() => {
    const style: Array<any> = [
      { columnGap: columnGap },
      buttonColorTheme &&
        !buttonColorTheme.includes('gra') && {
          backgroundColor: colors[buttonColorTheme],
        },
      // nếu nút chỉ có icon
      !t18n && !text
        ? {
            paddingLeft: spacings[8],
            paddingRight: spacings[8],
            paddingBottom: spacings[8],
            paddingTop: spacings[8],
          }
        : [
            stylesButton[
              `${size}_${leftIcon || rightIcon ? 'icon' : 'non_icon'}`
            ],
            leftIcon && stylesButton[`${size}_leftIcon`],
            rightIcon && stylesButton[`${size}_rightIcon`],
          ],
      disabled && { opacity: DisableOpacity },
      shadow && shadows.small,
      { borderRadius: spacings[8], overflow: 'hidden' },
    ];

    switch (type) {
      case 'outline':
        style.push(stylesButton[`outline_${size}`]);
        if (textColorTheme) {
          style.push({ borderColor: colors[textColorTheme] });
        }

        break;
      case 'lowSat':
        if (textColorTheme) {
          style.push({
            backgroundColor:
              //@ts-ignore
              colors[`${textColorTheme.slice(0, -3)}100`] + Opacity[50],
          });
        }

        break;
      case 'classic':
        style.push({
          backgroundColor:
            //@ts-ignore
            colors.classicBg,
        });

        break;

      default:
        // @ts-ignore
        style.push(stylesButton[type]);

        break;
    }

    return style;
  }, [
    columnGap,
    buttonColorTheme,
    colors,
    t18n,
    text,
    spacings,
    stylesButton,
    size,
    leftIcon,
    rightIcon,
    disabled,
    shadow,
    shadows.small,
    type,
    textColorTheme,
  ]);

  const iconSize = useMemo(() => {
    switch (size) {
      case 'medium':
        return 24;
      case 'small':
        return 16;

      default:
        return 24;
    }
  }, [size]);

  const touchableScaleStyles = useMemo<StyleProp<ViewStyle>>(
    () => [
      btnStyle,
      stylesButton.common,
      styleOverride,
      padding !== undefined && {
        paddingLeft: spacings[padding],
        paddingRight: spacings[padding],
        paddingBottom: spacings[padding],
        paddingTop: spacings[padding],
      },

      paddingHorizontal !== undefined && {
        paddingLeft: spacings[paddingHorizontal],
        paddingRight: spacings[paddingHorizontal],
      },
      paddingVertical !== undefined && {
        paddingTop: spacings[paddingVertical],
        paddingBottom: spacings[paddingVertical],
      },
    ],
    [
      btnStyle,
      stylesButton.common,
      styleOverride,
      padding,
      spacings,
      paddingHorizontal,
      paddingVertical,
    ],
  );

  const right = useMemo(() => {
    if (isLoading) {
      return (
        <View
          style={{
            borderRadius: radius[8],
            transform: [
              {
                scale: 0.6,
              },
            ],
          }}>
          <ActivityIndicator
            size="small"
            color={colors[activityIndicatorColorTheme] as ColorValue}
          />
        </View>
      );
    }

    if (rightIcon) {
      return (
        <Icon
          icon={rightIcon}
          size={rightIconSize ?? iconSize}
          colorTheme={textColorTheme}
        />
      );
    }

    return null;
  }, [
    activityIndicatorColorTheme,
    colors,
    iconSize,
    isLoading,
    radius,
    rightIcon,
    rightIconSize,
    textColorTheme,
  ]);
  // render
  return (
    // @ts-ignore
    <View style={_containerStyle}>
      <TouchableScale
        minScale={canScale ? MinScaleButton : 1}
        containerStyle={touchableScaleStyles}
        disabled={disabled}
        {...rest}>
        {(buttonColorTheme?.includes('gra') ||
          buttonColorTheme?.startsWith('0')) && (
          <LinearGradient
            style={StyleSheet.absoluteFill}
            //@ts-ignore
            type={buttonColorTheme}
          />
        )}
        {leftIcon && (
          <Icon
            icon={leftIcon}
            size={leftIconSize ?? iconSize}
            colorTheme={textColorTheme}
          />
        )}
        {(t18n || text) && (
          <Text
            t18n={t18n}
            text={text}
            style={[textStyleOverride]}
            fontStyle={textFontStyle ?? stylesText[size]}
            colorTheme={textColorTheme}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
          />
        )}
        {right}
      </TouchableScale>
    </View>
  );
}, isEqual);
