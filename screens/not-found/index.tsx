import { Block, Button, Image, Screen, Text } from '@vna-base/components';
import React from 'react';
import { goBack } from '@navigation/navigation-service';
import { images } from '@assets/image';
import { createStyleSheet, useStyles } from '@theme';
import { UnistylesRuntime } from 'react-native-unistyles';
import { scale } from '@vna-base/utils';

export const NotFound = () => {
  const { styles } = useStyles(styleSheet);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <Block flex={1} justifyContent="center" alignItems="center" rowGap={16}>
        <Image
          source={images[404]}
          resizeMode="contain"
          containerStyle={styles.img}
        />
        <Text
          t18n="common:coming_soon"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
        <Text
          t18n="common:coming_soon_subtitle"
          fontStyle="Body14Reg"
          colorTheme="neutral800"
        />
      </Block>
      <Block style={styles.footerContainer}>
        <Button
          fullWidth
          size="medium"
          t18n="common:back"
          textColorTheme="neutral900"
          textFontStyle="Body14Semi"
          buttonColorTheme="neutral50"
          onPress={() => {
            goBack();
          }}
        />
      </Block>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, shadows }) => ({
  container: {
    backgroundColor: colors.neutral30,
  },
  footerContainer: {
    padding: scale(12),
    paddingBottom: UnistylesRuntime.insets.bottom + 12,
    columnGap: scale(12),
    flexDirection: 'row',
    backgroundColor: colors.neutral10,
    ...shadows.main,
  },
  img: {
    width: scale(268),
    height: scale(138),
  },
}));
