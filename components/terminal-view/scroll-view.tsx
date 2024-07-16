import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTheme } from '@theme';
import React, { forwardRef, memo } from 'react';
import isEqual from 'react-fast-compare';
import { Platform, ScrollView as RNScrollView } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { TerminalViewProps } from './type';

export const ScrollView = memo(
  forwardRef<
    any,
    Pick<TerminalViewProps, 'useInBottomSheet'> & { children: React.ReactNode }
  >(({ useInBottomSheet, children }, ref) => {
    const { colors } = useTheme();

    if (!useInBottomSheet || Platform.OS === 'ios') {
      return <RNScrollView ref={ref}>{children}</RNScrollView>;
    }

    return (
      <BottomSheetScrollView>
        <ViewShot ref={ref} style={{ backgroundColor: colors.neutral100 }}>
          {children}
        </ViewShot>
      </BottomSheetScrollView>
    );
  }),
  isEqual,
);
