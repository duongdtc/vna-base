import { StyleSheet } from 'react-native';

import { ColorLight } from '@theme/color';
import { HairlineWidth } from '@vna-base/utils';

const DIMENSIONS = { width: 16, height: 16 };

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  outline: {
    ...DIMENSIONS,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: HairlineWidth,
    borderColor: ColorLight.primary,
    borderRadius: 1,
  },
  fill: {
    width: DIMENSIONS.width - 4,
    height: DIMENSIONS.height - 4,
    backgroundColor: ColorLight.primary,
  },
  label: {
    paddingLeft: 8,
  },
});
