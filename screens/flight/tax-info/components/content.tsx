import {
  Block,
  Button,
  PhoneNumberInput,
  RowOfForm,
  Separator,
  Text,
} from '@vna-base/components';
import { MaxLengthFullName, rxEmail } from '@vna-base/utils';
import React, { memo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { TaxInfo as TaxInfoType } from '@vna-base/screens/flight/type';
import isEqual from 'react-fast-compare';
import { useStyles } from '../styles';

type Props = {
  onSubmit: () => void;
};

export const MainContent = memo((props: Props) => {
  const styles = useStyles();
  const { onSubmit } = props;
  const { control, setFocus } = useFormContext<TaxInfoType>();

  const { isValid } = useFormState({
    control,
  });

  return (
    <Block flex={1} colorTheme="neutral50">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block
            margin={12}
            borderRadius={8}
            overflow="hidden"
            colorTheme="neutral100"
            marginTop={16}>
            <RowOfForm<TaxInfoType>
              t18n="tax_info:company_name"
              name="CompanyName"
              maxLength={MaxLengthFullName}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="done"
              isRequire
              onSubmitEditing={() => {
                setFocus('TIN');
              }}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<TaxInfoType>
              t18n="tax_info:tin"
              name="TIN"
              maxLength={MaxLengthFullName}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="done"
              onSubmitEditing={() => {
                setFocus('Address');
              }}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<TaxInfoType>
              t18n="tax_info:address"
              name="Address"
              maxLength={MaxLengthFullName}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="done"
              isRequire
              onSubmitEditing={() => {
                setFocus('ReceiverInfo.FullName');
              }}
            />
          </Block>
          <Block marginTop={12} paddingHorizontal={16}>
            <Text
              t18n="tax_info:receiver_info"
              fontStyle="H320Semi"
              colorTheme="neutral900"
            />
          </Block>
          <Block paddingTop={8} paddingBottom={16} marginHorizontal={12}>
            <Block borderRadius={8} overflow="hidden">
              <PhoneNumberInput
                nameCountryCode="ReceiverInfo.CountryCode"
                namePhoneInput="ReceiverInfo.PhoneNumber"
              />
              <RowOfForm<TaxInfoType>
                t18n="tax_info:full_name"
                name="ReceiverInfo.FullName"
                maxLength={MaxLengthFullName}
                returnKeyType="next"
                onSubmitEditing={() => {
                  setFocus('ReceiverInfo.PhoneNumber');
                }}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<TaxInfoType>
                t18n="tax_info:email"
                name="ReceiverInfo.Email"
                maxLength={MaxLengthFullName}
                pattern={rxEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                isRequire
                onSubmitEditing={() => {
                  setFocus('ReceiverInfo.Address');
                }}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<TaxInfoType>
                t18n="tax_info:address"
                name="ReceiverInfo.Address"
                maxLength={MaxLengthFullName}
                pattern={rxEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
              />
              <Separator type="horizontal" size={3} />
            </Block>
          </Block>
        </ScrollView>
      </KeyboardAvoidingView>
      <Block
        colorTheme="neutral100"
        padding={12}
        marginBottom={2}
        shadow="main"
        style={styles.footerContainer}>
        <Button
          fullWidth
          size="medium"
          disabled={!isValid}
          t18n="input_info_passenger:confirm"
          buttonColorTheme="graPre"
          onPress={onSubmit}
          textColorTheme="white"
        />
      </Block>
    </Block>
  );
}, isEqual);
