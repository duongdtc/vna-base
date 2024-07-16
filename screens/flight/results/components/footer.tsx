import { Button } from '@vna-base/components';
import { selectIsCryptic } from '@redux-selector';
import { bs, createStyleSheet, useStyles } from '@theme';
import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Features } from './features';
import { Filter } from './filter';
import { Sort } from './sort';
import { scale } from '@vna-base/utils';

export const Footer = memo(
  () => {
    const { styles } = useStyles(styleSheet);
    const isCryptic = useSelector(selectIsCryptic);

    return isCryptic ? (
      <View style={styles.footerContainer}>
        <Button
          buttonStyle={bs.margin_12}
          t18n="flight:calculate_price"
          fullWidth
          size="medium"
          onPress={() => {}}
          buttonColorTheme="graPre"
          textColorTheme="white"
        />
      </View>
    ) : (
      <View style={styles.footerContainer}>
        <Sort />
        <View style={styles.separator} />
        <Features />
        <View style={styles.separator} />
        <Filter />
      </View>
    );
  },
  () => true,
);

const styleSheet = createStyleSheet(
  ({ colors, shadows, borders, spacings }) => ({
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.neutral10,
      paddingBottom: scale(40),
      ...shadows.main,
    },
    separator: {
      paddingVertical: spacings[8],
      width: borders[10],
      backgroundColor: colors.neutral40,
    },
  }),
);
