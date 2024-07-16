import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { scale } from '@vna-base/utils';

export const useStyles = () => {
  // state

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        avatarImg: {
          width: scale(80),
          height: scale(80),
          borderRadius: scale(40),
        },
        editAvatarIcon: { padding: 1, bottom: -1 },
        nameVertical: { marginBottom: scale(8), marginTop: scale(16) },
      }),
    [],
  );
};
