import { Segment } from '@services/axios/axios-ibe';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { Block, Text } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';

export const SegmentItem = memo(
  ({
    StartPoint,
    renderServiceItem,
    index: segmentIndex,
  }: Segment & {
    index: number;
    renderServiceItem: () => JSX.Element;
  }) => {
    const { styles } = useStyles(styleSheet);

    const startPoint = realmRef.current?.objectForPrimaryKey<AirportRealm>(
      AirportRealm.schema.name,
      StartPoint as string,
    );

    return (
      <Block>
        <Pressable disabled={true} style={styles.segmentHeader}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              text={`${segmentIndex + 1}. ${startPoint?.NameVi}`}
              fontStyle="Body14Semi"
              colorTheme="neutral80"
            />
          </Block>
        </Pressable>
        {renderServiceItem()}
      </Block>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  segmentHeader: {
    flexDirection: 'row',
    paddingVertical: spacings[12],
    paddingHorizontal: spacings[8],
    backgroundColor: colors.neutral20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: spacings[12],
  },
}));
