// eslint-disable-next-line react-native/split-platform-components
import { Dimensions, Platform, PlatformIOSStatic } from 'react-native';
import { DISABLE_TEXT_SCALING } from '@env';

const { width, height } = Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 390;

const guidelineBaseHeight = 844;

const _scale = (size: number) =>
  Math.round((shortDimension / guidelineBaseWidth) * size);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verticalScale = (size: number) =>
  Math.round((longDimension / guidelineBaseHeight) * size);

export const scale = (size: number, factor = 0.5) =>
  Number(DISABLE_TEXT_SCALING) ? size : size + (_scale(size) - size) * factor;

export const isIPad = () => {
  if (Platform.OS === 'ios') {
    const platformIOS = Platform as PlatformIOSStatic;
    return platformIOS.isPad;
  }

  return false;
};

export const WindowWidth = width;
export const WindowHeight = height;
export const ScreenWidth = screenWidth;
export const ScreenHeight = screenHeight;
