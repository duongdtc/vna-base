import { Child } from '@vna-base/components';
import { PagerProps, SceneWithTitle } from '@vna-base/components/pager/type';
import { WindowWidth } from '@vna-base/utils';
import { useSharedTransition } from '@vna-base/utils/animated';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/reanimated2/component/ScrollView';
import { useStyles } from './styles';
import { TitleContainer } from './title-container';
import { TitleContainerRef } from './title-container/type';

export const PagerWithHeader = memo(
  ({
    renderScene = [],
    style,
    onChangeTab,
    initTab = 0,
  }: PagerProps<SceneWithTitle>) => {
    const styles = useStyles();
    const scrollViewRef = useRef<AnimatedScrollView>(null);
    const heightChildren = useRef(Array(renderScene.length).fill(0));
    const mountedCount = useRef(0);
    const [mountedState, setMountedState] = useState(false);
    const currentIndex = useRef(0);

    const titleContainerRef = useRef<TitleContainerRef>(null);
    const sharedValuePager = useSharedTransition(0, { duration: 0 });

    const childWidth = useMemo(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      () => WindowWidth - (style?.paddingHorizontal ?? 0) * 2,
      [style],
    );

    const changeTab = useCallback(
      (index: number) => {
        currentIndex.current = index;
        sharedValuePager.value = withTiming(heightChildren.current[index], {
          duration: 150,
        });
        scrollViewRef.current?.scrollTo({
          x: childWidth * index,
        });

        onChangeTab?.(index);
        titleContainerRef.current?.changeTab(index);
      },
      [childWidth, onChangeTab, sharedValuePager],
    );

    const animatedOptionStyle = useAnimatedStyle(
      () => ({
        height: sharedValuePager.value || undefined,
      }),
      [],
    );

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (mountedState) {
        timer = setTimeout(() => {
          changeTab(initTab);
        }, 500);
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [changeTab, initTab, mountedState]);

    return (
      <Animated.View style={[styles.container, style]}>
        <TitleContainer
          ref={titleContainerRef}
          titles={renderScene.map(scene => ({
            t18n: scene.t18n,
            disable: scene.disable,
          }))}
          onClick={changeTab}
          widthTab={childWidth}
        />
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          decelerationRate="normal"
          style={animatedOptionStyle}
          showsHorizontalScrollIndicator={false}>
          {renderScene.map(({ child, tabKey, disable }, index) =>
            disable ? null : (
              <View key={tabKey} style={{ width: childWidth }}>
                <Child
                  changeTab={changeTab}
                  child={child}
                  lazy={index !== 0}
                  lazyTime={50 * index}
                  onLayout={e => {
                    if (mountedCount.current < renderScene.length) {
                      heightChildren.current[index] =
                        e.nativeEvent.layout.height;
                      mountedCount.current++;
                      if (mountedCount.current === renderScene.length) {
                        setMountedState(true);
                      }
                    } else if (index === 2 && currentIndex.current === 2) {
                      heightChildren.current[index] =
                        e.nativeEvent.layout.height;
                      sharedValuePager.value = withTiming(
                        e.nativeEvent.layout.height,
                        {
                          duration: 150,
                        },
                      );
                    }
                  }}
                />
              </View>
            ),
          )}
        </Animated.ScrollView>
      </Animated.View>
    );
  },
  (pre, next) => pre.initTab === next.initTab,
);
