import React from 'react';
import { EmptyListProps } from './type';
import { Text, Block } from '@vna-base/components';
import { images } from '@assets/image';
import { Image } from 'react-native';

export const EmptyList = (props: EmptyListProps) => {
  const {
    t18nTitle = 'common:no_result',
    t18nSubtitle,
    colorThemeTitle = 'primary600',
    colorThemeSubtitle = 'neutral600',
    fontStyleTitle = 'Title16Semi',
    fontStyleSubtitle = 'Body12Reg',
    image = 'emptyListFlight',
    imageStyle,
    // imageContainerStyle,
    ...blockProps
  } = props;

  return (
    <Block
      alignItems="center"
      width={'100%'}
      justifyContent="center"
      {...blockProps}>
      {image && imageStyle && (
        <Block marginBottom={12}>
          <Image
            source={images[image]}
            style={imageStyle}
            // containerStyle={imageContainerStyle}
          />
        </Block>
      )}
      <Text
        t18n={t18nTitle}
        fontStyle={fontStyleTitle}
        colorTheme={colorThemeTitle}
      />
      {t18nSubtitle && (
        <Text
          style={{ marginTop: 4 }}
          t18n={t18nSubtitle}
          fontStyle={fontStyleSubtitle}
          colorTheme={colorThemeSubtitle}
        />
      )}
    </Block>
  );
};
