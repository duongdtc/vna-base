import * as React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@theme';

export const FocusAwareStatusBar = ({ ...props }: StatusBarProps) => {
  // state
  const isFocused = useIsFocused();

  const { dark } = useTheme();

  // render
  return isFocused ? (
    <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} {...props} />
  ) : null;
};
