import React from 'react';
import { Pressable } from 'react-native';
import { useStyles } from '../../styles';
import { CommonProps, Nav as NavProps } from '@vna-base/components/row/type';
import { useTheme } from '@theme';
import { Text } from '@vna-base/components/text';
import { Icon } from '@vna-base/components/icon';
import { scale } from '@vna-base/utils';
import { Block } from '@vna-base/components/block';

export const Nav = (props: NavProps & CommonProps) => {
  const {
    disable,
    colorTheme,
    onPress,
    t18n,
    titleFontStyle,
    fixedTitleFontStyle,
    leftIcon,
    leftIconColorTheme = 'neutral900',
    leftIconSize = 24,
    rightIcon = 'arrow_ios_right_outline',
    rightIconColorTheme = 'neutral900',
    rightIconSize = 20,
  } = props;
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      disabled={disable}
      style={[
        styles.container,
        { justifyContent: 'space-between', paddingRight: scale(12) },
        colorTheme && { backgroundColor: colors[colorTheme] },
      ]}
      onPress={onPress}>
      <Block flexDirection="row" columnGap={8} alignItems="center">
        {leftIcon && (
          <Icon
            icon={leftIcon}
            size={leftIconSize}
            colorTheme={leftIconColorTheme}
          />
        )}
        <Text
          t18n={t18n}
          colorTheme="neutral900"
          fontStyle={
            titleFontStyle ??
            (!fixedTitleFontStyle ? 'Title16Semi' : 'Body16Reg')
          }
        />
      </Block>
      <Icon
        icon={rightIcon}
        size={rightIconSize}
        colorTheme={rightIconColorTheme}
      />
    </Pressable>
  );
};
