import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { ForwardedRef, forwardRef } from 'react';
import List from './list';
import Normal from './normal';
import {
  BottomSheetProps,
  CommonProps,
  ListProps,
  ListRef,
  NormalProps,
  ScreenProps,
} from './type';
import Screen from './screen';

function Index<T>(
  props: BottomSheetProps<T>,
  ref: ForwardedRef<BottomSheetModalMethods | ListRef<T>>,
) {
  const { type, ...subProps } = props;
  switch (type) {
    case 'list':
      return (
        <List<T>
          ref={ref}
          {...(subProps as ListProps<T> & CommonProps)}
          ListEmptyComponent={props?.ListEmptyComponent}
        />
      );

    case 'screen':
      return (
        <Screen
          ref={ref as ForwardedRef<BottomSheetModalMethods>}
          {...(subProps as ScreenProps & CommonProps)}
        />
      );

    default:
      return (
        <Normal
          ref={ref as ForwardedRef<BottomSheetModalMethods>}
          {...(subProps as NormalProps & CommonProps)}
        />
      );
  }
}

export const BottomSheet = forwardRef(Index);
