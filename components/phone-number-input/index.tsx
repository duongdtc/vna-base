/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-native/no-unused-styles */
import {
  Block,
  Icon,
  ModalCountryPicker,
  RowOfForm,
  Separator,
  Text,
} from '@components';
import { ModalCountryPickerRef } from '@components/modal-country-picker/type';
import { PassengerForm } from '@screens/flight/type';
import { CountryCode, CountryRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { useStyles, useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { ActiveOpacity, rxNumber, rxPhone } from '@utils';
import isEmpty from 'lodash.isempty';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useController, useFormContext } from 'react-hook-form';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CountryFlag from 'react-native-country-flag';

export const PhoneNumberInput = ({
  nameCountryCode,
  namePhoneInput,
  defaultCountryCode = 'VN',
  required,
  onSubmitEditing,
}: {
  nameCountryCode: string;
  namePhoneInput: string;
  defaultCountryCode?: CountryCode;
  required?: boolean;
  onSubmitEditing?: () => void;
}) => {
  const styles = useStyle();
  const { control, setValue } = useFormContext<PassengerForm>();
  const modalCountryRef = useRef<ModalCountryPickerRef>(null);
  const realm = useRealm();
  const [isFocus, setIsFocus] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    field: { value: phoneValue },
    fieldState: { error },
  } = useController({
    control,
    //@ts-ignore
    name: namePhoneInput,
    rules: { pattern: rxNumber, required },
  });

  useEffect(() => {
    if (isEmpty(error)) {
      setIsError(false);
    } else {
      setIsError(true);
    }
  }, [error]);

  return (
    <Block>
      <Block
        padding={12}
        colorTheme="neutral100"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Block flexDirection="row" columnGap={4} paddingLeft={4}>
          <Text text="Mã vùng" fontStyle="Body16Reg" colorTheme="neutral100" />
        </Block>
        <Controller
          control={control}
          //@ts-ignore
          name={nameCountryCode}
          defaultValue={defaultCountryCode}
          render={({ field: { value } }) => {
            const country = realm.objectForPrimaryKey<CountryRealm>(
              CountryRealm.schema.name,
              value as string,
            );
            return (
              <Block>
                <TouchableOpacity
                  activeOpacity={ActiveOpacity}
                  //@ts-ignore
                  onPress={() => modalCountryRef.current?.present(value)}
                  style={styles.dialCode}>
                  <Block
                    style={{ paddingVertical: 5 }}
                    paddingHorizontal={2}
                    overflow="hidden">
                    {/* @ts-ignore */}
                    <CountryFlag isoCode={value?.toLowerCase()} size={14} />
                  </Block>
                  <Text
                    text={country?.DialCode}
                    fontStyle="Body14Reg"
                    colorTheme="neutral900"
                    style={{ marginHorizontal: 4 }}
                  />
                  <Icon
                    icon="arrow_ios_right_fill"
                    size={16}
                    colorTheme="neutral900"
                  />
                </TouchableOpacity>
              </Block>
            );
          }}
        />
        <ModalCountryPicker
          ref={modalCountryRef}
          t18nTitle="flight:select_country"
          handleDone={countryCode => {
            setValue('ContactInfo.CountryCode', countryCode!);
          }}
          showDialCode={true}
        />
      </Block>
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassengerForm>
        t18n="order:phone"
        name="ContactInfo.PhoneNumber"
        fixedTitleFontStyle={true}
        control={control}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        pattern={rxNumber}
        isRequire
        maxLength={15}
        style={[styles.textInput, FontStyle.Body16Reg]}
        // placeholderTextColor={styles.placeholder.color}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
          if (required && (!phoneValue || phoneValue === '')) {
            setIsError(true);
          } else {
            setIsError(false);
          }
        }}
        onSubmitEditing={onSubmitEditing}
      />
      <Separator type="horizontal" size={3} />
    </Block>
  );
};

const useStyle = () => {
  const {
    theme: { colors },
  } = useStyles();

  return useMemo(
    () =>
      StyleSheet.create({
        dialCode: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          width: 104,
          paddingLeft: 24,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          backgroundColor: colors.neutral10,
        },
        textInput: { flex: 1, paddingLeft: 12, color: colors.neutral900 },
        placeholder: {
          color: colors.neutral600,
        },
      }),
    [colors],
  );
};
