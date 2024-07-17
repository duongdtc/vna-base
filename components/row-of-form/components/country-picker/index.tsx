/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, ModalCountryPicker, Text } from '@vna-base/components';
import { ModalCountryPickerRef } from '@vna-base/components/modal-country-picker/type';
import {
  CommonProps,
  CountryPicker as CountryPickerType,
} from '@vna-base/components/row-of-form/type';
import { selectLanguage } from '@vna-base/redux/selector';
import { SortType } from '@services/axios';
import { CountryCode, CountryRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import React, { useCallback, useMemo, useRef } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from '../../styles';

export function CountryPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: CountryPickerType & CommonProps<TFieldValues, TName>) {
  const styles = useStyles();
  const Lng = useSelector(selectLanguage);
  const modalNationalRef = useRef<ModalCountryPickerRef>(null);
  const {
    t18n,
    hideBottomSheet,
    control,
    name,
    isRequire,
    disable,
    fixedTitleFontStyle,
    colorThemeValue,
    titleFontStyle,
    ValueView,
    numberOfLines = 2,
    colorTheme = 'neutral100',
  } = props;

  const {
    field: { value: countryCode, onChange: onChangeNation },
  } = useController({
    control: control,
    //@ts-ignore
    name: name,
  });

  const {
    field: { value: orderBy, onChange: onChangeOrderBy },
  } = useController({
    control: control,
    //@ts-ignore
    name: 'OrderBy',
  });

  const {
    field: { value: sortType, onChange: onChangeSortType },
  } = useController({
    control: control,
    //@ts-ignore
    name: 'SortType',
  });

  const val = useMemo(() => {
    if (ValueView) {
      return ValueView(countryCode);
    }

    const country = countryCode
      ? realmRef.current?.objectForPrimaryKey<CountryRealm>(
          CountryRealm.schema.name,
          countryCode as CountryCode,
        )
      : null;

    return Lng === 'en' ? country?.NameEn : country?.NameVi;
  }, [Lng, ValueView, countryCode]);

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
      modalNationalRef.current?.present(countryCode as CountryCode);
    }
  }, []);

  return (
    <Block flexDirection="row" alignItems="center" colorTheme={colorTheme}>
      <Pressable
        disabled={disable}
        style={[
          styles.leftContainer,
          { paddingLeft: orderBy === name ? 8 : 16 },
        ]}
        onPress={_onPressTitle}>
        {hideBottomSheet && orderBy === name && (
          <Icon
            icon={sortType === SortType.Asc ? 'sort_up_fill' : 'sort_down_fill'}
            colorTheme="primary500"
            size={18}
          />
        )}
        <Text
          t18n={t18n}
          colorTheme="neutral900"
          fontStyle={
            titleFontStyle ??
            (!fixedTitleFontStyle && countryCode ? 'Title16Semi' : 'Body16Reg')
          }
        />
        {isRequire && (
          <Text text="*" fontStyle="Body16Reg" colorTheme="error500" />
        )}
      </Pressable>
      <Pressable
        disabled={disable}
        style={styles.rightContainer}
        onPress={() => {
          modalNationalRef.current?.present(countryCode as CountryCode);
        }}>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          {countryCode ? (
            <Text
              numberOfLines={numberOfLines}
              fontStyle="Body14Reg"
              colorTheme={colorThemeValue ?? 'neutral900'}
              text={val}
            />
          ) : (
            <Text
              fontStyle="Body14Reg"
              colorTheme="neutral700"
              t18n="common:not_fill"
            />
          )}
          {!disable && (
            <Icon
              icon="arrow_ios_right_outline"
              colorTheme={countryCode ? 'neutral900' : 'neutral700'}
              size={20}
            />
          )}
        </Block>
      </Pressable>
      {!disable && (
        <ModalCountryPicker
          ref={modalNationalRef}
          t18nTitle="flight:select_country"
          isCanReset
          handleDone={cc => {
            onChangeNation(cc);
          }}
          showDialCode={false}
        />
      )}
    </Block>
  );
}
