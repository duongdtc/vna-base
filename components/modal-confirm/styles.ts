import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          ...StyleSheet.absoluteFillObject,
        },

        subtitle: {
          marginTop: 2,
        },
        icon: { alignSelf: 'center', marginBottom: 12 },
      }),
    [],
  );
};
