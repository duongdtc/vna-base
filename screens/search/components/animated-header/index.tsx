import { Block, Button, Icon } from '@vna-base/components';
import { useDebounce } from '@vna-base/hooks';
import { goBack } from '@navigation/navigation-service';
import { commonSearchActions } from '@vna-base/redux/action-slice';
import { useTheme } from '@theme';
import { ColorLight } from '@theme/color';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, WindowWidth, delay, dispatch } from '@vna-base/utils';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { selectLoadingCommonSearch } from '@vna-base/redux/selector';

const Timing = 200;
const InputMaxWidth = WindowWidth - 24 - 32 - 8;
const InputMinWidth = 32;

export const AnimatedHeader = memo(
  () => {
    const styles = useStyles();
    const { colors } = useTheme();

    const inputWidthSharedValue = useSharedValue(InputMinWidth);
    const positionCloseBtnSharedValue = useSharedValue(0);

    const [keyword, setKeyword] = useState('');
    const isLoading = useSelector(selectLoadingCommonSearch);

    const onSearch = useCallback(() => {
      dispatch(commonSearchActions.search(keyword));
    }, [keyword]);

    useDebounce(keyword, onSearch, 1000);

    const entering = useCallback(() => {
      positionCloseBtnSharedValue.value = withTiming(40, {
        duration: Timing,
      });

      inputWidthSharedValue.value = withTiming(InputMaxWidth, {
        duration: Timing,
      });
    }, []);

    const exiting = useCallback(async () => {
      positionCloseBtnSharedValue.value = withTiming(0, {
        duration: Timing,
      });

      inputWidthSharedValue.value = withTiming(InputMinWidth, {
        duration: Timing,
      });

      await delay(Timing);
      goBack();
    }, []);

    useEffect(() => {
      const timeId = setTimeout(() => {
        entering();
      }, 200);

      return () => {
        clearTimeout(timeId);
      };
    }, []);

    const closeButtonStyles = useAnimatedStyle(
      () => ({
        transform: [{ translateX: positionCloseBtnSharedValue.value }],
      }),
      [],
    );

    const inputStyles = useAnimatedStyle(
      () => ({
        width: inputWidthSharedValue.value,
        borderColor: interpolateColor(
          inputWidthSharedValue.value,
          [InputMinWidth, InputMaxWidth],
          [colors.neutral100, colors.neutral300],
        ),
      }),
      [],
    );

    const formatKeyword = (kw: string) => {
      const word = kw
        .replace(/[\s.]+/g, ' ')
        .replaceAll('Đ', 'D')
        .toUpperCase()
        .removeAccent();

      setKeyword(word);
    };

    return (
      <Block style={styles.container}>
        <Block style={styles.mainContainer}>
          <Block width={32} height={32} />
          <Animated.View style={[styles.closeBtn, closeButtonStyles]}>
            <Button
              padding={4}
              leftIcon="close_fill"
              textColorTheme="neutral900"
              leftIconSize={24}
              onPress={exiting}
            />
          </Animated.View>
          <Animated.View style={[styles.inputContainer, inputStyles]}>
            <Animated.View style={{ padding: 4 }}>
              <Icon icon="search_fill" size={24} colorTheme="info500" />
            </Animated.View>
            <Block flex={1} flexDirection="row">
              <TextInput
                style={styles.textInput}
                onChangeText={txt => formatKeyword(txt)}
                value={keyword}
                placeholder={translate('search:placeholder')}
                placeholderTextColor={styles.placeholder.color}
                onSubmitEditing={onSearch}
                autoFocus
              />
              <Block
                flexDirection="row"
                columnGap={2}
                right={4}
                position="absolute"
                alignItems="center"
                alignSelf="center">
                {isLoading && (
                  <Block
                    pointerEvents="none"
                    style={{
                      transform: [
                        {
                          scale: 0.6,
                        },
                      ],
                    }}>
                    <ActivityIndicator
                      size="small"
                      color={ColorLight.primary500}
                    />
                  </Block>
                )}
                {keyword && keyword !== '' && (
                  <Pressable
                    onPress={() => setKeyword('')}
                    hitSlop={HitSlop.Medium}>
                    <Icon
                      icon="close_circle_outline"
                      size={18}
                      colorTheme="neutral600"
                    />
                  </Pressable>
                )}
              </Block>
            </Block>
          </Animated.View>
        </Block>
      </Block>
    );
  },
  () => true,
);
