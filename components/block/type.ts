import React from 'react';
import {
  ColorValue,
  FlexAlignType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { Colors } from '@theme';
import { BorderRadius, BorderWidth, Spacing } from '@theme/type';
import { ShadowLight } from '@theme/shadow';

type Direction = 'row' | 'column' | 'column-reverse' | 'row-reverse';

type JustifyContent =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

type Position = 'absolute' | 'relative';

type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

type OverFlow = 'visible' | 'hidden' | 'scroll';

export type ShadowConfig = {
  shadowColor?: ColorValue | undefined;

  shadowOffset?: { width: number; height: number } | undefined;

  shadowOpacity?: number | undefined;

  shadowRadius?: number | undefined;
};

type StyleStringOrNumber = string | number;

export interface BlockProps extends ViewProps {
  left?: Spacing;

  right?: Spacing;

  bottom?: Spacing;

  top?: Spacing;

  margin?: Spacing;

  marginLeft?: Spacing;

  marginRight?: Spacing;

  marginTop?: Spacing;

  marginBottom?: Spacing;

  padding?: Spacing;

  paddingRight?: Spacing;

  paddingBottom?: Spacing;

  paddingLeft?: Spacing;

  paddingTop?: Spacing;

  paddingHorizontal?: Spacing;

  paddingVertical?: Spacing;

  borderWidth?: BorderWidth;

  borderBottomWidth?: BorderWidth;

  borderLeftWidth?: BorderWidth;

  borderRightWidth?: BorderWidth;

  borderTopWidth?: BorderWidth;

  borderRadius?: BorderRadius;

  borderBottomRadius?: BorderRadius;

  borderLeftRadius?: BorderRadius;

  borderRightRadius?: BorderRadius;

  borderTopRadius?: BorderRadius;

  columnGap?: Spacing;

  gap?: Spacing;

  marginHorizontal?: Spacing;

  marginVertical?: Spacing;

  rowGap?: Spacing;

  flexWrap?: FlexWrap;

  flexShrink?: number;

  zIndex?: number;

  overflow?: OverFlow;

  borderStyle?: 'solid' | 'dotted' | 'dashed';

  opacity?: number;

  /**
   * Config position
   * @default undefined
   */
  position?: Position;

  /**
   * Enable to using {flex:1}
   * @default undefined
   */
  block?: boolean;

  /**
   * overwrite flex box
   */
  flex?: number;

  /**
   * Using align items
   * @default undefined
   */
  alignItems?: FlexAlignType;

  /**
   * Using align self
   * @default undefined
   */
  alignSelf?: 'auto' | FlexAlignType;

  /**
   * Using flex direction
   * @default undefined
   */
  flexDirection?: Direction;

  /**
   * Actual width
   * @default undefined
   */
  width?: StyleStringOrNumber;

  /**
   * Actual max width
   * @default undefined
   */
  maxWidth?: StyleStringOrNumber;

  /**
   * Actual min width
   * @default undefined
   */
  minWidth?: StyleStringOrNumber;

  /**
   * Actual height
   * @default undefined
   */
  height?: StyleStringOrNumber;

  /**
   * Actual max width
   * @default undefined
   */
  maxHeight?: StyleStringOrNumber;

  /**
   * Actual min width
   * @default undefined
   */
  minHeight?: StyleStringOrNumber;

  /**
   * Using border
   * @default undefined
   */
  border?: boolean;

  /**
   * Overwrite background color with theme
   */
  colorTheme?: Colors;

  /**
   * Overwrite border color with theme
   */
  borderColorTheme?: Colors;

  /**
   * Using justify content
   * @default undefined
   */
  justifyContent?: JustifyContent;

  /**
   * Set true for using alignItems = 'center'
   * @default undefined
   */
  middle?: boolean;

  /**
   * Using shadow
   * @default undefined
   */
  shadow?: keyof typeof ShadowLight;

  /**
   * Overwrite style for Block
   * @default undefined
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Children for Block
   * @default undefined
   */
  children?: React.ReactNode;
}
