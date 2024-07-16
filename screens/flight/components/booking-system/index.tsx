/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, BottomSheet, Button, Icon, Switch, Text } from '@vna-base/components';
import { ListRef, ListRenderItemParams } from '@vna-base/components/bottom-sheet/type';
import { selectDiscounts } from '@redux-selector';
import { Discount } from '@redux/type';
import { OptionsForm } from '@vna-base/screens/flight/type';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, HitSlop, SnapPoint } from '@vna-base/utils';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  LayoutAnimation,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { useTheme } from '@theme';
import { useTranslation } from 'react-i18next';

export const BookingSystem = memo(({ index }: { index: number }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const [t] = useTranslation();
  const bottomSheetRef = useRef<ListRef<Discount>>(null);

  const discounts = useSelector(selectDiscounts);

  const { control, setValue, getValues } = useFormContext<OptionsForm>();

  const {
    key: Code,
    t18n: NameVi,
    selected,
    UserDiscount,
    SystemDiscount,
  } = useWatch({
    control,
    name: `BookingSystems.${index}`,
  });

  const options = useMemo(() => {
    const temp = [...(discounts[Code] ?? [])];

    temp.unshift({
      //@ts-ignore
      code: null,
      title: 'flight:select_discount',
      //@ts-ignore
      describe: null,
    });
    return temp;
  }, [Code, discounts]);

  const onChangeToggle = () => {
    setValue(`BookingSystems.${index}.selected`, !selected);

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 240,
    });
  };

  const onChangeText = (txt: string) => {
    setValue(`BookingSystems.${index}.UserDiscount`, txt);
  };

  const onSelectDiscount = (dc: Discount) => {
    setValue(`BookingSystems.${index}.SystemDiscount`, dc);
  };

  const selectOnlyThisSystem = () => {
    const newBookingSystems = getValues().BookingSystems;

    newBookingSystems.forEach((sys, i) => {
      sys.selected = i === index;
    });

    setValue('BookingSystems', newBookingSystems);

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.spring,
      duration: 240,
    });
  };

  const renderItem = useCallback(
    ({
      item,
      selected: _selected,
      onPress,
    }: ListRenderItemParams<Discount>) => {
      const isSelected = _selected?.code === item?.code;

      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          style={[
            styles.statusItemContainer,
            isSelected && styles.selectedStatusItemContainer,
          ]}
          onPress={onPress}>
          <Block flex={1}>
            <Text
              fontStyle={isSelected ? 'Title16Semi' : 'Body16Reg'}
              colorTheme={isSelected ? 'neutral900' : 'neutral800'}
              t18n={item?.title as I18nKeys}
            />
            {item.describe && (
              <Text
                fontStyle="Body12Reg"
                colorTheme={isSelected ? 'warning600' : 'neutral600'}
                text={item?.describe}
              />
            )}
          </Block>
          {isSelected && (
            <Icon icon="checkmark_fill" colorTheme="primary600" size={24} />
          )}
        </TouchableOpacity>
      );
    },
    [styles.selectedStatusItemContainer, styles.statusItemContainer],
  );

  return (
    <Block
      borderWidth={10}
      colorTheme="neutral50"
      borderColorTheme="neutral200"
      overflow="hidden"
      borderRadius={8}>
      <Block style={styles.header}>
        <Block flex={1}>
          <Text
            t18n={NameVi}
            fontStyle="Body14Reg"
            colorTheme="neutral800"
            numberOfLines={1}
            ellipsizeMode="tail"
          />
        </Block>
        <Pressable
          hitSlop={{ ...HitSlop.LargeInset, right: 6 }}
          onPress={selectOnlyThisSystem}>
          <Text
            t18n="flight:only_this_system"
            fontStyle="Capture11Reg"
            colorTheme="primary500"
          />
        </Pressable>
        <Pressable
          onPress={onChangeToggle}
          hitSlop={{ ...HitSlop.LargeInset, left: 6 }}>
          <Switch value={selected} disable opacity={1} />
        </Pressable>
      </Block>
      {selected && (
        <Block
          borderRadius={8}
          paddingHorizontal={12}
          flexDirection="row"
          paddingVertical={12}
          colorTheme="neutral100">
          <TextInput
            placeholder={t('flight:fill_discount_code')}
            placeholderTextColor={colors.neutral600}
            style={styles.input}
            defaultValue={UserDiscount}
            onChangeText={txt => {
              onChangeText(txt);
            }}
          />
          <Button
            hitSlop={HitSlop.Small}
            rightIcon="arrow_ios_down_fill"
            rightIconSize={14}
            size="small"
            t18n={SystemDiscount?.title as I18nKeys}
            textColorTheme="primary600"
            type="lowSat"
            onPress={() => bottomSheetRef.current?.present(SystemDiscount)}
            buttonStyle={{ borderRadius: 16 }}
          />
        </Block>
      )}
      <BottomSheet<Discount>
        ref={bottomSheetRef}
        type="list"
        keyExtractor={(_, idx) => idx.toString()}
        data={options}
        renderItem={renderItem}
        oneStep={true}
        t18nTitle="flight:select_discount"
        onDone={(val, cb) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onSelectDiscount(val!);
          cb?.();
        }}
        snapPoints={[SnapPoint['50%']]}
        showSearchInput={false}
      />
    </Block>
  );
}, isEqual);
