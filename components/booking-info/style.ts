import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        logoContainer: {
          width: 90,
          height: 90,
          marginTop: -39,
          borderRadius: 45,
          padding: 6.4,
        },
        linearContainer: {
          width: 78,
          height: 78,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        },
        blockSvgUri: {
          width: 72,
          height: 72,
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },
        svgUriContainer: {
          width: 68,
          height: 68,
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        footerContainer: { marginTop: -4, marginBottom: 8 },
      }),
    [],
  );
};
