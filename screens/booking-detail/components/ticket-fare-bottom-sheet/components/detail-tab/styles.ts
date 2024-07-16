import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          paddingBottom: bottom,
          // paddingTop: StyleSheet.hairlineWidth * 3,
          paddingTop: 12,
        },
      }),
    [bottom],
  );
};
