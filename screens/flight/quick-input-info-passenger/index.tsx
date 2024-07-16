import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { flightBookingFormActions } from '@redux-slice';
import { useTheme } from '@theme';
import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { translate } from '@vna-base/translations/translate';
import {
  Gender,
  dispatch,
  getState,
  typeGenderFemale,
  typeGenderMale,
  typePassengerWithGender,
} from '@vna-base/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStyles } from './style';
import { APP_SCREEN, RootStackParamList } from '@utils';

const regexInputValidWithDob =
  /(\S+)\s*([^\d]+)?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/;
const regexInputValidWithoutDob = /(\S+)\s*([^\d]*)/;

export const QuickInputInfoPassenger = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.QUICK_INPUT_SCREEN
>) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const { onSubmitQuickInput } = route.params;

  const [valueQuickInput, setValueQuickInput] = useState('');

  const processString = useCallback((strInput: string) => {
    const lines = strInput.split('\n');
    const result: {
      [x: string]: any;
    }[] = [];

    for (const line of lines) {
      regexInputValidWithDob.lastIndex = 0;
      regexInputValidWithoutDob.lastIndex = 0;

      const matches =
        line.match(regexInputValidWithDob) ??
        line.match(regexInputValidWithoutDob);

      if (matches) {
        const [, lastName, firstName, dob] = matches;
        const fullName = firstName ? `${lastName} ${firstName}` : lastName;

        let FullNameRemoveAccent = fullName;
        if (fullName.toLowerCase().includes('đ')) {
          FullNameRemoveAccent = fullName.replaceAll('đ', 'd');
        }

        // xác định fullname
        const filteredName = FullNameRemoveAccent.split(' ').filter(
          word =>
            !typeGenderMale.includes(word.toLowerCase()) &&
            !typeGenderFemale.includes(word.toLowerCase()),
        );

        const filteredName2 = FullNameRemoveAccent.split(' ').filter(
          word =>
            typeGenderMale.includes(word.toLowerCase()) ||
            typeGenderFemale.includes(word.toLowerCase()),
        );

        const FullName = filteredName.join(' ');

        //  xác định gender passenger
        let gender;

        filteredName2.forEach(prefix => {
          if (typeGenderMale.includes(prefix.toLowerCase())) {
            gender = Gender.Male;
          } else if (typeGenderFemale.includes(prefix.toLowerCase())) {
            gender = Gender.Female;
            return;
          } else {
            gender = Gender.Male;
          }
        });

        // xác định birthday passenger
        let dateParts;
        if (dob) {
          if (dob.trim().includes('/')) {
            dateParts = dob.split('/');
          } else {
            const day = dob.trim().slice(0, 2);
            const month = dob.trim().slice(2, 4);
            const year = dob.trim().slice(4);

            dateParts = [day, month, year];
          }

          // nếu người dùng nhập vào số ngày, số tháng nhỏ hơn 10 thì thêm số 0 ở đầu.
          // VD: 1/1/98 = 01/01/1998
          if (dateParts[0].length === 1 && Number(dateParts[0]) < 10) {
            dateParts[0] = `0${dateParts[0]}`;
          } else {
            dateParts[0];
          }

          if (dateParts[1].length === 1 && Number(dateParts[1]) < 10) {
            dateParts[1] = `0${dateParts[1]}`;
          } else {
            dateParts[1];
          }

          // nếu người dùng nhập vào format không đúng định dạng ngày, tháng khác
          // ngày: [1,2,3,4,5,6,7,8,9,10,11,12,...,30,31] hoặc [01,02,03,04,05,06,07,08,09,10,11,12,...,30,31]
          // tháng: [1,2,3,4,5,6,7,8,9,10,11,12] hoặc [01,02,03,04,05,06,07,08, 09,10,11,12]
          // thì trả về ngày = 01, tháng = 01
          if (dateParts[0].length === 2 && Number(dateParts[0]) > 31) {
            dateParts[0] = '01';
          } else {
            dateParts[0];
          }

          if (dateParts[1].length === 2 && Number(dateParts[1]) > 12) {
            dateParts[1] = '01';
          } else {
            dateParts[1];
          }

          // nếu người dùng nhập vào năm sinh 2 số và đuôi năm sinh lớn hơn đuôi năm hiện tại
          // thì thêm '19' ở đầu, nếu không thì thêm '20' ở đầu: VD:  98 = 1998; 99 = 1999, 01 = 2001
          if (dateParts[2].length === 2) {
            if (
              Number(dateParts[2]) >
              Number(new Date().getFullYear().toString().slice(2, 4))
            ) {
              dateParts[2] = `19${dateParts[2]}`;
            } else {
              dateParts[2] = `20${dateParts[2]}`;
            }
          }

          if (dateParts[2].length === 3) {
            if (
              Number(dateParts[2].toString().slice(1)) >
              Number(new Date().getFullYear().toString().slice(2, 4))
            ) {
              dateParts[2] = `19${dateParts[2].toString().slice(1)}`;
            } else {
              dateParts[2] = `20${dateParts[2].toString().slice(1)}`;
            }
          }

          if (dateParts[2] > new Date().getFullYear().toString()) {
            dateParts[2] = '2023';
          }

          const formattedDate = new Date(
            `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
          );

          result.push({
            FullName: FullName.trim().toUpperCase(),
            Birthday: formattedDate,
            Gender: gender,
          });
        } else {
          result.push({
            FullName: FullName.trim().toUpperCase(),
            Birthday: undefined,
            Gender: gender,
          });
        }
      }
    }

    return result;
  }, []);

  useEffect(() => {
    const prevString = getState('flightBookingForm').quickInfoPassengers;

    if (prevString !== null && prevString !== undefined && prevString !== '') {
      setValueQuickInput(prevString);
    }
  }, []);

  const submit = useCallback(() => {
    dispatch(flightBookingFormActions.saveQuickInputInfo(valueQuickInput));
    onSubmitQuickInput(
      processString(valueQuickInput.toLowerCase().removeAccent()),
    );
    goBack();
  }, [onSubmitQuickInput, processString, valueQuickInput]);

  return (
    <Screen unsafe backgroundColor={colors.neutral100}>
      <NormalHeader
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
            t18n="input_info_passenger:quick_input_passenger_title"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1} colorTheme="neutral50">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <Block
            flex={1}
            marginTop={12}
            paddingVertical={12}
            colorTheme="neutral100">
            <Block
              colorTheme="neutral100"
              borderWidth={5}
              height={200}
              borderRadius={8}
              padding={12}
              marginVertical={12}
              marginHorizontal={16}
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              borderColorTheme="neutral300">
              <TextInput
                placeholder={translate('input_info_passenger:plh_quick_input')}
                placeholderTextColor={colors.neutral600}
                value={valueQuickInput}
                onChangeText={setValueQuickInput}
                style={styles.textInput}
                multiline
              />
            </Block>
            <Block paddingHorizontal={12}>
              <Text
                t18n="input_info_passenger:des_quick_input"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
              />
              <Text
                t18n="input_info_passenger:des_quick_input3"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
                style={{ marginTop: 12 }}
              />
              {typePassengerWithGender.map(passenger => {
                return (
                  <Block key={passenger.key}>
                    <Block
                      flexDirection="row"
                      alignItems="flex-start"
                      columnGap={8}
                      paddingLeft={8}>
                      <Block
                        width={5}
                        height={5}
                        borderRadius={4}
                        style={{ marginTop: 6 }}
                        colorTheme="neutral800"
                      />
                      <Block
                        flexDirection="row"
                        alignItems="center"
                        flexWrap="wrap"
                        columnGap={4}>
                        <Text
                          t18n={passenger.t18n}
                          fontStyle="Body14Reg"
                          colorTheme="neutral900"
                        />
                        <Text
                          t18n={passenger.des_t18n}
                          fontStyle={
                            passenger.key === 3 ? 'Body14Bold' : 'Body14Reg'
                          }
                          colorTheme="neutral900"
                        />
                      </Block>
                    </Block>
                    <Block>
                      {passenger.subData.map(item => {
                        return (
                          <Block
                            key={item.key}
                            flexDirection="row"
                            alignItems="center"
                            columnGap={8}
                            paddingLeft={24}>
                            <Text
                              text="*"
                              fontStyle="Body12Med"
                              colorTheme="neutral900"
                            />
                            <Text
                              t18n={item.t18n}
                              fontStyle="Body12Med"
                              colorTheme="neutral900"
                            />
                          </Block>
                        );
                      })}
                    </Block>
                  </Block>
                );
              })}
              <Text
                t18n="input_info_passenger:des_quick_input2"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
                style={{ marginTop: 12 }}
              />
            </Block>
          </Block>
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
    </Screen>
  );
};
