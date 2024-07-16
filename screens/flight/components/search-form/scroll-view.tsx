import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SearchFormProps } from '@vna-base/screens/flight/type';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';

export const ScrollView = memo(
  ({
    sharedValue,
    children,
  }: Pick<SearchFormProps, 'sharedValue'> & {
    children: React.ReactNode;
  }) => {
    const scrollHandler = useAnimatedScrollHandler(
      {
        onScroll: e => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sharedValue!.value = e.contentOffset.y;
        },
      },
      [],
    );

    if (sharedValue !== undefined) {
      return (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          onScroll={scrollHandler}>
          {children}
        </Animated.ScrollView>
      );
    }

    return (
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {children}
      </BottomSheetScrollView>
    );
  },
  isEqual,
);

const styles = StyleSheet.create({
  contentContainer: { paddingBottom: scale(30), paddingTop: 16 },
});
