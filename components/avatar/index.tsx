import { Image } from '@vna-base/components';
import { onCheckType, scale } from '@vna-base/utils';
import React from 'react';
import { Pressable, StyleProp } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useStyles } from './style';

export const Avatar = ({
  // dùng cho animated size
  shareValue,
  size = scale(36),
  source,
  styleAvatar,
  onPress,
}: {
  source: string | number | Record<string, unknown>;
  shareValue?: SharedValue<number>;
  size?: number;
  styleAvatar?: StyleProp<ImageStyle>;
  onPress?: () => void;
}) => {
  const styles = useStyles();

  const avatarStyles = useAnimatedStyle(() => ({
    width: shareValue?.value,
    height: shareValue?.value,
  }));

  return (
    <Pressable onPress={onPress} pointerEvents={onPress ? 'auto' : 'none'}>
      {shareValue ? (
        <Animated.Image
          style={[styles.avatar, avatarStyles]}
          resizeMode="cover"
          source={
            onCheckType(source, 'string')
              ? { uri: source as string }
              : (source as unknown as number | Record<string, unknown>)
          }
        />
      ) : (
        <Image
          source={source}
          style={[styles.avatar, { width: size, height: size }, styleAvatar]}
          resizeMode="cover"
        />
      )}
    </Pressable>
  );
};
