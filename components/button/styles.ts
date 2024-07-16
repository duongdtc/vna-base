import { HairlineWidth, scale } from '@vna-base/utils';
import { createStyleSheet } from 'react-native-unistyles';

export const styleSheet = createStyleSheet(() => ({
  outline_large: {
    borderWidth: HairlineWidth * 5,
  },
  outline_medium: {
    borderWidth: HairlineWidth * 4,
  },
  outline_small: {
    borderWidth: HairlineWidth * 3,
  },
  large_icon: {
    paddingVertical: scale(13),
    paddingHorizontal: scale(28),
  },
  large_leftIcon: { paddingLeft: scale(20) },
  large_rightIcon: {
    paddingRight: scale(20),
  },
  large_non_icon: {
    paddingVertical: scale(16),
    paddingHorizontal: scale(28),
  },
  medium_icon: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(24),
  },
  medium_leftIcon: { paddingLeft: scale(16) },
  medium_rightIcon: {
    paddingRight: scale(16),
  },
  medium_non_icon: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
  },
  small_icon: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
  },
  small_leftIcon: { paddingLeft: scale(10) },
  small_rightIcon: {
    paddingRight: scale(10),
  },
  small_non_icon: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
  },
  common: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
