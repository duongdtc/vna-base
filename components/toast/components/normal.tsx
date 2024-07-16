/* eslint-disable react-native/no-unused-styles */
import { Block } from '@vna-base/components/block';
import { Icon } from '@vna-base/components/icon';
import { Text } from '@vna-base/components/text';
import { useTheme } from '@theme';
import { Opacity } from '@theme/color';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ToastConfigParams } from 'react-native-toast-message';
import { NormalProps } from '../type';
import { WindowWidth } from '@vna-base/utils';

export const Normal = ({
  props: { icon, color, t18n, text },
  onPress,
}: ToastConfigParams<NormalProps>) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Block
        borderRadius={8}
        padding={2}
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        style={{ backgroundColor: color }}>
        <Icon icon={icon} size={20} colorTheme="white" />
      </Block>
      <Block flex={1}>
        <Text
          fontStyle="Body16Reg"
          colorTheme="neutral100_old"
          t18n={t18n}
          text={text}
          numberOfLines={2}
          ellipsizeMode="tail"
        />
      </Block>
    </TouchableOpacity>
  );
};

const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral900 + Opacity[80],
          borderRadius: 12,
          paddingVertical: 12,
          paddingLeft: 20,
          paddingRight: 10,
          columnGap: 8,
          flexDirection: 'row',
          alignItems: 'center',
          maxWidth: WindowWidth - 16,
        },
      }),
    [colors.neutral900],
  );
};
