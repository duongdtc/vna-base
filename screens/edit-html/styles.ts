import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        editContainer: {
          marginTop: top + 20,
          paddingVertical: scale(20),
          paddingLeft: scale(16),
          paddingRight: scale(12),
          backgroundColor: colors.classicWhite,
          borderRadius: 8,
          overflow: 'hidden',
          marginHorizontal: scale(12),
          height: 400,
        },
        headerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        },
      }),
    [colors.classicWhite, top],
  );
};
