import {
  Block,
  Button,
  DatePicker,
  Icon,
  ModalCountryPicker,
  NormalHeader,
  Screen,
  Text,
  TextInput,
} from '@vna-base/components';
import { DatePickerRef } from '@vna-base/components/date-picker/type';
import { ModalCountryPickerRef } from '@vna-base/components/modal-country-picker/type';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CountryCode, CountryRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { useTheme } from '@theme';
import { ActiveOpacity } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AdditionalPassengerInfoForm } from '../type';
import { AddMembershipCardNumb } from './components/membership-card-item';
import { useStyles } from './style';

export const AdditionalInfoScreen = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.ADDITIONAL_INFO>) => {
  const { initData, onSubmit } = route.params;
  const { colors } = useTheme();
  const styles = useStyles();
  const [t] = useTranslation();

  const datePickerRef = useRef<DatePickerRef>(null);
  const modalNationalRef = useRef<ModalCountryPickerRef>(null);
  const modalPlaceSupplyRef = useRef<ModalCountryPickerRef>(null);

  const formMethod = useForm<AdditionalPassengerInfoForm>({
    mode: 'all',
    defaultValues: initData,
  });

  const { fields } = useFieldArray({
    control: formMethod.control,
    name: 'ListMembership',
  });

  const _openModalRegion = (type: 'Nationality' | 'IssueCountry') => {
    switch (type) {
      case 'Nationality':
        modalNationalRef.current?.present(formMethod.getValues().Nationality);

        break;

      default:
        modalPlaceSupplyRef.current?.present(
          formMethod.getValues().IssueCountry,
        );

        break;
    }
  };

  const onChangeNationality = (val: CountryCode | undefined) => {
    formMethod.setValue('Nationality', val);

    if (formMethod.getValues().IssueCountry === undefined) {
      formMethod.setValue('IssueCountry', val);
    }
  };

  const onChangePlaceSupply = (val: CountryCode | undefined) => {
    formMethod.setValue('IssueCountry', val);
  };

  const _onSubmit = (data: AdditionalPassengerInfoForm) => {
    onSubmit(data);
  };

  const submit = () => {
    goBack();
  };

  const nationals = (value: string) => {
    return realmRef.current?.objectForPrimaryKey<CountryRealm>(
      CountryRealm.schema.name,
      value,
    );
  };

  useEffect(() => {
    return () => {
      formMethod.handleSubmit(_onSubmit)();
    };
  }, []);

  const _renderValue = (
    countryCode: CountryCode | undefined,
    type: 'Nationality' | 'IssueCountry',
  ) => {
    return (
      <Block
        flexDirection="row"
        alignItems="center"
        columnGap={4}
        paddingLeft={4}>
        {countryCode && (
          <Block borderRadius={2} overflow="hidden">
            <CountryFlag isoCode={countryCode.toLowerCase()} size={14} />
          </Block>
        )}
        <Text
          colorTheme={countryCode ? 'neutral900' : 'neutral600'}
          fontStyle="Body16Reg"
          text={
            countryCode
              ? nationals(countryCode as string)?.NameVi ??
                nationals(countryCode as string)?.NameEn
              : t(
                  type === 'Nationality'
                    ? 'input_info_passenger:nationality'
                    : 'input_info_passenger:place_issuance',
                )
          }
        />
      </Block>
    );
  };

  return (
    <Screen unsafe backgroundColor={colors.neutral100}>
      <NormalHeader
        // borderBottomWidth={3}
        // borderColorTheme="neutral200"
        leftContent={
          <Button
            leftIcon="arrow_ios_left_outline"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            t18n="input_info_passenger:additional_info"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1} colorTheme="neutral50">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <FormProvider {...formMethod}>
            <Block
              rowGap={16}
              marginTop={12}
              paddingVertical={16}
              paddingHorizontal={12}
              colorTheme="neutral100">
              <Controller
                control={formMethod.control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    labelI18n="input_info_passenger:passport_number"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value}
                    onChangeText={onChange}
                  />
                )}
                name={'DocumentCode'}
              />
              <Controller
                control={formMethod.control}
                name="Nationality"
                render={({ field: { value } }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={ActiveOpacity}
                      onPress={() => _openModalRegion('Nationality')}
                      style={styles.row}>
                      {_renderValue(value, 'Nationality')}
                      <Icon
                        icon="arrow_ios_down_fill"
                        size={24}
                        colorTheme="primary600"
                        onPress={() => _openModalRegion('Nationality')}
                      />
                      {value && (
                        <Block
                          position="absolute"
                          left={8}
                          style={{ top: -16 }}
                          colorTheme="neutral100"
                          padding={4}>
                          <Text
                            colorTheme={'neutral600'}
                            fontStyle="Body12Reg"
                            t18n="input_info_passenger:nationality"
                          />
                        </Block>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
              <Controller
                control={formMethod.control}
                name="IssueCountry"
                render={({ field: { value } }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={ActiveOpacity}
                      onPress={() => _openModalRegion('IssueCountry')}
                      style={styles.row}>
                      {_renderValue(value, 'IssueCountry')}
                      <Icon
                        icon="arrow_ios_down_fill"
                        size={24}
                        colorTheme="primary600"
                        onPress={() => _openModalRegion('IssueCountry')}
                      />
                      {value && (
                        <Block
                          position="absolute"
                          left={8}
                          style={{ top: -16 }}
                          colorTheme="neutral100"
                          padding={4}>
                          <Text
                            colorTheme={'neutral600'}
                            fontStyle="Body12Reg"
                            t18n="input_info_passenger:place_issuance"
                          />
                        </Block>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
              <Controller
                control={formMethod.control}
                render={({ field: { onChange, value } }) => {
                  const showDatePicker = () => {
                    datePickerRef.current?.open({
                      date: value ?? new Date(),
                    });
                  };

                  return (
                    <Block flex={1}>
                      <TouchableOpacity
                        activeOpacity={ActiveOpacity}
                        onPress={showDatePicker}
                        style={styles.row}>
                        <Text>
                          <Text
                            colorTheme={value ? 'neutral900' : 'neutral600'}
                            fontStyle="Body16Reg"
                            t18n={
                              !value
                                ? 'input_info_passenger:expired_date'
                                : undefined
                            }
                            text={
                              value
                                ? dayjs(value).format('DD/MM/YYYY')
                                : undefined
                            }
                          />
                        </Text>
                        <Icon
                          icon="calendar_fill"
                          size={24}
                          colorTheme="primary600"
                        />
                        {value && (
                          <Block
                            flexDirection="row"
                            position="absolute"
                            left={8}
                            style={{ top: -16 }}
                            colorTheme="neutral100"
                            padding={4}>
                            <Text
                              colorTheme="neutral600"
                              fontStyle="Body12Reg"
                              t18n="input_info_passenger:expired_date"
                            />
                          </Block>
                        )}
                      </TouchableOpacity>
                      <DatePicker
                        ref={datePickerRef}
                        minimumDate={dayjs().toDate()}
                        t18nTitle="input_info_passenger:expired_date"
                        submit={date => onChange(date)}
                      />
                    </Block>
                  );
                }}
                name={'DocumentExpiry'}
              />
              {fields.map(({ Airline }, index) => (
                <AddMembershipCardNumb
                  airline={Airline}
                  index={index}
                  key={index}
                />
              ))}
            </Block>
          </FormProvider>
        </KeyboardAwareScrollView>
      </Block>
      <Block
        colorTheme="neutral100"
        padding={12}
        marginBottom={2}
        shadow="main"
        style={styles.footerContainer}>
        <Button
          fullWidth
          t18n="input_info_passenger:confirm"
          buttonColorTheme="primary600"
          onPress={submit}
          textColorTheme="white"
        />
      </Block>
      <ModalCountryPicker
        ref={modalNationalRef}
        t18nTitle="flight:select_country"
        isCanReset
        handleDone={countryCode => {
          onChangeNationality(countryCode);
        }}
        showDialCode={false}
      />
      <ModalCountryPicker
        ref={modalPlaceSupplyRef}
        t18nTitle="input_info_passenger:place_issuance"
        isCanReset
        handleDone={countryCode => {
          onChangePlaceSupply(countryCode);
        }}
        showDialCode={false}
      />
    </Screen>
  );
};
