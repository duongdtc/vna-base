import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  // state
  const { top } = useSafeAreaInsets();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        logoContainer: {
          left: 0,
          right: 0,
          zIndex: -1,
          top: 0,
          paddingTop: scale(20),
        },
        logo: {
          width: scale(132),
          height: scale(16),
        },
        avatarAndNameContainer: {
          marginTop: scale(54),
          marginLeft: scale(8),
          width: '100%',
          flexDirection: 'row',
          columnGap: scale(8),
        },
        top: { marginTop: top },
        btn: { position: 'absolute', top: 12 },
      }),
    [top],
  );
};
