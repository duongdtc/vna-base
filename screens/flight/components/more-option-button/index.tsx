import { Button } from '@vna-base/components';
import { MoreOptionButtonProps } from '@vna-base/screens/flight/type';
import { scale } from '@vna-base/utils';
import React from 'react';
import { StyleSheet } from 'react-native';

export const MoreOptionButton = ({
  textColorTheme,
  onPress,
}: MoreOptionButtonProps) => {
  return (
    <Button
      leftIcon="options_2_fill"
      textColorTheme={textColorTheme}
      leftIconSize={20}
      t18n="flight:more_options"
      fullWidth
      onPress={onPress}
      buttonColorTheme="neutral20"
      buttonStyle={styles.btnMore}
    />
  );
};

const styles = StyleSheet.create({
  btnMore: { marginHorizontal: scale(16), marginTop: scale(16) },
});
