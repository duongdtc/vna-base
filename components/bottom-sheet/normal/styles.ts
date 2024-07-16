import { useTheme } from '@theme';
import { scale } from '@utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderTopLeftRadius: scale(12),
          borderTopRightRadius: scale(12),
          overflow: 'hidden',
          flex: 1,
        },
        bgContainer: {
          backgroundColor: colors.neutral100,
        },
        indicatorContainer: {
          width: '100%',
          height: scale(5),
          marginBottom: scale(4),
          flexDirection: 'row',
          justifyContent: 'center',
        },
        indicator: {
          width: scale(40),
          height: '100%',
          borderRadius: 4,
        },
        contentContainer: {},
        backdrop: {
          ...StyleSheet.absoluteFillObject,
        },
        shadow: {
          shadowColor: colors.classicBlack,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 4,
        },
      }),
    [colors],
  );
};
