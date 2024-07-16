/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, TextInput, View } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '@vna-base/components';
import {
  ArgsChangeRange,
  RangeSelectorDurationProps,
} from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { convertMin2Hour, onCheckType, scale } from '@vna-base/utils';
import {
  sharedClamp,
  sharedMax,
  sharedSub,
  sharedTiming,
  useInterpolate,
  useMin,
} from '@vna-base/utils/animated';

const LOWER_BOUND = 0;
const UPPER_BOUND = scale(100);
const THUMB_WIDTH = scale(24);
const THUMB_HEIGHT = scale(24);
const AVAILABLE_AREA = scale(30);

export const RangeSelectorDuration = forwardRef(
  (
    { onChangeRange, initialRange, duration }: RangeSelectorDurationProps,
    ref,
  ) => {
    if (LOWER_BOUND >= UPPER_BOUND) {
      throw Error('lowerBound must be less than upperBound');
    }

    if (!onCheckType(onChangeRange, 'function')) {
      throw Error('onChangeRange must be function');
    }

    if (initialRange?.some(x => x > UPPER_BOUND || x < LOWER_BOUND)) {
      throw Error('initialRange must be within range');
    }

    if (initialRange!.length < 2) {
      throw Error('initialRange must be format [min,max]');
    }

    const valueRef = useRef<TextInput>(null);
    const { styles } = useStyles(styleSheet);

    const range = useMemo(
      () => duration.max - duration.min,
      [duration.max, duration.min],
    );

    const resultChange = useSharedValue<ArgsChangeRange>({
      lower: 0,
      upper: 0,
    });

    const translationLeftX = useSharedValue(0);
    const translationRightX = useSharedValue(0);

    const [width, setWidth] = useState<number>(0);

    const maxLeft = useMemo(
      () =>
        parseFloat(
          (
            ((initialRange[1] - LOWER_BOUND) * width) /
            (UPPER_BOUND - LOWER_BOUND)
          ).toFixed(0),
        ),
      [initialRange, width],
    );

    const minRight = useMemo(
      () =>
        parseFloat(
          (
            ((initialRange[0] - LOWER_BOUND) * width) /
            (UPPER_BOUND - LOWER_BOUND)
          ).toFixed(0),
        ),
      [initialRange, width],
    );
    // reanimated

    const translateLeftX = useDerivedValue(() =>
      sharedClamp(translationLeftX.value, 0, maxLeft),
    );

    const translateRightX = useDerivedValue(() =>
      sharedClamp(translationRightX.value, minRight, width),
    );

    const leftThumbValue = useInterpolate(
      translateLeftX,
      [0, width],
      [LOWER_BOUND, UPPER_BOUND],
    );

    const rightThumbValue = useInterpolate(
      translateRightX,
      [0, width],
      [LOWER_BOUND, UPPER_BOUND],
    );

    const leftTrack = useMin(translateLeftX, translateRightX);

    const rightTrack = useDerivedValue(() =>
      sharedSub(
        width - THUMB_WIDTH,
        sharedMax(translateLeftX.value, translateRightX.value),
      ),
    );

    // function
    const onFinalize = () => {
      'worklet';
      if (onChangeRange) {
        runOnJS(onChangeRange)({ ...resultChange.value });
      }
    };

    const gestureHandlerThumbLeft = Gesture.Pan()
      .onChange(e => {
        'worklet';
        translationLeftX.value += e.changeX;
      })
      .onFinalize(onFinalize);

    const gestureHandlerThumbRight = Gesture.Pan()
      .onChange(e => {
        'worklet';
        translationRightX.value += e.changeX;
      })
      .onFinalize(onFinalize);

    const _onLayout = useCallback(
      ({
        nativeEvent: {
          layout: { width: widthWrap },
        },
      }: LayoutChangeEvent) => {
        setWidth(widthWrap);
      },
      [],
    );

    const runAnimation = useCallback(
      (lowerValue: number, upperValue: number) => {
        const percentLeft =
          (lowerValue - LOWER_BOUND) / (UPPER_BOUND - LOWER_BOUND);

        const percentRight =
          (upperValue - LOWER_BOUND) / (UPPER_BOUND - LOWER_BOUND);

        const left = parseFloat((percentLeft * width).toFixed(0));

        const right = parseFloat((percentRight * width).toFixed(0));

        translationLeftX.value = sharedTiming(left);
        translationRightX.value = sharedTiming(right);
      },
      [translationLeftX, translationRightX, width],
    );

    const calText = useCallback(
      ({ value1, value2 }: { value1: number; value2: number }) => {
        valueRef.current?.setNativeProps({
          text: `${convertMin2Hour(
            duration.min + Math.floor((range * value1) / 100),
          )} - ${convertMin2Hour(
            duration.min + Math.ceil((range * value2) / 100),
          )}`,
        });
      },
      [range],
    );

    // effect
    useAnimatedReaction(
      () => ({ v1: leftThumbValue.value, v2: rightThumbValue.value }),
      res => {
        const value1 = parseFloat(res.v1.toFixed(0));

        const value2 = parseFloat(res.v2.toFixed(0));

        runOnJS(calText)({ value1, value2 });

        resultChange.value = {
          lower: value1,
          upper: value2,
        };
      },
    );

    useEffect(() => {
      if (width !== 0) {
        runAnimation(initialRange[0], initialRange[1]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    useEffect(() => {
      if (onChangeRange) {
        onChangeRange({
          lower: initialRange[0],
          upper: initialRange[1],
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setRange: (args: ArgsChangeRange) => {
          runAnimation(args.lower, args.upper);
        },
      }),
      [runAnimation],
    );

    // reanimated style
    const trackStyle = useAnimatedStyle(() => ({
      left: leftTrack.value,
      right: rightTrack.value,
    }));

    const thumbLeftStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateLeftX.value }],
    }));

    const thumbRightStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateRightX.value }],
    }));

    // render
    return (
      <View style={[bs.paddingVertical_16, bs.rowGap_8]}>
        <View style={styles.titleContainer}>
          <Text
            fontStyle="Body14Reg"
            colorTheme="neutral80"
            t18n="common:from"
          />
          <View style={styles.valueContainer}>
            <TextInput
              ref={valueRef}
              style={styles.valueTxt}
              defaultValue="0 - 0"
            />
          </View>
        </View>
        <View onLayout={_onLayout} style={styles.barContainer}>
          <View style={styles.trackContainer}>
            <Animated.View style={[styles.track, trackStyle]} />
          </View>
          <View style={styles.scaleMarkingContainer}>
            <View style={styles.scaleMarking} />
            <View style={styles.scaleMarking} />
            <View style={styles.scaleMarking} />
            <View style={styles.scaleMarking} />
            <View style={styles.scaleMarking} />
          </View>
          <GestureDetector gesture={gestureHandlerThumbLeft}>
            <Animated.View
              style={[styles.thumb, styles.thumbLeft, thumbLeftStyle]}>
              <View style={styles.thumbCore} />
            </Animated.View>
          </GestureDetector>
          <GestureDetector gesture={gestureHandlerThumbRight}>
            <Animated.View
              style={[styles.thumb, styles.thumbRight, thumbRightStyle]}>
              <View style={styles.thumbCore} />
            </Animated.View>
          </GestureDetector>
        </View>
        <View style={styles.maxMinContainer}>
          <Text
            fontStyle="Body12Reg"
            colorTheme="neutral90"
            text={convertMin2Hour(duration.min)}
          />
          <Text
            fontStyle="Body12Reg"
            colorTheme="neutral90"
            text={convertMin2Hour(duration.max)}
          />
        </View>
      </View>
    );
  },
);

const styleSheet = createStyleSheet(
  ({ colors, spacings, borders, shadows, textPresets }) => ({
    wrapTrack: {
      overflow: 'hidden',
      flex: 1,
      height: spacings[4],
    },
    thumb: {
      overflow: 'visible',
      position: 'absolute',
      padding: AVAILABLE_AREA,
    },
    thumbLeft: {
      left: -THUMB_WIDTH - AVAILABLE_AREA,
      paddingRight: 0,
    },
    thumbRight: {
      left: 0,
      paddingLeft: 0,
    },
    track: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      backgroundColor: colors.primaryColor,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    valueContainer: {
      flexDirection: 'row',
      columnGap: spacings[4],
      alignItems: 'center',
    },
    valueTxt: {
      color: colors.primaryColor,
      ...textPresets.Body14Semi,
      lineHeight: scale(16),
    },
    scaleMarkingContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: -2,
      right: -2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    scaleMarking: {
      height: '100%',
      width: spacings[2],
      backgroundColor: colors.neutral10,
    },
    thumbCore: {
      borderRadius: scale(28),
      borderColor: colors.neutral10,
      borderWidth: borders[10],
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      backgroundColor: colors.primaryColor,
      ...shadows.small,
    },
    maxMinContainer: {
      zIndex: -1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    barContainer: {
      marginHorizontal: THUMB_WIDTH,
      height: spacings[20],
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    trackContainer: {
      overflow: 'hidden',
      flex: 1,
      height: spacings[4],
      backgroundColor: colors.neutral30,
    },
  }),
);

export type SliderRange = {
  setRange: (args: ArgsChangeRange) => void;
};
