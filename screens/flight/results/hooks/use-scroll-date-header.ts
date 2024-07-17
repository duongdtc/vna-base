import { selectSearchForm } from '@vna-base/redux/selector';
import { WindowWidth, scale } from '@vna-base/utils';
import { useEffect } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

export const useScrollDateHeader = (
  headerRef: React.RefObject<Animated.FlatList<Date>>,
) => {
  const searchForm = useSelector(selectSearchForm);

  const opacityArrowLeft = useSharedValue(1);
  const opacityArrowRight = useSharedValue(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      headerRef.current?.scrollToOffset({
        animated: true,
        offset: 3.5 * scale(114) - WindowWidth / 2 + scale(24),
      });
    }, 50);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchForm]);

  const leftArrowStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    width: 24,
    justifyContent: 'center',
    height: '100%',
    opacity: opacityArrowLeft.value,
  }));

  const rightArrowStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    height: '100%',
    width: 24,
    opacity: opacityArrowRight.value,
  }));

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        const { contentOffset, layoutMeasurement, contentSize } = event;
        const scrollX = contentOffset.x;
        const isEndReached =
          scrollX + layoutMeasurement.width >= contentSize.width;

        if (scrollX <= 0) {
          opacityArrowLeft.value = withTiming(0, {
            duration: 100,
          });
        } else {
          opacityArrowLeft.value = withTiming(1, {
            duration: 100,
          });
        }

        if (isEndReached) {
          opacityArrowRight.value = withTiming(0, {
            duration: 100,
          });
        } else {
          opacityArrowRight.value = withTiming(1, {
            duration: 100,
          });
        }
      },
    },
    [],
  );

  return {
    leftArrowStyle,
    rightArrowStyle,
    scrollHandler,
  };
};
