import { createStyleSheet, useStyles } from '@theme';
import { Icon } from '@vna-base/components';
import { scale } from '@vna-base/utils';
import React from 'react';
import { View } from 'react-native';

interface RatingProps {
  rate: number;
  maxStars?: number;
  size?: number;
}

export const Rating = ({ rate, size = scale(16) }: RatingProps) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= rate; i++) {
      stars.push(
        <Icon
          key={i}
          icon={i <= rate ? 'star_fill' : 'Noti_Money'}
          size={size}
          color={colors.secondColor}
        />,
      );
    }

    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styleSheet = createStyleSheet(() => ({
  container: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 4,
  },
}));
