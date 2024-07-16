import { WindowWidth } from '@vna-base/utils';
import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  View,
  ViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { PagerProps, PagerRef } from './type';
import { lightColors } from '@theme/unistyle-temp/colors/light';

export * from './pager-with-header';

export const Pager = memo(
  forwardRef(
    ({ renderScene = [] }: PagerProps, ref: ForwardedRef<PagerRef>) => {
      const scrollViewRef = useRef<ScrollView>(null);

      const changeTab = (index: number) => {
        scrollViewRef.current?.scrollTo({
          x: WindowWidth * index,
        });
      };

      useImperativeHandle(ref, () => ({
        changeTab,
      }));

      return (
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}>
          {renderScene.map(({ child, tabKey }, index) => (
            <View key={tabKey} style={{ width: WindowWidth }}>
              <Child
                changeTab={changeTab}
                child={child}
                lazy={index !== 0}
                lazyTime={50 * index}
              />
            </View>
          ))}
        </Animated.ScrollView>
      );
    },
  ),
  isEqual,
);

export const Child = memo(
  ({
    lazy = false,
    child,
    lazyTime = 500,
    onLayout,
    changeTab,
  }: {
    lazy?: boolean;
    child: (
      props: ViewProps & { changeTab?: (i: number) => void },
    ) => JSX.Element;
    lazyTime?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
    changeTab?: (i: number) => void;
  }) => {
    if (!lazy) {
      return child({ onLayout, changeTab });
    }

    return (
      <LazyLoadedComponent
        child={child({ onLayout, changeTab })}
        lazyTime={lazyTime}
      />
    );
  },
  () => true,
);

const LazyLoadedComponent = ({
  child,
  lazyTime,
}: {
  child: JSX.Element;
  lazyTime?: number;
}) => {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, lazyTime);

    return () => clearTimeout(timer);
  }, [child]);

  return showComponent ? (
    child
  ) : (
    <ActivityIndicator
      size="large"
      color={lightColors.primaryColor}
      style={{ alignSelf: 'center' }}
    />
  );
};
