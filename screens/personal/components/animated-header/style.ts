import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: { zIndex: 11 },
        logoContainer: {
          left: 0,
          right: 0,
          top: top + 20,
          position: 'absolute',
        },
        logo: {
          width: scale(132),
          height: scale(16),
          alignSelf: 'center',
        },
        avatarAndNameContainer: {
          marginTop: scale(54),
          marginLeft: scale(8),
          width: '100%',
          flexDirection: 'row',
          columnGap: scale(8),
        },
        top: { height: top, backgroundColor: colors.neutral300 },
        btn: { position: 'absolute', top: 12 },
        bottomHeader: {
          zIndex: 9,
          position: 'absolute',
          top: top + 20,
          left: 0,
          right: 0,
        },
        titleContainer: {
          flex: 1,
          justifyContent: 'center',
          height: scale(56),
          overflow: 'hidden',
        },
        infoInHeader: {
          flexDirection: 'row',
          columnGap: 4,
          alignItems: 'center',
        },
      }),
    [colors.neutral300, top],
  );
};
