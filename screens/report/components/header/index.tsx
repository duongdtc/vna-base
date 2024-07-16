import { images } from '@assets/image';
import { Button, Image, NormalHeaderGradient } from '@vna-base/components';
import { useDrawer } from '@navigation/navigation-service';
import { ColorLight } from '@theme/color';
import { HitSlop } from '@vna-base/utils';
import React from 'react';
import { useStyles } from './styles';

export const Header = () => {
  const { open } = useDrawer();
  const styles = useStyles();

  return (
    <NormalHeaderGradient
      zIndex={99}
      leftContent={
        <Button
          hitSlop={HitSlop.Large}
          leftIcon="menu_2_outline"
          leftIconSize={24}
          textColorTheme="classicWhite"
          onPress={open}
          padding={4}
        />
      }
      centerContent={
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="center"
          tintColor={ColorLight.classicWhite}
        />
      }
    />
  );
};
