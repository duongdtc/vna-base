import { images } from '@assets/image';
import { BlockProps } from '@components/block/type';
import { Colors } from '@theme';
import { FontStyle } from '@theme/typography';
import { I18nKeys } from '@translations/locales';
import { StyleProp, ViewStyle, ImageStyle } from 'react-native';

export type EmptyListProps = {
  image?: keyof typeof images;
  t18nTitle?: I18nKeys;
  colorThemeTitle?: keyof Colors;
  fontStyleTitle?: FontStyle;
  t18nSubtitle?: I18nKeys;
  colorThemeSubtitle?: keyof Colors;
  fontStyleSubtitle?: FontStyle;
  imageStyle?: StyleProp<ImageStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
} & BlockProps;
