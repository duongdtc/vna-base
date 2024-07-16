import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { execFunc } from '@utils';

import { styles } from './styles';
import { CheckboxProps } from './type';

import { Icon } from '@components/icon';

export const CheckBox = ({
  // text,
  // t18n,
  value,
  style,
  // fillStyle,
  // outlineStyle: outlineStyleOverwrite,
  onToggle,
  hitSlop,
  disable = false,
  initialValue = false,
  size = 24,
  checkedColorTheme = 'primary500',
  uncheckColorTheme = 'neutral50',
}: CheckboxProps) => {
  // state
  const [localValue, setLocalValue] = useState<boolean>(initialValue);

  // const progress = useSharedTransition(value ?? localValue);

  // const scale = useMix(progress, 0, 1);

  // const opacity = useMix(progress, 0, 1);

  // function
  const onPress = useCallback(() => {
    if (typeof value === 'boolean') {
      execFunc(onToggle, !value);
    } else {
      execFunc(onToggle, !localValue);

      setLocalValue(v => !v);
    }
  }, [localValue, onToggle, value]);

  // reanimated style
  // const styleAnimated = useAnimatedStyle(() => ({
  //   opacity: opacity.value,
  //   transform: [{ scale: scale.value }],
  // }));

  // render
  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      activeOpacity={1}
      disabled={disable}
      onPress={onPress}
      style={[styles.root, style]}>
      {/* <>
        <View style={[styles.outline, outlineStyleOverwrite]}>
          <Animated.View style={[styles.fill, fillStyle, styleAnimated]} />
        </View>
        <Text text={text} t18n={t18n} style={styles.label} />
      </> */}
      <Icon
        icon={value ? 'checkmark_square_fill' : 'checkmark_square_non_fill'}
        size={size}
        colorTheme={value ? checkedColorTheme : uncheckColorTheme}
      />
    </TouchableOpacity>
  );
};
