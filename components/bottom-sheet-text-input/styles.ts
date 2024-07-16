import { FontStyle } from '@theme/typography';
import { scale } from '@utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(10),
    columnGap: scale(6),
    ...FontStyle.Body12Reg,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
