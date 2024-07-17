import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectVerifiedFlights } from '@vna-base/redux/selector';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteItem } from './route-item';
import { useStyles, createStyleSheet } from '@theme';

export const InfoFareTab = () => {
  const { styles } = useStyles(styleSheet);

  const verifiedFlights = useSelector(selectVerifiedFlights);

  return (
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
      {verifiedFlights.map((item, index) => (
        <RouteItem item={item} key={`${index}_${item.Leg}`} />
      ))}
    </BottomSheetScrollView>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  contentContainer: { padding: spacings[12], rowGap: spacings[8] },
}));
