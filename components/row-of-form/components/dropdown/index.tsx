/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, BottomSheet, Icon, Text } from '@vna-base/components';
import { ListRef, ListRenderItemParams } from '@vna-base/components/bottom-sheet/type';
import {
  CommonProps,
  Dropdown as DropdownType,
} from '@vna-base/components/row-of-form/type';
import { ActiveOpacity, SnapPoint } from '@utils';

import { SortType } from '@services/axios';
import React, { useCallback, useMemo, useRef } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useStyles } from './styles';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

export function Dropdown<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: DropdownType & CommonProps<TFieldValues, TName>) {
  const {
    control,
    name,
    t18n,
    hideBottomSheet,
    isRequire,
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
    onChangeValue,
    opacity = 1,
    showRightIcon = false,
  } = props;

  const styles = useStyles();
  const bottomSheetRef = useRef<ListRef<any>>(null);

  const {
    field: { value: filterValue, onChange: onChangeFilterValue },
    fieldState: { invalid },
  } = useController({
    control,
    name: name,
    rules: {
      required: isRequire,
    },
  });

  const {
    field: { value: orderBy, onChange: onChangeOrderBy },
  } = useController({
    control,
    //@ts-ignore
    name: 'OrderBy',
  });

  const {
    field: { value: sortType, onChange: onChangeSortType },
  } = useController({
    control,
    //@ts-ignore
    name: 'SortType',
  });

  const _onPressTitle = useCallback(() => {
    if (hideBottomSheet) {
      if (orderBy !== name) {
        onChangeOrderBy(name);
      } else {
        onChangeSortType(
          sortType === SortType.Asc ? SortType.Desc : SortType.Asc,
        );
      }

      hideBottomSheet();
    } else {
      bottomSheetRef.current?.present(
        // eslint-disable-next-line no-nested-ternary
        filterValue === undefined
          ? undefined
          : filterValue === null && !removeAll
          ? {
              t18n: t18nAll,
              key: null,
            }
          : typeDetails[filterValue],
      );
    }
  }, [
    filterValue,
    hideBottomSheet,
    name,
    onChangeOrderBy,
    onChangeSortType,
    orderBy,
    removeAll,
    sortType,
    t18nAll,
    typeDetails,
  ]);

  const _ValueView = useCallback((val: any, isValid: boolean) => {
    if (ValueView) {
      return ValueView(val, isValid);
    }

    return (
      <>
        {/* @ts-ignore */}
        {typeDetails[val as T]?.icon && (
          <Icon
            //@ts-ignore
            icon={typeDetails[val as T].icon}
            colorTheme={
              //@ts-ignore
              isValid ? 'error400' : typeDetails[val as T]?.iconColorTheme
            }
            size={16}
          />
        )}
        <Block>
          <Text
            numberOfLines={numberOfLines}
            fontStyle="Body14Reg"
            colorTheme={isValid ? 'error400' : colorThemeValue ?? 'neutral900'}
            //@ts-ignore
            t18n={typeDetails[val as T]?.t18n}
          />
        </Block>
      </>
    );
  }, []);

  const onPicDone = useCallback((val: any, cb?: () => void) => {
    //@ts-ignore
    onChangeFilterValue(val?.key);
    onChangeValue?.(val);
    cb?.();
  }, []);

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
      <Block
        flexDirection="row"
        alignItems="center"
        colorTheme={colorTheme}
        opacity={opacity}>
        <Pressable
          disabled={disable}
          style={[
            styles.leftContainer,
            { paddingLeft: orderBy === name ? 8 : 16 },
          ]}
          onPress={_onPressTitle}>
          {orderBy === name && (
            <Icon
              icon={
                sortType === SortType.Asc ? 'sort_up_fill' : 'sort_down_fill'
              }
              colorTheme="primary500"
              size={18}
            />
          )}
          <Text
            t18n={t18n}
            fontStyle={
              titleFontStyle ??
              (!fixedTitleFontStyle &&
              filterValue !== undefined &&
              filterValue !== null
                ? 'Title16Semi'
                : 'Body16Reg')
            }
            colorTheme="neutral900"
          />
          {isRequire && (
            <Text text="*" fontStyle="Body16Reg" colorTheme="error500" />
          )}
        </Pressable>
        <Pressable
          disabled={disable}
          style={styles.rightContainer}
          onPress={() => {
            bottomSheetRef.current?.present(
              // eslint-disable-next-line no-nested-ternary
              filterValue === undefined
                ? undefined
                : filterValue === null && !removeAll
                ? {
                    t18n: t18nAll,
                    key: null,
                  }
                : typeDetails[filterValue],
            );
          }}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            {filterValue !== undefined && filterValue !== null ? (
              _ValueView(filterValue, invalid)
            ) : (
              <Text
                fontStyle="Body14Reg"
                colorTheme={invalid ? 'error400' : 'neutral700'}
                t18n={t18nAll}
              />
            )}
            {(!disable || showRightIcon) && (
              <Icon
                icon="arrow_ios_right_outline"
                colorTheme={
                  // eslint-disable-next-line no-nested-ternary
                  invalid
                    ? 'error400'
                    : filterValue !== undefined && filterValue !== null
                    ? 'neutral900'
                    : 'neutral700'
                }
                size={20}
              />
            )}
          </Block>
        </Pressable>
      </Block>
      {!disable && (
        <BottomSheet<TFieldValues>
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
