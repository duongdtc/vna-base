import { scale } from '@vna-base/utils';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  avatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    overflow: 'hidden',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    columnGap: scale(10),
  },
  agentNameContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(11),
  },
  agentInfoContainer: {
    padding: scale(16),
    paddingRight: scale(12),
    rowGap: 4,
  },
});
