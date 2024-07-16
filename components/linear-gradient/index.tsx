import { useStyles } from '@theme';
import React, { useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { GradientProps } from './type';

export const Index = ({
  style,
  type,
  children,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}: GradientProps) => {
  const {
    theme: { colors },
  } = useStyles();

  const dimension = useMemo(() => {
    let start_color = start;
    let end_color = end;
    switch (type) {
      case 'transparent':
        start_color = { x: 0, y: 0.4354 };
        end_color = { x: 0, y: 1 };
        break;
      case 'transparent_50':
        start_color = { x: 0, y: 0.4354 };
        end_color = { x: 0, y: 1 };
        break;
    }

    return { start_color, end_color };
  }, [end, start, type]);

  return (
    <LinearGradient
      start={dimension.start_color}
      end={dimension.end_color}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      colors={colors[type]}
      style={style}>
      {children}
    </LinearGradient>
  );
};
