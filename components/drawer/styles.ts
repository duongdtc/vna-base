import { WindowHeight, WindowWidth, scale } from '@vna-base/utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    maxWidth: scale(400),
    height: WindowHeight,
    alignSelf: 'flex-end',
    width: (9 * WindowWidth) / 10,
  },
});
