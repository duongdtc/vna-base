import {
  BottomSheetModal,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_INPUT_MODE,
} from '@gorhom/bottom-sheet';
import { I18nKeys } from '@translations/locales';
import React, { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type BottomSheetProps<T = any> =
  | (NormalProps & CommonProps)
  | (ListProps<T> & CommonProps)
  | (ScreenProps & CommonProps);

export type CommonProps = {
  /**
   * default true
   */
  showIndicator?: boolean;
  showCloseButton?: boolean;
  showLineBottomHeader?: boolean;
  onDismiss?: () => void;
  onCancel?: () => void;

  t18nTitle?: I18nKeys;
  t18nDone?: I18nKeys;
  /**
   * default true
   */
  enablePanDownToClose?: boolean;
  style?: StyleProp<ViewStyle>;
  snapPoints?: (string | number)[];
  dismissWhenClose?: boolean;
  enableOverDrag?: boolean;
  overDragResistanceFactor?: number;
  /**
   * default false
   */
  useModal?: boolean;
  paddingBottom?: boolean;
  /**
   * Hàm này chạy khi ấn vào backdrop hoặc nút close
   */
  onPressBackDrop?: () => void;

  bottomInset?: number;
  detached?: boolean;
  disablePressBackDrop?: boolean;

  /**
   * use for detached in center. when u set true, bottomInset and detached can not use
   */
  detachedCenter?: boolean;
};

export type NormalProps = {
  type?: 'normal';
  typeBackDrop?: 'blur' | 'shadow' | 'gray';
  children: React.ReactNode;
  header?: React.ReactNode;
  onDone?: () => void;
  /**
   * default true, when u set false, u must past snapPoints
   */
  useDynamicSnapPoint?: boolean;
  /**
   * Defines keyboard input mode for Android only.
   * @link {https://developer.android.com/guide/topics/manifest/activity-element#wsoft}
   * @type `adjustPan` | `adjustResize`
   * @default `adjustPan`
   */
  android_keyboardInputMode?: keyof typeof KEYBOARD_INPUT_MODE;
  /**
   * Defines the keyboard appearance behavior.
   * @enum
   * - `interactive`: offset the sheet by the size of the keyboard.
   * - `extend`: extend the sheet to its maximum snap point.
   * - `fillParent`: extend the sheet to fill parent.
   * @type `interactive` | `extend` | `fillParent`
   * @default interactive on android
   * @default extend on ios
   */
  keyboardBehavior?: keyof typeof KEYBOARD_BEHAVIOR;

  /**
   * @default true
   */
  useTopInset?: boolean;
};

export type ScreenProps = {
  type?: 'screen';
  children: React.ReactNode;
};

export type ListProps<T = any> = {
  type?: 'list';
  data: Array<T>;
  renderItem: (p: ListRenderItemParams<T>) => ReactElement;
  onChangeText?: (text: string) => void;
  onDone: (val: T | undefined, cb?: () => void) => void;
  keyExtractor?: (item: T, index: number) => string;
  // selected?: T | undefined;
  ListEmptyComponent?: React.ReactElement | null | undefined;
  fieldSearch?: keyof T;
  separator?: React.ReactNode;
  oneStep?: boolean;
  showSearchInput?: boolean;
};

export type ListRef<T> = { present: (selected?: T) => void };

export type NormalRef = Pick<
  BottomSheetModal,
  'present' | 'close' | 'dismiss' | 'expand' | 'collapse'
>;

export type ListRenderItemParams<T> = {
  item: T;
  index: number;
  isTheFirst: boolean;
  isTheLast: boolean;
  selected?: T | undefined;
  onPress: () => void;
};
