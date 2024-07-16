import { IconTypes } from '@assets/icon';
import { Block, Icon, Text } from '@components';
import { BlockProps } from '@components/block/type';
import { Colors } from '@theme';
import { FontStyle } from '@theme/typography';
import { I18nKeys } from '@translations/locales';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';

type Props = {
  icon?: IconTypes;
  iconSize?: number;
  iconColorTheme?: keyof Colors;
  t18n?: I18nKeys;
  fontStyle?: FontStyle;
  colorThemeT18n?: keyof Colors;
  customeDescription?: React.ReactNode;
} & BlockProps;

export const DescriptionsBooking = memo((props: Props) => {
  const {
    icon = 'alert_circle_fill',
    iconSize = 16,
    iconColorTheme = 'neutral800',
    t18n,
    fontStyle = 'Body12Reg',
    colorThemeT18n = 'neutral900',
    customeDescription,
    ...blockProps
  } = props;
  return (
    <Block
      padding={12}
      colorTheme="neutral100"
      borderRadius={8}
      flexDirection="row"
      alignItems="center"
      columnGap={12}
      {...blockProps}>
      {icon && <Icon icon={icon} size={iconSize} colorTheme={iconColorTheme} />}
      <Block flex={1}>
        {customeDescription ?? (
          <Text t18n={t18n} fontStyle={fontStyle} colorTheme={colorThemeT18n} />
        )}
      </Block>
    </Block>
  );
}, isEqual);
