import { scale } from '@utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  // result
  return useMemo(
    () =>
      StyleSheet.create({
        avatar: {
          borderRadius: scale(40),
        },
      }),
    [],
  );
};
