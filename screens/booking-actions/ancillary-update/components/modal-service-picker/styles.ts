import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        itemContainer: {
          paddingVertical: scale(12),
          flexDirection: 'row',
          alignItems: 'center',
        },
        contentContainer: {
          paddingHorizontal: scale(12),
        },
        checkBox: { position: 'absolute', right: 0, alignSelf: 'center' },
        footerContainer: { paddingBottom: bottom },
        btn: { margin: scale(12) },
      }),
    [bottom],
  );
};
