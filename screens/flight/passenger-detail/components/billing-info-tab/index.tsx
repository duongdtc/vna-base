import { navigate } from '@navigation/navigation-service';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import {
  Block,
  Icon,
  PhoneNumberInput,
  RowOfForm,
  Separator,
  Text,
} from '@vna-base/components';
import { PassengerForm, TaxInfo } from '@vna-base/screens/flight/type';
import { ActiveOpacity, rxEmail } from '@vna-base/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export const BillingInfoTab = () => {
  const { styles } = useStyles(styleSheet);
  const { control, getValues, setValue, setFocus } =
    useFormContext<PassengerForm>();

  const navToTaxInfo = () => {
    navigate(APP_SCREEN.TAX_INFO, {
      taxInfo: getValues().ContactInfo.TaxInfo,
      onSubmit: (taxInfo: TaxInfo) => {
        setValue('ContactInfo.TaxInfo', taxInfo);
      },
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}>
        <Block
          borderRadius={8}
          marginTop={16}
          overflow="hidden"
          colorTheme="neutral100">
          <PhoneNumberInput
            nameCountryCode="ContactInfo.CountryCode"
            namePhoneInput="ContactInfo.PhoneNumber"
            required={true}
            onSubmitEditing={() => {
              setFocus('ContactInfo.Email');
            }}
          />
          <RowOfForm<PassengerForm>
            t18n="order:email"
            name="ContactInfo.Email"
            fixedTitleFontStyle={true}
            control={control}
            keyboardType="email-address"
            textContentType="emailAddress"
            maxLength={120}
            pattern={rxEmail}
            isRequire
          />
          {/* <Separator type="horizontal" size={3} />
          <RowOfForm<PassengerForm>
            t18n="order:contact"
            name="ContactInfo.FullName"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={80}
          /> */}
          <Separator type="horizontal" size={3} />
          <RowOfForm<PassengerForm>
            t18n="input_info_passenger:address"
            name="ContactInfo.Address"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={120}
            textContentType="fullStreetAddress"
          />
          <Separator type="horizontal" size={3} />
          <RowOfForm<PassengerForm>
            t18n="input_info_passenger:note"
            name="ContactInfo.Note"
            fixedTitleFontStyle={true}
            control={control}
            maxLength={120}
            textContentType="fullStreetAddress"
          />
        </Block>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={navToTaxInfo}
          style={styles.taxInfoBtn}>
          <Text
            t18n="input_info_passenger:tax_info"
            fontStyle="Title16Semi"
            colorTheme="neutral100"
          />
          <Icon icon="arrow_ios_right_fill" size={24} colorTheme="neutral800" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  toggleContainer: {
    flexDirection: 'row',
    padding: spacings[8],
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taxInfoBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacings[12],
    borderRadius: spacings[8],
    backgroundColor: colors.neutral10,
    marginTop: spacings[12],
  },
}));
