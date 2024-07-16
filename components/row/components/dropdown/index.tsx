/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, BottomSheet, Icon, Text } from '@vna-base/components';
import { ListRef, ListRenderItemParams } from '@vna-base/components/bottom-sheet/type';
import { CommonProps, Dropdown as DropdownType } from '@vna-base/components/row/type';
import { ActiveOpacity, SnapPoint } from '@vna-base/utils';

import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable } from 'react-native';
import { useStyles } from './styles';
import { useTheme } from '@theme';

export function Dropdown(props: DropdownType & CommonProps) {
  const {
    t18n,
    typeDetails,
    t18nAll = 'common:all',
    snapPoint = [SnapPoint['50%']],
    disable,
    fixedTitleFontStyle,
    colorThemeValue,
    t18nBottomSheet = 'booking:journey_type',
    ValueView,
    removeAll,
    titleFontStyle,
    numberOfLines = 2,
    colorTheme = 'neutral100',
    value,
    onChange,
    leftIcon,
    leftIconColorTheme = 'primary500',
    leftIconSize = 24,
  } = props;

  const styles = useStyles();
  const { colors } = useTheme();
  const bottomSheetRef = useRef<ListRef<any>>(null);

  const _ValueView = useCallback(
    (val: any) => {
      if (ValueView) {
        return ValueView(val);
      }

      return (
        <>
          {/* @ts-ignore */}
          {typeDetails[val as T]?.icon && (
            <Icon
              //@ts-ignore
              icon={typeDetails[val as T].icon}
              //@ts-ignore
              colorTheme={typeDetails[val as T]?.iconColorTheme}
              size={16}
            />
          )}
          <Block>
            <Text
              numberOfLines={numberOfLines}
              fontStyle="Body14Reg"
              colorTheme={colorThemeValue ?? 'neutral900'}
              //@ts-ignore
              t18n={typeDetails[val as T]?.t18n}
            />
          </Block>
        </>
      );
    },
    [ValueView, colorThemeValue, numberOfLines, typeDetails],
  );

  const onPicDone = useCallback(
    (val: any, cb?: () => void) => {
      onChange(val?.key);
      cb?.();
    },
    [onChange],
  );

  const dataBottomSheet = useMemo(() => {
    if (removeAll) {
      return Object.values(typeDetails);
    }

    return [
      {
        t18n: t18nAll,
        key: null,
      } as any,
    ].concat(Object.values(typeDetails));
  }, [removeAll, t18nAll, typeDetails]);

  const renderItem = useCallback(
    ({ item, selected: _selected, onPress }: ListRenderItemParams<any>) => {
      //@ts-ignore
      const isSelected = _selected?.key === item?.key;

      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          style={[
            styles.statusItemContainer,
            isSelected && styles.selectedStatusItemContainer,
          ]}
          onPress={onPress}>
          {/* @ts-ignore */}
          {item.icon && (
            // @ts-ignore
            <Icon icon={item.icon} colorTheme={item.iconColorTheme} size={19} />
          )}
          <Text
            fontStyle={isSelected ? 'Title16Semi' : 'Body16Reg'}
            colorTheme={isSelected ? 'neutral900' : 'neutral800'}
            // @ts-ignore
            t18n={item?.t18n}
          />
          <Block
            position="absolute"
            pointerEvents="none"
            width={24}
            height={24}
            right={16}>
            {isSelected && (
              <Icon icon="checkmark_fill" colorTheme="primary600" size={24} />
            )}
          </Block>
        </TouchableOpacity>
      );
    },
    [styles.selectedStatusItemContainer, styles.statusItemContainer],
  );

  return (
    <>
      <Pressable
        style={[styles.container, { backgroundColor: colors[colorTheme] }]}
        onPress={() => {
          bottomSheetRef.current?.present(
            value ? typeDetails[value] : undefined,
          );
        }}>
        <Block flexDirection="row" columnGap={8} alignItems="center">
          {leftIcon && (
            <Icon
              icon={leftIcon}
              size={leftIconSize}
              colorTheme={leftIconColorTheme}
            />
          )}
          <Text
            t18n={t18n}
            fontStyle={
              titleFontStyle ??
              (!fixedTitleFontStyle && value ? 'Title16Semi' : 'Body16Reg')
            }
            colorTheme="neutral900"
          />
        </Block>

        <Block style={styles.rightContainer}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            {value ? (
              _ValueView(value)
            ) : (
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral700"
                t18n={t18nAll}
              />
            )}
            {!disable && (
              <Icon
                icon="arrow_ios_right_outline"
                colorTheme={value ? 'neutral900' : 'neutral700'}
                size={20}
              />
            )}
          </Block>
        </Block>
      </Pressable>
      {!disable && (
        <BottomSheet<any>
          ref={bottomSheetRef}
          type="list"
          keyExtractor={(_, idx) => idx.toString()}
          data={dataBottomSheet}
          renderItem={renderItem}
          oneStep={true}
          t18nTitle={t18nBottomSheet}
          onDone={onPicDone}
          snapPoints={snapPoint}
          showSearchInput={false}
        />
      )}
    </>
  );
}
